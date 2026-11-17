<?php

declare(strict_types=1);

namespace App\Command;

use App\Dto\Input\GenericImportInputDto;
use App\Entity\Auth\User;
use App\Service\History\Import\HistoryImportFacadeInterface;
use App\Service\Import\Progress\ConsoleImportProgressReporter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:history:import',
    description: 'Import historical data (animal or plant) from a CSV file'
)]
class HistoryImportCommand extends Command
{
    public function __construct(
        private readonly HistoryImportFacadeInterface $historyImportFacade,
        private readonly EntityManagerInterface $entityManager,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function configure(): void
    {
        $this
            ->addArgument('file', InputArgument::REQUIRED, 'Path to the input CSV file')
            ->addOption('type', 't', InputOption::VALUE_OPTIONAL, 'Data type ("animal" or "plant")')
            ->addOption('user', 'u', InputOption::VALUE_OPTIONAL, 'User identifier (email or UUID) for import attribution');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $filePath = (string) $input->getArgument('file');
        if (!file_exists($filePath) || !is_readable($filePath)) {
            $io->error(sprintf('File "%s" does not exist or is not readable.', $filePath));

            return Command::FAILURE;
        }

        // 1. Resolve Type
        $type = $input->getOption('type');
        if (null === $type || '' === trim((string) $type)) {
            if ($input->isInteractive()) {
                $type = $io->choice('Select import type:', ['animal', 'plant'], 'animal');
            } else {
                $io->error('Option --type (-t) is required in non-interactive mode ("animal" or "plant").');

                return Command::FAILURE;
            }
        }

        $type = strtolower(trim((string) $type));
        if (!in_array($type, ['animal', 'plant'], true)) {
            $io->error(sprintf('Invalid type "%s". Allowed types are: animal, plant.', $type));

            return Command::FAILURE;
        }

        // 2. Resolve User
        $userIdentifier = $input->getOption('user');
        $user = null;

        if (null === $userIdentifier || '' === trim((string) $userIdentifier)) {
            if ($input->isInteractive()) {
                $users = $this->entityManager->getRepository(User::class)->findBy([], ['email' => 'ASC']);
                if (empty($users)) {
                    $io->error('No users found in the database.');

                    return Command::FAILURE;
                }

                $userChoices = array_map(fn (User $u) => $u->getEmail(), $users);
                $selectedEmail = $io->choice('Select user for import attribution:', $userChoices);
                $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $selectedEmail]);
            } else {
                $io->error('Option --user (-u) is required in non-interactive mode (specify email or UUID).');

                return Command::FAILURE;
            }
        } else {
            $userIdentifier = trim((string) $userIdentifier);
            $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $userIdentifier]);

            if (null === $user) {
                try {
                    $user = $this->entityManager->getRepository(User::class)->find($userIdentifier);
                } catch (\Throwable) {
                    $user = null;
                }
            }
        }

        if (null === $user) {
            $io->error(sprintf('User "%s" not found.', (string) $userIdentifier));

            return Command::FAILURE;
        }

        // 3. Execute Import
        $io->title(sprintf('Historical Data Import: %s', ucfirst($type)));
        $io->text(sprintf('Input file: %s', $filePath));
        $io->text(sprintf('Attributed user: %s', $user->getEmail()));
        $io->newLine();

        $dto = new GenericImportInputDto(
            filePath: $filePath,
            type: $type,
            user: $user,
        );

        $reporter = new ConsoleImportProgressReporter($io);
        $result = $this->historyImportFacade->import($dto, $reporter);

        // 4. Output Results
        if ($result->success) {
            $io->success(sprintf('Successfully imported %d %s record(s) into the database.', $result->importedCount, $type));

            if ($result->mediaObject) {
                $io->info(sprintf(
                    'MediaObject #%d registered (SHA256: %s, Description: "%s").',
                    $result->mediaObject->getId(),
                    $result->mediaObject->getSha256(),
                    $result->mediaObject->getDescription() ?? ''
                ));
            }

            return Command::SUCCESS;
        }

        $io->error('Import failed! The transaction has been rolled back and 0 records were inserted.');

        if ($result->errorFilePath) {
            $io->warning(sprintf('An error CSV file has been generated at: %s', $result->errorFilePath));
        }

        if (!empty($result->validationErrors)) {
            $tableRows = [];
            foreach (array_slice($result->validationErrors, 0, 15) as $err) {
                $tableRows[] = [
                    $err['row'],
                    implode("\n", $err['errors']),
                ];
            }

            $io->table(['Row', 'Validation Errors'], $tableRows);

            if (count($result->validationErrors) > 15) {
                $io->note(sprintf('... and %d more failing row(s). See the error CSV for complete details.', count($result->validationErrors) - 15));
            }
        }

        return Command::FAILURE;
    }
}

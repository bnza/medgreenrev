<?php

namespace App\Command;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Post;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Yaml\Yaml;

#[AsCommand(
    name: 'app:docs:generate-vocabulary',
    description: 'Generate Markdown documentation from vocabulary fixture files'
)]
class GenerateVocabularyDocsCommand extends Command
{
    public function __construct(
        private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Generating vocabulary documentation');

        $fixturesDir = $this->projectDir.'/fixtures';
        $docsDir = '/srv/docs/user/vocabulary';

        if (!is_dir($docsDir) && !mkdir($docsDir, 0755, true)) {
            $io->error("Cannot create directory: $docsDir");

            return self::FAILURE;
        }

        $blacklist = $this->buildBlacklist($io);
        $fixtureFiles = glob($fixturesDir.'/vocabulary.*.yml');

        if (empty($fixtureFiles)) {
            $io->warning('No vocabulary fixture files found.');

            return self::SUCCESS;
        }

        sort($fixtureFiles);

        $generated = [];

        foreach ($fixtureFiles as $fixtureFile) {
            $result = $this->processFixtureFile($fixtureFile, $docsDir, $blacklist, $io);
            if (null !== $result) {
                $generated[] = $result;
            }
        }

        $this->generateIndex($generated, $docsDir, $io);

        $io->success(sprintf('Generated %d vocabulary files and index.md', count($generated)));

        return self::SUCCESS;
    }

    /**
     * @return array<string> List of FQCN that have Post or Delete operations
     */
    private function buildBlacklist(SymfonyStyle $io): array
    {
        $blacklist = [];
        $entityDir = $this->projectDir.'/src/Entity/Vocabulary';

        $finder = new Finder();
        $finder->files()->name('*.php')->in($entityDir);

        foreach ($finder as $file) {
            $fqcn = $this->resolveClassFromFile($file->getRealPath());
            if (null === $fqcn || !class_exists($fqcn)) {
                continue;
            }

            $reflection = new \ReflectionClass($fqcn);
            $attributes = $reflection->getAttributes(ApiResource::class);

            foreach ($attributes as $attribute) {
                $apiResource = $attribute->newInstance();
                $operations = $apiResource->getOperations();

                if (null === $operations) {
                    continue;
                }

                foreach ($operations as $operation) {
                    if ($operation instanceof Post || $operation instanceof Delete) {
                        $blacklist[] = $fqcn;
                        $io->note(sprintf('Blacklisted (modifiable): %s', $fqcn));
                        break 2;
                    }
                }
            }
        }

        return $blacklist;
    }

    private function resolveClassFromFile(string $filePath): ?string
    {
        $contents = file_get_contents($filePath);
        if (false === $contents) {
            return null;
        }

        $namespace = null;
        $class = null;

        if (preg_match('/namespace\s+([^;]+);/', $contents, $matches)) {
            $namespace = $matches[1];
        }

        if (preg_match('/class\s+(\w+)/', $contents, $matches)) {
            $class = $matches[1];
        }

        if (null !== $namespace && null !== $class) {
            return $namespace.'\\'.$class;
        }

        return null;
    }

    /**
     * @param array<string> $blacklist
     *
     * @return array{filename: string, title: string, group: string|null, entityFqcn: string}|null
     */
    private function processFixtureFile(string $fixtureFile, string $docsDir, array $blacklist, SymfonyStyle $io): ?array
    {
        $data = Yaml::parseFile($fixtureFile);
        if (!is_array($data) || empty($data)) {
            return null;
        }

        $entityFqcn = array_key_first($data);
        $entries = $data[$entityFqcn];

        if (in_array($entityFqcn, $blacklist, true)) {
            $io->note(sprintf('Skipped (modifiable): %s', basename($fixtureFile)));

            return null;
        }

        if (!is_array($entries) || empty($entries)) {
            return null;
        }

        // Derive group and title from entity FQCN
        // e.g. App\Entity\Vocabulary\Pottery\Shape -> group=Pottery, title=Shape
        // e.g. App\Entity\Vocabulary\Century -> group=null, title=Century
        $relative = str_replace('App\\Entity\\Vocabulary\\', '', $entityFqcn);
        $parts = explode('\\', $relative);

        $group = null;
        $title = $relative;

        $indexTitle = null;
        if (count($parts) > 1) {
            $group = $parts[0];
            $title = implode(' / ', array_map(fn ($p) => $this->humanize($p), $parts));
            $indexTitle = $this->humanize(implode(' ', array_slice($parts, 1)));
        } else {
            $title = $this->humanize($parts[0]);
        }

        // Collect all field names excluding 'id'
        $fieldsSet = [];
        foreach ($entries as $entry) {
            if (is_array($entry)) {
                foreach (array_keys($entry) as $key) {
                    if ('id' !== $key && !in_array($key, $fieldsSet, true)) {
                        $fieldsSet[] = $key;
                    }
                }
            }
        }

        if (empty($fieldsSet)) {
            return null;
        }

        // Reorder fields: code first, value second, then the rest
        $fields = [];
        if (in_array('code', $fieldsSet, true)) {
            $fields[] = 'code';
        }
        if (in_array('value', $fieldsSet, true)) {
            $fields[] = 'value';
        }
        foreach ($fieldsSet as $f) {
            if ('code' !== $f && 'value' !== $f) {
                $fields[] = $f;
            }
        }

        // Build markdown
        $basename = basename($fixtureFile, '.yml');
        $mdFilename = $basename.'.md';
        $mdPath = $docsDir.'/'.$mdFilename;

        // Sort entries by 'value' field if present
        $entriesArray = array_values(array_filter($entries, 'is_array'));
        $valueIndex = array_search('value', $fields, true);
        if (false !== $valueIndex) {
            usort($entriesArray, function ($a, $b) {
                return strcasecmp((string) ($a['value'] ?? ''), (string) ($b['value'] ?? ''));
            });
        }

        $md = "### $title\n\n";
        $md .= "[Back to Vocabulary Index](index.md)\n\n";
        $md .= '| '.implode(' | ', $fields)." |\n";
        $md .= '| '.implode(' | ', array_fill(0, count($fields), '---'))." |\n";

        foreach ($entriesArray as $entry) {
            $row = [];
            foreach ($fields as $field) {
                $value = $entry[$field] ?? '';
                $row[] = str_replace('|', '\\|', (string) $value);
            }
            $md .= '| '.implode(' | ', $row)." |\n";
        }

        $md .= "\n[Back to Vocabulary Index](index.md)\n";

        file_put_contents($mdPath, $md);
        $io->text(sprintf('Generated: %s', $mdFilename));

        return [
            'filename' => $mdFilename,
            'title' => $indexTitle ?? $title,
            'group' => $group,
            'entityFqcn' => $entityFqcn,
        ];
    }

    /**
     * @param array<array{filename: string, title: string, group: string|null, entityFqcn: string}> $generated
     */
    private function generateIndex(array $generated, string $docsDir, SymfonyStyle $io): void
    {
        // Separate ungrouped and grouped
        $ungrouped = [];
        $grouped = [];

        foreach ($generated as $entry) {
            if (null === $entry['group']) {
                $ungrouped[] = $entry;
            } else {
                $grouped[$entry['group']][] = $entry;
            }
        }

        // Sort ungrouped alphabetically by title
        usort($ungrouped, fn ($a, $b) => strcasecmp($a['title'], $b['title']));

        // Sort groups alphabetically
        ksort($grouped, SORT_STRING | SORT_FLAG_CASE);

        // Sort entries within each group
        foreach ($grouped as &$entries) {
            usort($entries, fn ($a, $b) => strcasecmp($a['title'], $b['title']));
        }
        unset($entries);
        $md = "[Back to User Documentation](../index.md)\n\n";
        $md .= "### Vocabulary Index\n\n";

        // Ungrouped first
        foreach ($ungrouped as $entry) {
            $md .= sprintf("- [%s](%s)\n", $entry['title'], $entry['filename']);
        }

        if (!empty($ungrouped) && !empty($grouped)) {
            $md .= "\n";
        }

        // Grouped
        foreach ($grouped as $group => $entries) {
            $md .= sprintf("#### %s\n\n", $group);
            foreach ($entries as $entry) {
                $md .= sprintf("- [%s](%s)\n", $entry['title'], $entry['filename']);
            }
            $md .= "\n";
        }

        file_put_contents($docsDir.'/index.md', rtrim($md)."\n");
        $io->text('Generated: index.md');
    }

    private function humanize(string $value): string
    {
        // CamelCase to words: "FunctionalForm" -> "Functional Form"
        $value = preg_replace('/([a-z])([A-Z])/', '$1 $2', $value);
        // Underscores to spaces
        $value = str_replace('_', ' ', $value);

        // Capitalize words
        return ucwords($value);
    }
}

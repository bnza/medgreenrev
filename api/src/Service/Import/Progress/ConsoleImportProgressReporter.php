<?php

namespace App\Service\Import\Progress;

use App\Dto\Output\ImportResultDto;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Style\SymfonyStyle;

class ConsoleImportProgressReporter implements ImportProgressReporterInterface
{
    private ?ProgressBar $progressBar = null;

    public function __construct(
        private readonly SymfonyStyle $io,
    ) {
    }

    public function onStart(int $totalRows): void
    {
        $this->progressBar = $this->io->createProgressBar($totalRows);
        $this->progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%%');
        $this->progressBar->start();
    }

    public function onRowProcessed(int $currentRow, int $totalRows, bool $isValid): void
    {
        $this->progressBar?->advance();
    }

    public function onFinish(ImportResultDto $result): void
    {
        if (null !== $this->progressBar) {
            $this->progressBar->finish();
            $this->io->newLine(2);
        }
    }
}

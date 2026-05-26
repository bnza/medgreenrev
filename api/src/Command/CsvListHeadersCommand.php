<?php

declare(strict_types=1);

namespace App\Command;

use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Resource\Factory\ResourceMetadataCollectionFactoryInterface;
use ApiPlatform\Metadata\Resource\Factory\ResourceNameCollectionFactoryInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Serializer\Encoder\CsvEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactoryInterface;

#[AsCommand(
    name: 'app:csv:list-headers',
    description: 'List CSV headers for all CSV-enabled collection endpoints'
)]
class CsvListHeadersCommand extends Command
{
    public function __construct(
        private readonly ResourceNameCollectionFactoryInterface $resourceNameCollectionFactory,
        private readonly ResourceMetadataCollectionFactoryInterface $resourceMetadataCollectionFactory,
        private readonly ClassMetadataFactoryInterface $classMetadataFactory,
        private readonly ManagerRegistry $doctrine,
        private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('resource', 'r', InputOption::VALUE_OPTIONAL, 'Filter by resource class name (partial match, e.g. "Pottery")')
            ->addOption('generate-config', null, InputOption::VALUE_NONE, 'Generate a PHP config template for header mapping')
            ->addOption('output', 'o', InputOption::VALUE_OPTIONAL, 'Output file path for --generate-config (defaults to config/csv_headers.php)');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        if (!$input->getOption('generate-config')) {
            $io->title('CSV Endpoint Header Listing');
        }

        $filterResource = $input->getOption('resource');
        $generateConfig = (bool) $input->getOption('generate-config');
        $outputFile = $input->getOption('output');

        $csvEncoder = new CsvEncoder();
        /** @var array<string, list<string>> $configResults keyed by FQCN, used for --generate-config */
        $configResults = [];

        foreach ($this->resourceNameCollectionFactory->create() as $resourceClass) {
            if ($filterResource && !str_contains(strtolower($resourceClass), strtolower($filterResource))) {
                continue;
            }

            $metadataCollection = $this->resourceMetadataCollectionFactory->create($resourceClass);

            foreach ($metadataCollection as $apiResource) {
                $operations = $apiResource->getOperations();
                if (null === $operations) {
                    continue;
                }

                foreach ($operations as $operation) {
                    if (!$operation instanceof GetCollection) {
                        continue;
                    }

                    $formats = $operation->getFormats() ?? [];
                    if (!isset($formats['csv'])) {
                        continue;
                    }

                    // Operation-level context takes precedence over resource-level
                    $normContext = $operation->getNormalizationContext()
                        ?? $apiResource->getNormalizationContext()
                        ?? [];
                    $groups = $normContext['groups'] ?? [];

                    if (empty($groups)) {
                        continue;
                    }

                    // Replicate CsvFormatContextBuilder: :acl:read -> :export
                    $exportGroups = $this->transformGroupsForCsv($groups);

                    // Build a dummy nested array from serializer metadata, then let CsvEncoder flatten it
                    $dummyRow = $this->buildDummyRow($resourceClass, $exportGroups, [], 0);

                    if (empty($dummyRow)) {
                        continue;
                    }

                    $csv = $csvEncoder->encode([$dummyRow], 'csv');
                    $firstLine = strtok($csv, "\n");
                    $headers = false !== $firstLine ? str_getcsv($firstLine) : [];

                    if (empty($headers)) {
                        continue;
                    }

                    $uriTemplate = $operation->getUriTemplate() ?? '(unknown)';
                    $shortName = substr($resourceClass, strrpos($resourceClass, '\\') + 1);

                    if (!$generateConfig) {
                        $io->section(sprintf('[%s]  %s', $shortName, $uriTemplate));
                        $io->listing($headers);
                    }

                    // Deduplicate by FQCN: all GetCollection CSV ops on the same class share headers
                    if (!isset($configResults[$resourceClass])) {
                        $configResults[$resourceClass] = $headers;
                    }
                }
            }
        }

        if ($generateConfig) {
            $outputFile ??= $this->projectDir.'/config/csv_headers.php';

            // Load existing config so we can preserve any labels the user already customized
            $existingConfig = file_exists($outputFile) ? (require $outputFile) : [];

            $configContent = $this->generateConfigPhp($configResults, is_array($existingConfig) ? $existingConfig : []);

            file_put_contents($outputFile, $configContent);
            $io->success(sprintf('Config written to %s', $outputFile));
        }

        return self::SUCCESS;
    }

    /**
     * @param list<string> $groups
     * @return list<string>
     */
    private function transformGroupsForCsv(array $groups): array
    {
        return array_map(static function (string $group): string {
            if (str_ends_with($group, ':acl:read')) {
                return str_replace(':acl:read', ':export', $group);
            }

            return $group;
        }, $groups);
    }

    /**
     * Build a dummy nested array for the given class filtered by export groups.
     * Scalar properties become '' values; to-one relations become nested sub-arrays.
     * The CsvEncoder will flatten nested arrays using dot-notation, producing the exact
     * same keys as a real CSV response.
     *
     * @param list<string>  $exportGroups
     * @param list<string>  $visited      FQCN stack to prevent infinite recursion
     * @return array<string, mixed>
     */
    private function buildDummyRow(string $className, array $exportGroups, array $visited, int $depth): array
    {
        if ($depth > 3 || in_array($className, $visited, true)) {
            return [];
        }

        try {
            $classMetadata = $this->classMetadataFactory->getMetadataFor($className);
        } catch (\Exception) {
            return [];
        }

        $em = $this->doctrine->getManagerForClass($className);
        $doctrineMetadata = null;
        if (null !== $em) {
            try {
                $doctrineMetadata = $em->getClassMetadata($className);
            } catch (\Exception) {
                // Not a mapped entity
            }
        }

        $visited[] = $className;
        $row = [];

        foreach ($classMetadata->getAttributesMetadata() as $attributeMetadata) {
            if (empty(array_intersect($attributeMetadata->getGroups(), $exportGroups))) {
                continue;
            }

            $name = $attributeMetadata->getName();

            // Check if it is a to-one Doctrine association (eligible for dot-flattening)
            if (null !== $doctrineMetadata
                && $doctrineMetadata->hasAssociation($name)
                && !$doctrineMetadata->isCollectionValuedAssociation($name)
            ) {
                $mapping = $doctrineMetadata->getAssociationMapping($name);
                // Doctrine ORM 3.x returns an object; ORM 2.x returns an array
                $targetClass = is_array($mapping) ? $mapping['targetEntity'] : $mapping->targetEntity;

                $nested = $this->buildDummyRow($targetClass, $exportGroups, $visited, $depth + 1);
                if (!empty($nested)) {
                    $row[$name] = $nested;
                }
            } else {
                // Scalar, virtual (getter-only) property, or collection (skipped by Encoder anyway)
                $row[$name] = '';
            }
        }

        return $row;
    }

    /**
     * @param array<string, list<string>> $results
     * @param array<string, array<string, string>> $existingConfig existing label mappings to preserve
     */
    private function generateConfigPhp(array $results, array $existingConfig = []): string
    {
        if (empty($results)) {
            return "<?php\n\nreturn [];\n";
        }

        $lines = ['<?php', ''];

        foreach (array_keys($results) as $fqcn) {
            $lines[] = sprintf('use %s;', $fqcn);
        }

        $lines[] = '';
        $lines[] = 'return [';

        foreach ($results as $fqcn => $headers) {
            $shortName = substr($fqcn, strrpos($fqcn, '\\') + 1);
            $lines[] = sprintf('    %s::class => [', $shortName);

            foreach ($headers as $header) {
                // Preserve existing label; fall back to humanized default for new headers
                $label = $existingConfig[$fqcn][$header] ?? $this->humanize($header);
                $lines[] = sprintf("        '%s' => '%s',", $header, $label);
            }

            $lines[] = '    ],';
        }

        $lines[] = '];';
        $lines[] = '';

        return implode("\n", $lines);
    }

    private function humanize(string $value): string
    {
        // Handle dot notation: site.code -> Site Code, functionalForm.functionalGroup.value -> Functional Form Functional Group Value
        $parts = explode('.', $value);
        $humanized = array_map(static function (string $part): string {
            // camelCase to words: chronologyLower -> Chronology Lower
            $part = (string) preg_replace('/([a-z])([A-Z])/', '$1 $2', $part);

            return ucwords($part);
        }, $parts);

        return implode(' ', $humanized);
    }
}

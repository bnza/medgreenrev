<?php

namespace App\Doctrine\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\OpenApi\Model\Parameter as OpenApiParameter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Query\Parameter;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;
use Symfony\Component\TypeInfo\Type\BuiltinType;

final class SearchSedimentCoreDepthFilter extends AbstractFilter
{
    public function __construct(
        ?ManagerRegistry $managerRegistry = null,
        ?LoggerInterface $logger = null,
        ?array $properties = ['search'],
        ?NameConverterInterface $nameConverter = null,
    ) {
        parent::__construct($managerRegistry, $logger, $properties, $nameConverter);
    }

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        // Only handle the 'search' property
        if ('search' !== $property) {
            return;
        }

        if (empty($value)) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $parameters = $queryBuilder->getParameters();

        // Split the value using non-word characters
        $chunks = $this->splitValue($value);
        $chunkCount = count($chunks);

        // Join with sedimentCore and site tables
        $scAlias = $queryNameGenerator->generateJoinAlias('sedimentCore');
        $queryBuilder->leftJoin($rootAlias.'.sedimentCore', $scAlias);

        $siteAlias = $queryNameGenerator->generateJoinAlias('site');
        $queryBuilder->leftJoin($scAlias.'.site', $siteAlias);

        $whereConditions = [];

        if (1 === $chunkCount) {
            $chunk = $chunks[0];
            if (is_numeric($chunk)) {
                // a.2: is numeric -> filter by depth
                $whereConditions[] = $this->createDepthCondition($queryBuilder, $queryNameGenerator, $rootAlias, $chunk, $parameters);
            } else {
                // a.1: is string -> filter by site code
                $whereConditions[] = $this->createSiteCodeCondition($queryBuilder, $queryNameGenerator, $siteAlias, $chunk, $parameters);
            }
        } elseif (2 === $chunkCount) {
            $chunk1 = $chunks[0];
            $chunk2 = $chunks[1];

            if (!is_numeric($chunk1) && is_numeric($chunk2)) {
                // b.1: c1 is string, c2 is numeric -> site code AND depth
                $whereConditions[] = $this->createSiteCodeCondition($queryBuilder, $queryNameGenerator, $siteAlias, $chunk1, $parameters);
                $whereConditions[] = $this->createDepthCondition($queryBuilder, $queryNameGenerator, $rootAlias, $chunk2, $parameters);
            } elseif (is_numeric($chunk1) && is_numeric($chunk2)) {
                // b.2: c1 is numeric, c2 is numeric -> sc number AND depth
                $whereConditions[] = $this->createScNumberCondition($queryBuilder, $queryNameGenerator, $scAlias, $chunk1, $parameters);
                $whereConditions[] = $this->createDepthCondition($queryBuilder, $queryNameGenerator, $rootAlias, $chunk2, $parameters);
            } else {
                // Invalid combination -> return empty set
                $whereConditions[] = $this->createEmptySetCondition($queryBuilder, $siteAlias);
            }
        } elseif (3 === $chunkCount) {
            $chunk1 = $chunks[0];
            $chunk2 = $chunks[1];
            $chunk3 = $chunks[2];

            if (!is_numeric($chunk1) && is_numeric($chunk2) && is_numeric($chunk3)) {
                // c1 is string, c2 is numeric, c3 is numeric -> site code AND sc number AND depth
                $whereConditions[] = $this->createSiteCodeCondition($queryBuilder, $queryNameGenerator, $siteAlias, $chunk1, $parameters);
                $whereConditions[] = $this->createScNumberCondition($queryBuilder, $queryNameGenerator, $scAlias, $chunk2, $parameters);
                $whereConditions[] = $this->createDepthCondition($queryBuilder, $queryNameGenerator, $rootAlias, $chunk3, $parameters);
            } elseif (is_numeric($chunk1) && is_numeric($chunk2) && is_numeric($chunk3)) {
                // c1 is numeric, c2 is numeric, c3 is numeric -> year AND sc number AND depth
                $whereConditions[] = $this->createYearCondition($queryBuilder, $queryNameGenerator, $scAlias, $chunk1, $parameters);
                $whereConditions[] = $this->createScNumberCondition($queryBuilder, $queryNameGenerator, $scAlias, $chunk2, $parameters);
                $whereConditions[] = $this->createDepthCondition($queryBuilder, $queryNameGenerator, $rootAlias, $chunk3, $parameters);
            } else {
                // Invalid combination -> return empty set
                $whereConditions[] = $this->createEmptySetCondition($queryBuilder, $siteAlias);
            }
        } elseif ($chunkCount >= 4) {
            $chunk1 = $chunks[0];
            $chunk2 = $chunks[1];
            $chunk3 = $chunks[2];
            $chunk4 = $chunks[3];

            if (!is_numeric($chunk1) && is_numeric($chunk2) && is_numeric($chunk3) && is_numeric($chunk4)) {
                // site code AND year AND sc number AND depth
                $whereConditions[] = $this->createSiteCodeCondition($queryBuilder, $queryNameGenerator, $siteAlias, $chunk1, $parameters);
                $whereConditions[] = $this->createYearCondition($queryBuilder, $queryNameGenerator, $scAlias, $chunk2, $parameters);
                $whereConditions[] = $this->createScNumberCondition($queryBuilder, $queryNameGenerator, $scAlias, $chunk3, $parameters);
                $whereConditions[] = $this->createDepthCondition($queryBuilder, $queryNameGenerator, $rootAlias, $chunk4, $parameters);
            } else {
                // Invalid combination -> return empty set
                $whereConditions[] = $this->createEmptySetCondition($queryBuilder, $siteAlias);
            }
        }

        if (!empty($whereConditions)) {
            $queryBuilder
                ->andWhere($queryBuilder->expr()->andX(...$whereConditions))
                ->setParameters($parameters);
        }
    }

    private function splitValue(string $value): array
    {
        // Split using any non-alphanumeric characters group and filter out empty strings
        return array_filter(preg_split('/[^a-zA-Z0-9]+/', $value), fn ($chunk) => '' !== $chunk);
    }

    private function createSiteCodeCondition(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $siteAlias, string $value, ArrayCollection $parameters): string
    {
        $parameterName = $queryNameGenerator->generateParameterName('site_code');
        $parameter = new Parameter($parameterName, strtoupper($value).'%');
        $parameters->add($parameter);

        return $queryBuilder->expr()->like(
            "UPPER($siteAlias.code)",
            ':'.$parameterName
        );
    }

    private function createScNumberCondition(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $scAlias, string $value, ArrayCollection $parameters): string
    {
        $parameterName = $queryNameGenerator->generateParameterName('sc_number');
        $parameter = new Parameter($parameterName, '%'.$value);
        $parameters->add($parameter);

        return $queryBuilder->expr()->like(
            "CAST($scAlias.number AS TEXT)",
            ':'.$parameterName
        );
    }

    private function createYearCondition(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $scAlias, string $value, ArrayCollection $parameters): string
    {
        $parameterName = $queryNameGenerator->generateParameterName('sc_year');
        $parameter = new Parameter($parameterName, '%'.$value);
        $parameters->add($parameter);

        return $queryBuilder->expr()->like(
            "CAST($scAlias.year AS TEXT)",
            ':'.$parameterName
        );
    }

    private function createDepthCondition(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $rootAlias, string $value, ArrayCollection $parameters): string
    {
        $parameterName = $queryNameGenerator->generateParameterName('depth');
        $parameter = new Parameter($parameterName, '%'.$value);
        $parameters->add($parameter);

        return $queryBuilder->expr()->like(
            "CAST(CAST($rootAlias.depthMin * 10 AS INTEGER) AS TEXT)",
            ':'.$parameterName
        );
    }

    private function createEmptySetCondition(QueryBuilder $queryBuilder, string $siteAlias): string
    {
        return $queryBuilder->expr()->isNull($siteAlias.'.code');
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'search' => [
                'property' => 'search',
                'type' => BuiltinType::string(),
                'required' => false,
                'description' => 'Search sediment core depths by splitting input on non-word characters. Supports: 1 chunk (site code or depth), 2 chunks (site+depth or sc_number+depth), 3 chunks (site+sc_number+depth or year+sc_number+depth), 4 chunks (site+year+sc_number+depth). Invalid combinations return empty results.',
                'openapi' => new OpenApiParameter(
                    name: 'search',
                    in: 'query',
                    explode: false,
                    allowReserved: false,
                    example: 'SE 2025 1 85',
                ),
            ],
        ];
    }
}

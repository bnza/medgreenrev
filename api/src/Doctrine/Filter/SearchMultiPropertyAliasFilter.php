<?php

namespace App\Doctrine\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\OpenApi\Model\Parameter as OpenApiParameter;
use Doctrine\ORM\Query\Expr\Orx;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;
use Symfony\Component\TypeInfo\Type\BuiltinType;

/**
 * Multi-target alias search filter.
 *
 * Maps a single query alias (e.g. "search") to a list of dotted target properties
 * (e.g. ['flat.value', 'englishName']) and OR-combines case- and accent-insensitive
 * LIKE clauses on each target. Nested relations are auto-joined with duplicate-join
 * protection, mirroring SearchPropertyAliasFilter behaviour.
 */
class SearchMultiPropertyAliasFilter extends AbstractFilter
{
    public function __construct(
        ?ManagerRegistry $managerRegistry = null,
        ?LoggerInterface $logger = null,
        ?array $properties = null, // expects mapping like ['search' => ['flat.value', 'englishName']]
        ?NameConverterInterface $nameConverter = null,
    ) {
        parent::__construct($managerRegistry, $logger, $properties, $nameConverter);
    }

    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = [],
    ): void {
        $mapping = $this->getProperties() ?? [];
        if (!\array_key_exists($property, $mapping)) {
            return;
        }
        $search = trim((string) $value);
        if ('' === $search) {
            return;
        }

        $targets = (array) $mapping[$property];
        if ([] === $targets) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];

        $orX = new Orx();
        foreach ($targets as $target) {
            $this->buildLikeExpression(
                $queryBuilder,
                $queryNameGenerator,
                $rootAlias,
                explode('.', (string) $target),
                $search,
                $orX,
            );
        }

        if ($orX->count() > 0) {
            $queryBuilder->andWhere($orX);
        }
    }

    /**
     * Recursively joins relations and adds a LIKE expression on the final field to the OR group.
     *
     * @param string[] $segments e.g. ['englishName'] or ['flat', 'value']
     */
    private function buildLikeExpression(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $currentAlias,
        array $segments,
        string $search,
        Orx $orX,
    ): void {
        if (1 === \count($segments)) {
            $field = $segments[0];
            $parameterName = $queryNameGenerator->generateParameterName($field);
            $orX->add(sprintf(
                'LOWER(unaccented(%s.%s)) LIKE LOWER(unaccented(:%s))',
                $currentAlias,
                $field,
                $parameterName,
            ));
            $queryBuilder->setParameter($parameterName, '%'.strtolower($search).'%');

            return;
        }

        $relation = array_shift($segments);
        $joinAlias = $currentAlias.'_'.$relation;

        $existingAliases = array_column(
            $queryBuilder->getDQLPart('join')[$currentAlias] ?? [],
            'alias'
        );
        if (!\in_array($joinAlias, $existingAliases, true)) {
            $queryBuilder->leftJoin(sprintf('%s.%s', $currentAlias, $relation), $joinAlias);
        }

        $this->buildLikeExpression($queryBuilder, $queryNameGenerator, $joinAlias, $segments, $search, $orX);
    }

    public function getDescription(string $resourceClass): array
    {
        $mapping = $this->getProperties() ?? [];
        $desc = [];
        foreach ($mapping as $alias => $targets) {
            $targets = (array) $targets;
            $desc[$alias] = [
                'property' => $alias,
                'type' => BuiltinType::string(),
                'required' => false,
                'description' => sprintf(
                    "Case-insensitive, accent-insensitive contains search; alias '%s' matches any of: %s. Supports dot-notation for nested relations.",
                    $alias,
                    implode(', ', $targets),
                ),
                'openapi' => new OpenApiParameter(
                    name: $alias,
                    in: 'query',
                    example: 'oak',
                ),
            ];
        }

        return $desc;
    }
}

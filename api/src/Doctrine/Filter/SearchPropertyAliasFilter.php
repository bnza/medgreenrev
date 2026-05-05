<?php

namespace App\Doctrine\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\OpenApi\Model\Parameter as OpenApiParameter;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;
use Symfony\Component\TypeInfo\Type\BuiltinType;

class SearchPropertyAliasFilter extends AbstractFilter
{
    public function __construct(
        ?ManagerRegistry $managerRegistry = null,
        ?LoggerInterface $logger = null,
        ?array $properties = null, // expects mapping like ['search' => 'value']
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
        // Only act on parameters that are defined as aliases in properties mapping
        $mapping = $this->getProperties() ?? [];
        if (!\array_key_exists($property, $mapping)) {
            return;
        }

        $search = trim((string) $value);
        if ('' === $search) {
            return;
        }

        $targetProperty = $mapping[$property]; // e.g. 'value' or 'flat.value' or 'a.b.value'
        $rootAlias = $queryBuilder->getRootAliases()[0];

        $this->applyNestedFilter(
            $queryBuilder,
            $queryNameGenerator,
            $rootAlias,
            explode('.', $targetProperty),
            $search,
        );
    }

    /**
     * Recursively joins relations and applies the LIKE condition on the final field.
     *
     * @param string[] $segments e.g. ['value'] or ['flat', 'value'] or ['a', 'b', 'value']
     */
    private function applyNestedFilter(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $currentAlias,
        array $segments,
        string $search,
    ): void {
        if (1 === \count($segments)) {
            // Base case: last segment is the actual field — apply the condition
            $field = $segments[0];
            $parameterName = $queryNameGenerator->generateParameterName($field);
            $queryBuilder
                ->andWhere(
                    sprintf('LOWER(unaccented(%s.%s)) LIKE LOWER(unaccented(:%s))', $currentAlias, $field, $parameterName)
                )
                ->setParameter($parameterName, '%'.strtolower($search).'%');

            return;
        }

        // Recursive case: next segment is a relation to join
        $relation = array_shift($segments);
        $joinAlias = $currentAlias.'_'.$relation; // e.g. 'o_flat', 'o_flat_taxon'

        // Avoid duplicate joins
        $existingAliases = array_column(
            $queryBuilder->getDQLPart('join')[$currentAlias] ?? [],
            'alias'
        );

        if (!\in_array($joinAlias, $existingAliases, true)) {
            $queryBuilder->leftJoin(sprintf('%s.%s', $currentAlias, $relation), $joinAlias);
        }

        $this->applyNestedFilter($queryBuilder, $queryNameGenerator, $joinAlias, $segments, $search);
    }

    public function getDescription(string $resourceClass): array
    {
        $mapping = $this->getProperties() ?? [];
        $desc = [];

        foreach ($mapping as $alias => $target) {
            $desc[$alias] = [
                'property' => $alias,
                'type' => BuiltinType::string(),
                'required' => false,
                'description' => sprintf("Case-insensitive contains search; alias '%s' targets '%s'. Supports dot-notation for nested relations.", $alias, $target),
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

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
use Symfony\Component\TypeInfo\TypeIdentifier;

final class SearchPotteryFilter extends AbstractFilter
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

        $value = trim($value);

        if (empty($value)) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $parameters = $queryBuilder->getParameters();

        $suAlias = $queryNameGenerator->generateJoinAlias('stratigraphicUnit');
        $siteAlias = $queryNameGenerator->generateJoinAlias('site');
        $queryBuilder->leftJoin($rootAlias.'.stratigraphicUnit', $suAlias);
        $queryBuilder->leftJoin($suAlias.'.site', $siteAlias);

        // Split value at the first dot and trim chunks
        $chunks = array_map('trim', explode('.', $value, 2));

        if (1 === count($chunks)) {
            // Single chunk: search in both site code and inventory
            $siteCodeExpression = $this->createSiteCodeLikeExpression($queryBuilder, $queryNameGenerator, $siteAlias, $chunks[0], $parameters);
            $inventoryExpression = $this->createInventoryLikeExpression($queryBuilder, $queryNameGenerator, $rootAlias, $chunks[0], $parameters);

            $orWhere = $queryBuilder->expr()->orX()
                ->add($siteCodeExpression)
                ->add($inventoryExpression);

            $queryBuilder->andWhere($orWhere);
        } else {
            // Two chunks: handle edge cases
            $siteCodeChunk = trim($chunks[0]);
            $inventoryChunk = trim($chunks[1]);

            // Edge case: empty site code chunk (e.g., ".inventory") -> only search by inventory
            if (empty($siteCodeChunk)) {
                $inventoryExpression = $this->createInventoryLikeExpression($queryBuilder, $queryNameGenerator, $rootAlias, $inventoryChunk, $parameters);
                $queryBuilder->andWhere($inventoryExpression);
            } // Edge case: empty inventory chunk (e.g., "CODE." or "CODE.  ") -> only search by site code
            elseif (empty($inventoryChunk)) {
                $siteCodeExpression = $this->createSiteCodeLikeExpression($queryBuilder, $queryNameGenerator, $siteAlias, $siteCodeChunk, $parameters);
                $queryBuilder->andWhere($siteCodeExpression);
            } // Normal case: both chunks present -> site code contains first chunk AND inventory contains second chunk
            else {
                $siteCodeExpression = $this->createSiteCodeLikeExpression($queryBuilder, $queryNameGenerator, $siteAlias, $siteCodeChunk, $parameters);
                $inventoryExpression = $this->createInventoryLikeExpression($queryBuilder, $queryNameGenerator, $rootAlias, $inventoryChunk, $parameters);

                $andWhere = $queryBuilder->expr()->andX()
                    ->add($siteCodeExpression)
                    ->add($inventoryExpression);

                $queryBuilder->andWhere($andWhere);
            }
        }

        $queryBuilder->setParameters($parameters);
    }

    private function createSiteCodeLikeExpression(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $siteAlias, string $value, ArrayCollection $parameters): string
    {
        $siteCodeParameter = new Parameter(
            $queryNameGenerator->generateParameterName('siteCode'),
            '%'.$value.'%'
        );

        $parameters->add($siteCodeParameter);

        return $queryBuilder->expr()->like(
            "LOWER($siteAlias.code)",
            'LOWER(:'.$siteCodeParameter->getName().')'
        );
    }

    private function createInventoryLikeExpression(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $rootAlias, string $value, ArrayCollection $parameters): string
    {
        $inventoryParameter = new Parameter(
            $queryNameGenerator->generateParameterName('inventory'),
            '%'.$value.'%'
        );

        $parameters->add($inventoryParameter);

        return $queryBuilder->expr()->like(
            "LOWER($rootAlias.inventory)",
            'LOWER(:'.$inventoryParameter->getName().')'
        );
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'search' => [
                'property' => 'search',
                'type' => TypeIdentifier::STRING,
                'required' => false,
                'description' => 'Search by site code OR inventory (case insensitive like) if single value, or by site code AND inventory (both conditions must match) if value contains dot. Edge cases: ".inventory" searches only by inventory, "siteCode." searches only by site code. Format: "siteCode.inventory"',
                'openapi' => new OpenApiParameter(
                    name: 'search',
                    in: 'query',
                    explode: false,
                    allowReserved: false,
                    example: 'SE.POT001',
                ),
            ],
        ];
    }
}

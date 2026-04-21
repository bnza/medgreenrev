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

final class SearchIndividualFilter extends AbstractFilter
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
            // Single chunk: search in both site code and identifier
            $siteCodeExpression = $this->createSiteCodeLikeExpression($queryBuilder, $queryNameGenerator, $siteAlias, $chunks[0], $parameters);
            $identifierExpression = $this->createIdentifierLikeExpression($queryBuilder, $queryNameGenerator, $rootAlias, $chunks[0], $parameters);

            $orWhere = $queryBuilder->expr()->orX()
                ->add($siteCodeExpression)
                ->add($identifierExpression);

            $queryBuilder->andWhere($orWhere);
        } else {
            // Two chunks: handle edge cases
            $siteCodeChunk = trim($chunks[0]);
            $identifierChunk = trim($chunks[1]);

            // Edge case: empty site code chunk (e.g., ".identifier") -> only search by identifier
            if (empty($siteCodeChunk)) {
                $identifierExpression = $this->createIdentifierLikeExpression($queryBuilder, $queryNameGenerator, $rootAlias, $identifierChunk, $parameters);
                $queryBuilder->andWhere($identifierExpression);
            } // Edge case: empty identifier chunk (e.g., "CODE." or "CODE.  ") -> only search by site code
            elseif (empty($identifierChunk)) {
                $siteCodeExpression = $this->createSiteCodeLikeExpression($queryBuilder, $queryNameGenerator, $siteAlias, $siteCodeChunk, $parameters);
                $queryBuilder->andWhere($siteCodeExpression);
            } // Normal case: both chunks present -> site code contains first chunk AND identifier contains second chunk
            else {
                $siteCodeExpression = $this->createSiteCodeLikeExpression($queryBuilder, $queryNameGenerator, $siteAlias, $siteCodeChunk, $parameters);
                $identifierExpression = $this->createIdentifierLikeExpression($queryBuilder, $queryNameGenerator, $rootAlias, $identifierChunk, $parameters);

                $andWhere = $queryBuilder->expr()->andX()
                    ->add($siteCodeExpression)
                    ->add($identifierExpression);

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

    private function createIdentifierLikeExpression(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $rootAlias, string $value, ArrayCollection $parameters): string
    {
        $identifierParameter = new Parameter(
            $queryNameGenerator->generateParameterName('identifier'),
            '%'.$value.'%'
        );

        $parameters->add($identifierParameter);

        return $queryBuilder->expr()->like(
            "LOWER($rootAlias.identifier)",
            'LOWER(:'.$identifierParameter->getName().')'
        );
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'search' => [
                'property' => 'search',
                'type' => TypeIdentifier::STRING,
                'required' => false,
                'description' => 'Search by site code OR identifier (case insensitive like) if single value, or by site code AND identifier (both conditions must match) if value contains dot. Edge cases: ".identifier" searches only by identifier, "siteCode." searches only by site code. Format: "siteCode.identifier"',
                'openapi' => new OpenApiParameter(
                    name: 'search',
                    in: 'query',
                    explode: false,
                    allowReserved: false,
                    example: 'TO.IND001',
                ),
            ],
        ];
    }
}

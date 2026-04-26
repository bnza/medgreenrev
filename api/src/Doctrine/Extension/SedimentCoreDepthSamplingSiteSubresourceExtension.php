<?php

namespace App\Doctrine\Extension;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Data\Join\SedimentCoreDepth;
use Doctrine\ORM\QueryBuilder;

class SedimentCoreDepthSamplingSiteSubresourceExtension implements QueryCollectionExtensionInterface
{
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        if (SedimentCoreDepth::class !== $resourceClass
            || '/data/sampling_sites/{parentId}/sediment_cores/depths' !== $operation?->getUriTemplate()) {
            return;
        }

        $parentId = $context['uri_variables']['parentId'] ?? null;

        if (!$parentId) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $scAlias = $queryNameGenerator->generateJoinAlias('sedimentCore');

        $queryBuilder
            ->join(sprintf('%s.sedimentCore', $rootAlias), $scAlias)
            ->andWhere(sprintf('%s.site = :siteId', $scAlias))
            ->setParameter('siteId', $parentId);
    }
}

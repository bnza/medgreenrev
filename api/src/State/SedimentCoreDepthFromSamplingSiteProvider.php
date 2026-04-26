<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

readonly class SedimentCoreDepthFromSamplingSiteProvider implements ProviderInterface
{
    public function __construct(
        // Use #[Autowire] to inject by exact service ID
        #[Autowire(service: 'api_platform.doctrine.orm.state.collection_provider')]
        private ProviderInterface $collectionProvider,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if ('/data/sampling_sites/{parentId}/sediment_cores/depths' === $operation->getUriTemplate()) {
            $context['uri_variables'] = $uriVariables;

            return $this->collectionProvider->provide(
                $operation->withUriVariables([]),
                [],
                $context
            );
        }

        return $this->collectionProvider->provide($operation, $uriVariables, $context);
    }
}

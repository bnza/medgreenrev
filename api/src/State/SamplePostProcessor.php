<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Data\Join\SampleStratigraphicUnit;
use App\Entity\Data\Sample;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

readonly class SamplePostProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $sample = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        if ($sample instanceof Sample && 'POST' === $operation->getMethod()) {
            $stratigraphicUnit = $sample->getStratigraphicUnit();
            if (null !== $stratigraphicUnit) {
                $join = new SampleStratigraphicUnit();
                $join->setSample($sample);
                $join->setStratigraphicUnit($stratigraphicUnit);

                $this->entityManager->persist($join);
                $this->entityManager->flush();
            }
        }

        return $sample;
    }
}

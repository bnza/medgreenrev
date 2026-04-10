<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Data\Context;
use App\Entity\Data\Join\ContextStratigraphicUnit;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

readonly class ContextPostProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        if ($result instanceof Context && 'POST' === $operation->getMethod()) {
            $stratigraphicUnit = $result->getStratigraphicUnit();
            if (null !== $stratigraphicUnit) {
                $join = new ContextStratigraphicUnit();
                $join->setContext($result);
                $join->setStratigraphicUnit($stratigraphicUnit);

                $this->entityManager->persist($join);
                $this->entityManager->flush();
            }
        }

        return $result;
    }
}

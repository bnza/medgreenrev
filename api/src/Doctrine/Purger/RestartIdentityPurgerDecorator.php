<?php

declare(strict_types=1);

namespace App\Doctrine\Purger;

use Doctrine\ORM\EntityManagerInterface;
use Fidry\AliceDataFixtures\Persistence\PurgeMode;
use Fidry\AliceDataFixtures\Persistence\PurgerFactoryInterface;
use Fidry\AliceDataFixtures\Persistence\PurgerInterface;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\DependencyInjection\Attribute\AutowireDecorated;

#[AsDecorator(
    decorates: 'fidry_alice_data_fixtures.persistence.doctrine.purger.purger_factory',
)]
class RestartIdentityPurgerDecorator implements PurgerInterface, PurgerFactoryInterface
{
    private PurgerInterface $inner;
    private PurgerFactoryInterface $innerFactory;

    public function __construct(
        #[AutowireDecorated]
        PurgerInterface $inner,
        private EntityManagerInterface $em,
    ) {
        $this->inner = $inner;

        if (!$inner instanceof PurgerFactoryInterface) {
            throw new \InvalidArgumentException('Inner purger must implement PurgerFactoryInterface');
        }

        $this->innerFactory = $inner;
    }

    public function create(PurgeMode $mode, ?PurgerInterface $purger = null): PurgerInterface
    {
        $newInner = $this->innerFactory->create($mode, $purger);

        $decorator = new self($newInner, $this->em);

        return $decorator;
    }

    public function purge(): void
    {
        $this->inner->purge();

        $conn = $this->em->getConnection();
        $sequences = $conn->fetchAllAssociative(
            "SELECT schemaname || '.' || sequencename AS seq
             FROM pg_sequences
             WHERE schemaname IN ('public', 'vocabulary')"
        );

        foreach ($sequences as $row) {
            $conn->executeStatement(
                sprintf('ALTER SEQUENCE %s RESTART WITH 1', $row['seq'])
            );
        }
    }
}

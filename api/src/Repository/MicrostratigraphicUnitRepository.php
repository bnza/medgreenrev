<?php

namespace App\Repository;

use App\Entity\Data\MicrostratigraphicUnit;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class MicrostratigraphicUnitRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MicrostratigraphicUnit::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof MicrostratigraphicUnit) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', MicrostratigraphicUnit::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }

        return [];
    }
}

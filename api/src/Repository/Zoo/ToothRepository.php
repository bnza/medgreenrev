<?php

namespace App\Repository\Zoo;

use App\Entity\Data\Join\Analysis\AnalysisZooTooth;
use App\Entity\Data\Zoo\Tooth;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ToothRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tooth::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Tooth) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Tooth::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, AnalysisZooTooth::class, 'subject')) {
            $result[] = AnalysisZooTooth::class;
        }

        return $result;
    }
}

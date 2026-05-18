<?php

namespace App\Repository;

use App\Entity\Data\Individual;
use App\Entity\Data\Join\Analysis\AnalysisIndividual;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class IndividualRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Individual::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Individual) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Individual::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, AnalysisIndividual::class, 'subject')) {
            $result[] = AnalysisIndividual::class;
        }

        return $result;
    }
}

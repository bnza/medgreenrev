<?php

namespace App\Repository;

use App\Entity\Data\Join\Analysis\AnalysisPottery;
use App\Entity\Data\Pottery;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PotteryRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Pottery::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Pottery) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Pottery::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, AnalysisPottery::class, 'subject')) {
            $result[] = AnalysisPottery::class;
        }

        return $result;
    }
}

<?php

namespace App\Repository\Zoo;

use App\Entity\Data\Join\Analysis\AnalysisZooBone;
use App\Entity\Data\Zoo\Bone;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class BoneRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Bone::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Bone) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Bone::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, AnalysisZooBone::class, 'subject')) {
            $result[] = AnalysisZooBone::class;
        }

        return $result;
    }
}

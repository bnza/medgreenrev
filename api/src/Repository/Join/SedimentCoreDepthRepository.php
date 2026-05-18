<?php

namespace App\Repository\Join;

use App\Entity\Data\Join\Analysis\AnalysisSedimentCoreDepth;
use App\Entity\Data\Join\Analysis\AnalysisSedimentCoreDepthBotany;
use App\Entity\Data\Join\SedimentCoreDepth;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class SedimentCoreDepthRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SedimentCoreDepth::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof SedimentCoreDepth) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', SedimentCoreDepth::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, AnalysisSedimentCoreDepth::class, 'subject')) {
            $result[] = AnalysisSedimentCoreDepth::class;
        }

        if ($this->existsReference($subject, AnalysisSedimentCoreDepthBotany::class, 'subject')) {
            $result[] = AnalysisSedimentCoreDepthBotany::class;
        }

        return $result;
    }
}

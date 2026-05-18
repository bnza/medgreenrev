<?php

namespace App\Repository;

use App\Entity\Data\Join\Analysis\AnalysisSample;
use App\Entity\Data\Join\Analysis\AnalysisSampleBotany;
use App\Entity\Data\Join\Analysis\AnalysisSampleMicrostratigraphy;
use App\Entity\Data\Sample;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class SampleRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Sample::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Sample) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Sample::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, AnalysisSample::class, 'subject')) {
            $result[] = AnalysisSample::class;
        }

        if ($this->existsReference($subject, AnalysisSampleBotany::class, 'subject')) {
            $result[] = AnalysisSampleBotany::class;
        }

        if ($this->existsReference($subject, AnalysisSampleMicrostratigraphy::class, 'subject')) {
            $result[] = AnalysisSampleMicrostratigraphy::class;
        }

        return $result;
    }
}

<?php

namespace App\Repository;

use App\Entity\Auth\User;
use App\Entity\Data\Analysis;
use App\Entity\Data\Join\Analysis\AnalysisBotanyCharcoal;
use App\Entity\Data\Join\Analysis\AnalysisBotanySeed;
use App\Entity\Data\Join\Analysis\AnalysisContextBotany;
use App\Entity\Data\Join\Analysis\AnalysisContextZoo;
use App\Entity\Data\Join\Analysis\AnalysisIndividual;
use App\Entity\Data\Join\Analysis\AnalysisPottery;
use App\Entity\Data\Join\Analysis\AnalysisSample;
use App\Entity\Data\Join\Analysis\AnalysisSampleBotany;
use App\Entity\Data\Join\Analysis\AnalysisSampleMicrostratigraphy;
use App\Entity\Data\Join\Analysis\AnalysisSedimentCoreDepth;
use App\Entity\Data\Join\Analysis\AnalysisSedimentCoreDepthBotany;
use App\Entity\Data\Join\Analysis\AnalysisSiteAnthropology;
use App\Entity\Data\Join\Analysis\AnalysisZooBone;
use App\Entity\Data\Join\Analysis\AnalysisZooTooth;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class AnalysisRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Analysis::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Analysis) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Analysis::class, get_debug_type($subject)));
        }
        $result = [];

        $joins = [
            AnalysisBotanyCharcoal::class,
            AnalysisBotanySeed::class,
            AnalysisContextBotany::class,
            AnalysisContextZoo::class,
            AnalysisIndividual::class,
            AnalysisPottery::class,
            AnalysisSample::class,
            AnalysisSampleBotany::class,
            AnalysisSampleMicrostratigraphy::class,
            AnalysisSedimentCoreDepth::class,
            AnalysisSedimentCoreDepthBotany::class,
            AnalysisSiteAnthropology::class,
            AnalysisZooBone::class,
            AnalysisZooTooth::class,
        ];

        foreach ($joins as $joinClass) {
            if ($this->existsReference($subject, $joinClass, 'analysis')) {
                $result[] = $joinClass;
            }
        }

        return $result;
    }

    public function userHasAnalysis(User $user): bool
    {
        return $user && $this->createQueryBuilder('o')
                ->select('1')
                ->where('o.createdBy = :user')
                ->setParameter('user', $user->getId())
                ->setMaxResults(1)
                ->getQuery()
                ->getOneOrNullResult();
    }
}

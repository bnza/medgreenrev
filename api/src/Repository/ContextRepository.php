<?php

namespace App\Repository;

use App\Entity\Data\Context;
use App\Entity\Data\Join\Analysis\AnalysisContextBotany;
use App\Entity\Data\Join\Analysis\AnalysisContextZoo;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ContextRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Context::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Context) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Context::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, AnalysisContextBotany::class, 'subject')) {
            $result[] = AnalysisContextBotany::class;
        }

        if ($this->existsReference($subject, AnalysisContextZoo::class, 'subject')) {
            $result[] = AnalysisContextZoo::class;
        }

        return $result;
    }
}

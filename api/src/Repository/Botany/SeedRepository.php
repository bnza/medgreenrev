<?php

namespace App\Repository\Botany;

use App\Entity\Data\Botany\Seed;
use App\Entity\Data\Join\Analysis\AnalysisBotanySeed;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class SeedRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Seed::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Seed) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Seed::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, AnalysisBotanySeed::class, 'subject')) {
            $result[] = AnalysisBotanySeed::class;
        }

        return $result;
    }
}

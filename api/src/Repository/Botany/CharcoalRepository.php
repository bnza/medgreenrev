<?php

namespace App\Repository\Botany;

use App\Entity\Data\Botany\Charcoal;
use App\Entity\Data\Join\Analysis\AnalysisBotanyCharcoal;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class CharcoalRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Charcoal::class);
    }

    /**
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Charcoal) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Charcoal::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, AnalysisBotanyCharcoal::class, 'subject')) {
            $result[] = AnalysisBotanyCharcoal::class;
        }

        return $result;
    }
}

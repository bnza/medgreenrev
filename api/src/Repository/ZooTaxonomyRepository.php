<?php

namespace App\Repository;

use App\Entity\Data\Join\Analysis\AnalysisContextZooTaxonomy;
use App\Entity\Data\Zoo\Bone;
use App\Entity\Data\Zoo\Tooth;
use App\Entity\Vocabulary\History\Animal;
use App\Entity\Vocabulary\Zoo\Taxonomy;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ZooTaxonomyRepository extends ServiceEntityRepository
{
    use ReferencingEntityClassesTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Taxonomy::class);
    }

    /**
     * Returns the list of entity classes that still reference the given taxonomy.
     * Uses DQL EXISTS subqueries to check for the presence of related rows.
     *
     * @return array<class-string>
     */
    public function getReferencingEntityClasses(object $subject): array
    {
        if (!$subject instanceof Taxonomy) {
            throw new \InvalidArgumentException(sprintf('Expected instance of %s, %s given', Taxonomy::class, is_object($subject) ? get_debug_type($subject) : gettype($subject)));
        }
        $result = [];

        if ($this->existsReference($subject, Bone::class, 'taxonomy')) {
            $result[] = Bone::class;
        }

        if ($this->existsReference($subject, Tooth::class, 'taxonomy')) {
            $result[] = Tooth::class;
        }

        if ($this->existsReference($subject, AnalysisContextZooTaxonomy::class, 'taxonomy')) {
            $result[] = AnalysisContextZooTaxonomy::class;
        }

        if ($this->existsReference($subject, Animal::class, 'taxonomy')) {
            $result[] = Animal::class;
        }

        return $result;
    }
}

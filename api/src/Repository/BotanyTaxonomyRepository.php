<?php

namespace App\Repository;

use App\Entity\Data\Botany\Charcoal;
use App\Entity\Data\Botany\Seed;
use App\Entity\Data\Join\Analysis\AnalysisContextBotanyTaxonomy;
use App\Entity\Data\Join\Analysis\AnalysisSampleBotanyTaxonomy;
use App\Entity\Data\Join\Analysis\AnalysisSedimentCoreDepthBotanyTaxonomy;
use App\Entity\Vocabulary\Botany\Taxonomy;
use App\Entity\Vocabulary\History\Plant;
use App\Repository\Traits\ReferencingEntityClassesTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class BotanyTaxonomyRepository extends ServiceEntityRepository
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

        if ($this->existsReference($subject, Seed::class, 'taxonomy')) {
            $result[] = Seed::class;
        }

        if ($this->existsReference($subject, Charcoal::class, 'taxonomy')) {
            $result[] = Charcoal::class;
        }

        if ($this->existsReference($subject, AnalysisContextBotanyTaxonomy::class, 'taxonomy')) {
            $result[] = AnalysisContextBotanyTaxonomy::class;
        }

        if ($this->existsReference($subject, AnalysisSampleBotanyTaxonomy::class, 'taxonomy')) {
            $result[] = AnalysisSampleBotanyTaxonomy::class;
        }

        if ($this->existsReference($subject, AnalysisSedimentCoreDepthBotanyTaxonomy::class, 'taxonomy')) {
            $result[] = AnalysisSedimentCoreDepthBotanyTaxonomy::class;
        }

        if ($this->existsReference($subject, Plant::class, 'taxonomy')) {
            $result[] = Plant::class;
        }

        if ($this->existsReference($subject, Taxonomy::class, 'parent')) {
            $result[] = Taxonomy::class;
        }

        return $result;
    }
}

<?php

namespace App\Security\Voter;

use App\Entity\Data\Join\Analysis\AnalysisSampleBotanyTaxonomy;

class AnalysisSampleBotanyTaxonomyVoter extends AbstractAnalysisBotanyTaxonomyVoter
{
    protected function getSupportedClass(): string
    {
        return AnalysisSampleBotanyTaxonomy::class;
    }

    protected function getAnalysis(mixed $subject): object
    {
        /* @var AnalysisSampleBotanyTaxonomy $subject */
        return $subject->getAnalysis();
    }
}

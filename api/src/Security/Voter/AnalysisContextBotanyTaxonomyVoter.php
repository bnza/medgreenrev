<?php

namespace App\Security\Voter;

use App\Entity\Data\Join\Analysis\AnalysisContextBotanyTaxonomy;

class AnalysisContextBotanyTaxonomyVoter extends AbstractAnalysisBotanyTaxonomyVoter
{
    protected function getSupportedClass(): string
    {
        return AnalysisContextBotanyTaxonomy::class;
    }

    protected function getAnalysis(mixed $subject): object
    {
        /* @var AnalysisContextBotanyTaxonomy $subject */
        return $subject->getAnalysis();
    }
}

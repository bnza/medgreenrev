<?php

namespace App\Security\Voter;

use App\Entity\Data\Join\Analysis\AnalysisSedimentCoreDepthBotanyTaxonomy;

class AnalysisSedimentCoreDepthBotanyTaxonomyVoter extends AbstractAnalysisBotanyTaxonomyVoter
{
    protected function getSupportedClass(): string
    {
        return AnalysisSedimentCoreDepthBotanyTaxonomy::class;
    }

    protected function getAnalysis(mixed $subject): object
    {
        /* @var AnalysisSedimentCoreDepthBotanyTaxonomy $subject */
        return $subject->getAnalysis();
    }
}

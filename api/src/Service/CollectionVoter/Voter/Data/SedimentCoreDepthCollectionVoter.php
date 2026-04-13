<?php

namespace App\Service\CollectionVoter\Voter\Data;

use App\Entity\Data\SedimentCore;
use App\Entity\Data\StratigraphicUnit;
use App\Service\CollectionVoter\Voter\AbstractCollectionVoter;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

readonly class SedimentCoreDepthCollectionVoter extends AbstractCollectionVoter
{
    protected function voteOnSubCollection(object $parent, TokenInterface $token): bool
    {
        if (in_array(get_class($parent), [SedimentCore::class, StratigraphicUnit::class])) {
            return $this->accessDecisionManager->decide($token, ['ROLE_GEO_ARCHAEOLOGIST']);
        }

        return false;
    }

    protected function voteOnWholeCollection(string $context, TokenInterface $token): bool
    {
        return $this->accessDecisionManager->decide($token, ['ROLE_GEO_ARCHAEOLOGIST']);
    }
}

<?php

namespace App\Service\CollectionVoter\Voter\Data\Join;

use App\Entity\Auth\User;
use App\Entity\Data\SamplingStratigraphicUnit;
use App\Entity\Data\SedimentCore;
use App\Service\CollectionVoter\Voter\AbstractCollectionVoter;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

readonly class SedimentCoreDepthCollectionVoter extends AbstractCollectionVoter
{
    protected function voteOnSubCollection(object $parent, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (($parent instanceof SamplingStratigraphicUnit
            || $parent instanceof SedimentCore)
            && $user instanceof User) {
            return $this->accessDecisionManager->decide($token, ['ROLE_GEO_ARCHAEOLOGIST']);
        }

        return false;
    }

    protected function voteOnWholeCollection(string $context, TokenInterface $token): bool
    {
        return $this->accessDecisionManager->decide($token, ['ROLE_GEO_ARCHAEOLOGIST']);
    }
}

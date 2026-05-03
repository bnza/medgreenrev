<?php

namespace App\Security\Voter;

use App\Entity\Data\Join\Analysis\AnalysisSedimentCoreDepthBotany;
use App\Security\Utils\SitePrivilegeManager;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\AccessDecisionManagerInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class AnalysisSedimentCoreDepthBotanyVoter extends Voter
{
    use ApiOperationVoterTrait;

    public function __construct(
        private readonly AccessDecisionManagerInterface $accessDecisionManager,
        private readonly SitePrivilegeManager $sitePrivilegeManager,
        private readonly Security $security,
    ) {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $this->isAttributeSupported($attribute)
            && $subject instanceof AnalysisSedimentCoreDepthBotany;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        if (self::READ === $attribute) {
            return true;
        }

        /* @var AnalysisSedimentCoreDepthBotany $subject */
        return $this->security->isGranted('update', $subject->getSubject())
            || $this->security->isGranted('update', $subject->getAnalysis());
    }
}

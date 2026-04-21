<?php

namespace App\Entity\Data\Join\Analysis\AbsDating;

use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\Join\Analysis\AnalysisSedimentCoreDepth;
use App\Entity\Data\Join\Analysis\BaseAnalysisJoin;
use App\Metadata\Attribute\ApiAbsDatingAnalysisJoinResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'abs_dating_analysis_sediment_core_depths',
)]
#[ApiAbsDatingAnalysisJoinResource(
    subjectClass: self::class,
    templateParentResourceName: 'sediment_core_depths',
    itemNormalizationGroups: ['abs_dating_analysis_join:acl:read', 'analysis_sediment_core_depth:acl:read']
)]
class AbsDatingAnalysisSedimentCoreDepth extends AbsDatingAnalysisJoin
{
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity: AnalysisSedimentCoreDepth::class, inversedBy: 'absDatingAnalysis')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ApiProperty(identifier: false)]
    #[Groups(['abs_dating_analysis_join:acl:read', 'abs_dating_analysis_join:create'])]
    protected BaseAnalysisJoin $analysis;
}

<?php

namespace App\Entity\Data\Join\Analysis\AbsDating;

use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\Join\Analysis\AnalysisSedimentCore;
use App\Entity\Data\Join\Analysis\BaseAnalysisJoin;
use App\Metadata\Attribute\ApiAbsDatingAnalysisJoinResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'abs_dating_analysis_sediment_cores',
)]
#[ApiAbsDatingAnalysisJoinResource(
    subjectClass: self::class,
    templateParentResourceName: 'sediment_cores',
    itemNormalizationGroups: ['abs_dating_analysis_join:acl:read', 'analysis_sediment_core:acl:read']
)]
class AbsDatingAnalysisSedimentCore extends AbsDatingAnalysisJoin
{
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity: AnalysisSedimentCore::class, inversedBy: 'absDatingAnalysis')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ApiProperty(identifier: false)]
    #[Groups(['abs_dating_analysis_join:acl:read', 'abs_dating_analysis_join:create'])]
    protected BaseAnalysisJoin $analysis;
}

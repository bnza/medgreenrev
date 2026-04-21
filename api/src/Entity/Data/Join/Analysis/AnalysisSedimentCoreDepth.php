<?php

namespace App\Entity\Data\Join\Analysis;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use App\Doctrine\Filter\UnaccentedSearchFilter;
use App\Entity\Data\Analysis;
use App\Entity\Data\Join\Analysis\AbsDating\AbsDatingAnalysisJoin;
use App\Entity\Data\Join\Analysis\AbsDating\AbsDatingAnalysisSedimentCoreDepth;
use App\Entity\Data\Join\SedimentCoreDepth;
use App\Metadata\Attribute\ApiAnalysisJoinResource;
use App\Metadata\Attribute\SubResourceFilters\ApiStratigraphicUnitSubresourceFilters;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\SequenceGenerator;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(
    name: 'analysis_sediment_core_depths',
)]
#[ORM\AssociationOverrides([
    new ORM\AssociationOverride(
        name: 'analysis',
        inversedBy: 'subjectSedimentCoreDepths'
    ),
])]
#[ApiAnalysisJoinResource(
    subjectClass: SedimentCoreDepth::class,
    templateParentResourceName: 'sediment_core_depths',
    itemNormalizationGroups: ['analysis_sediment_core_depth:acl:read', 'sediment_core_depth:acl:read'])]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'subject.sedimentCore' => 'exact',
        'subject.sedimentCore.site' => 'exact',
        'subject.stratigraphicUnit' => 'exact',
    ]
)]
#[ApiFilter(
    RangeFilter::class,
    properties: [
        'subject.depthMin',
        'subject.depthMax',
    ]
)]
#[ApiFilter(
    ExistsFilter::class,
    properties: [
        'subject.notes',
    ]
)]
#[ApiFilter(
    UnaccentedSearchFilter::class,
    properties: [
        'subject.notes',
    ]
)]
#[ApiFilter(
    BooleanFilter::class,
    properties: [
        'subject.pollen',
        'subject.geochemistry',
        'subject.sedimentaryDna',
        'subject.phytoliths',
        'subject.organicChemistry',
        'subject.plantMacroRemains',
        'subject.oslDating',
        'subject.microCharcoal',
    ]
)]
#[ApiStratigraphicUnitSubresourceFilters('subject.stratigraphicUnit')]
class AnalysisSedimentCoreDepth extends BaseAnalysisJoin
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint', unique: true)]
    #[SequenceGenerator(sequenceName: 'analysis_join_id_seq')]
    protected int $id;

    #[ORM\ManyToOne(targetEntity: SedimentCoreDepth::class, inversedBy: 'analyses')]
    #[ORM\JoinColumn(name: 'subject_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'analysis_join:acl:read',
        'analysis_join:create',
        'sediment_core_depth:acl:read',
    ])]
    #[Assert\NotBlank(groups: ['validation:analysis_join:create'])]
    private ?SedimentCoreDepth $subject = null;

    #[ORM\OneToOne(targetEntity: AbsDatingAnalysisSedimentCoreDepth::class, mappedBy: 'analysis', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups([
        'analysis_sediment_core_depth:acl:read',
        'analysis_sediment_core_depth:export',
        'analysis_join:acl:read',
        'analysis_join:create',
        'analysis_join:update',
    ])]
    private ?AbsDatingAnalysisJoin $absDatingAnalysis;

    public function getSubject(): ?SedimentCoreDepth
    {
        return $this->subject;
    }

    public function setSubject(?SedimentCoreDepth $subject): self
    {
        $this->subject = $subject;

        return $this;
    }

    public function getAbsDatingAnalysis(): ?AbsDatingAnalysisJoin
    {
        return $this->absDatingAnalysis;
    }

    public function setAbsDatingAnalysis(?AbsDatingAnalysisJoin $absDatingAnalysis): self
    {
        $this->absDatingAnalysis = $absDatingAnalysis;
        $absDatingAnalysis?->setAnalysis($this);

        return $this;
    }

    public static function getPermittedAnalysisTypes(): array
    {
        return array_keys(
            array_filter(
                Analysis::TYPES,
                fn ($type) => in_array(
                    $type['group'],
                    [
                        Analysis::GROUP_ABS_DATING,
                        Analysis::GROUP_MICROSCOPE,
                        Analysis::GROUP_MATERIAL_ANALYSIS,
                        Analysis::GROUP_SEDIMENT,
                    ]
                )
            )
        );
    }
}

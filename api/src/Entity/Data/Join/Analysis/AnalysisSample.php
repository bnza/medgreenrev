<?php

namespace App\Entity\Data\Join\Analysis;

use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use App\Doctrine\Filter\UnaccentedSearchFilter;
use App\Entity\Data\Analysis;
use App\Entity\Data\Join\Analysis\AbsDating\AbsDatingAnalysisJoin;
use App\Entity\Data\Join\Analysis\AbsDating\AbsDatingAnalysisSample;
use App\Entity\Data\Sample;
use App\Metadata\Attribute\ApiAnalysisJoinResource;
use App\Metadata\Attribute\SubResourceFilters\ApiStratigraphicUnitSubresourceFilters;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\SequenceGenerator;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(
    name: 'analysis_samples',
)]
#[ORM\AssociationOverrides([
    new ORM\AssociationOverride(
        name: 'analysis',
        inversedBy: 'subjectSamples'
    ),
])]
#[ApiAnalysisJoinResource(
    subjectClass: Sample::class,
    templateParentResourceName: 'samples',
    itemNormalizationGroups: ['analysis_sample:acl:read', 'sample:acl:read'])]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'subject.site' => 'exact',
        'subject.sampleStratigraphicUnits.stratigraphicUnit' => 'exact',
        'subject.type' => 'exact',
        'subject.year' => 'exact',
        'subject.number' => 'exact',
    ]
)]
#[ApiFilter(
    RangeFilter::class,
    properties: [
        'subject.year',
        'subject.number',
    ]
)]
#[ApiFilter(
    UnaccentedSearchFilter::class,
    properties: [
        'subject.description',
    ]
)]
#[ApiFilter(
    ExistsFilter::class,
    properties: [
        'subject.description',
    ]
)]
#[ApiStratigraphicUnitSubresourceFilters('subject.sampleStratigraphicUnits.stratigraphicUnit')]
class AnalysisSample extends BaseAnalysisJoin
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint', unique: true)]
    #[SequenceGenerator(sequenceName: 'analysis_join_id_seq')]
    #[Groups([
        'analysis_join:acl:read',
        'analysis_sample:acl:read',
        'analysis_sample:export',
    ])]
    protected int $id;

    #[ORM\ManyToOne(targetEntity: Sample::class, inversedBy: 'analyses')]
    #[ORM\JoinColumn(name: 'subject_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'analysis_sample:acl:read',
        'analysis_sample:export',
        'analysis_join:acl:read',
        'analysis_join:create',
    ])]
    #[Assert\NotBlank(groups: [
        'validation:analysis_join:create',
    ])]
    private Sample $subject;

    #[ORM\OneToOne(targetEntity: AbsDatingAnalysisSample::class, mappedBy: 'analysis', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups([
        'analysis_sample:acl:read',
        'analysis_sample:export',
        'analysis_join:acl:read',
        'analysis_join:create',
        'analysis_join:update',
    ])]
    private ?AbsDatingAnalysisJoin $absDatingAnalysis;

    public function getSubject(): ?Sample
    {
        return $this->subject;
    }

    public function setSubject(?Sample $subject): self
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
            array_filter(Analysis::TYPES, fn ($type) => in_array($type['group'], [
                Analysis::GROUP_ABS_DATING,
                Analysis::GROUP_MATERIAL_ANALYSIS,
                Analysis::GROUP_SEDIMENT,
            ]))
        );
    }
}

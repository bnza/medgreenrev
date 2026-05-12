<?php

namespace App\Entity\Data\Join\Analysis;

use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use App\Doctrine\Filter\UnaccentedSearchFilter;
use App\Entity\Data\Analysis;
use App\Entity\Data\Sample;
use App\Metadata\Attribute\ApiAnalysisJoinResource;
use App\Metadata\Attribute\SubResourceFilters\ApiStratigraphicUnitSubresourceFilters;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\SequenceGenerator;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(
    name: 'analysis_samples_botany',
)]
#[ORM\AssociationOverrides([
    new ORM\AssociationOverride(
        name: 'analysis',
        inversedBy: 'subjectSampleBotany'
    ),
])]
#[ApiAnalysisJoinResource(
    subjectClass: Sample::class,
    templateParentResourceName: 'botany',
    itemNormalizationGroups: ['sample_botany_analysis:acl:read', 'sample:acl:read'],
    templateParentCategoryName: 'samples'
)]
#[ApiFilter(
    OrderFilter::class,
    properties: [
        'subject.codeView.code',
        'subject.site.code',
    ]
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'subject.site' => 'exact',
        'subject.type' => 'exact',
        'subject.sampleStratigraphicUnits.stratigraphicUnit' => 'exact',
        'subject.year' => 'exact',
        'subject.number' => 'exact',
        'taxonomies.taxonomy' => 'exact',
        'taxonomies.taxonomy.flat.classId' => 'exact',
        'taxonomies.taxonomy.flat.familyId' => 'exact',
        'taxonomies.taxonomy.flat.genusId' => 'exact',
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
    ExistsFilter::class,
    properties: [
        'taxonomies',
        'subject.description',
    ]
)]
#[ApiFilter(
    UnaccentedSearchFilter::class,
    properties: [
        'subject.description',
    ]
)]
#[ApiStratigraphicUnitSubresourceFilters('subject.sampleStratigraphicUnits.stratigraphicUnit')]
class AnalysisSampleBotany extends BaseAnalysisJoin
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint', unique: true)]
    #[SequenceGenerator(sequenceName: 'analysis_join_id_seq')]
    #[ApiProperty(required: true)]
    protected int $id;

    #[ORM\ManyToOne(targetEntity: Sample::class, inversedBy: 'botanyAnalyses')]
    #[ORM\JoinColumn(name: 'subject_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'analysis_join:acl:read',
        'analysis_join:create',
        'sample_botany_analysis:acl:read',
        'sample_botany_analysis:export',
    ])]
    #[Assert\NotBlank(groups: ['validation:analysis_join:create'])]
    private ?Sample $subject = null;

    /** @var Collection<AnalysisSampleBotanyTaxonomy> */
    #[ORM\OneToMany(
        targetEntity: AnalysisSampleBotanyTaxonomy::class,
        mappedBy: 'analysis',
        cascade: ['remove'],
    )]
    private Collection $taxonomies;

    public function getSubject(): ?Sample
    {
        return $this->subject;
    }

    public function setSubject(?Sample $subject): self
    {
        $this->subject = $subject;

        return $this;
    }

    public function getTaxonomies(): Collection
    {
        return $this->taxonomies;
    }

    public static function getPermittedAnalysisTypes(): array
    {
        return array_keys(
            array_filter(
                Analysis::TYPES,
                fn ($type) => in_array($type, [Analysis::TYPE_SDNA, Analysis::TYPE_POL, Analysis::TYPE_PHY]),
                ARRAY_FILTER_USE_KEY
            )
        );
    }
}

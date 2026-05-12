<?php

namespace App\Entity\Data\Join\Analysis;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use App\Doctrine\Filter\UnaccentedSearchFilter;
use App\Entity\Data\Analysis;
use App\Entity\Data\Join\SedimentCoreDepth;
use App\Metadata\Attribute\ApiAnalysisJoinResource;
use App\Metadata\Attribute\SubResourceFilters\ApiStratigraphicUnitSubresourceFilters;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\SequenceGenerator;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'analysis_sediment_core_depths_botany')]
#[ORM\AssociationOverrides([
    new ORM\AssociationOverride(
        name: 'analysis',
        inversedBy: 'subjectSedimentCoreDepthBotany'
    ),
])]
#[ApiAnalysisJoinResource(
    subjectClass: SedimentCoreDepth::class,
    templateParentResourceName: 'botany',
    itemNormalizationGroups: ['sediment_core_depth_botany_analysis:acl:read', 'sediment_core_depth:acl:read'],
    templateParentCategoryName: 'sediment_core_depths'
)]
#[ApiFilter(
    OrderFilter::class,
    properties: [
        'subject.codeView.code',
        'subject.stratigraphicUnit.site.code',
    ]
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'subject.sedimentCore' => 'exact',
        'subject.sedimentCore.site' => 'exact',
        'subject.stratigraphicUnit' => 'exact',
        'taxonomies.taxonomy' => 'exact',
        'taxonomies.taxonomy.flat.classId' => 'exact',
        'taxonomies.taxonomy.flat.familyId' => 'exact',
        'taxonomies.taxonomy.flat.genusId' => 'exact',
        'subject.depthMin' => 'exact',
        'subject.depthMax' => 'exact',
        'subject.sedimentCore.number' => 'exact',
        'subject.sedimentCore.year' => 'exact',
    ]
)]
#[ApiFilter(
    RangeFilter::class,
    properties: [
        'subject.depthMin',
        'subject.depthMax',
        'subject.sedimentCore.number',
        'subject.sedimentCore.year',
    ]
)]
#[ApiFilter(
    ExistsFilter::class,
    properties: [
        'taxonomies',
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
)] #[ApiStratigraphicUnitSubresourceFilters('subject.stratigraphicUnit')]
class AnalysisSedimentCoreDepthBotany extends BaseAnalysisJoin
{
    #[ORM\Id, ORM\GeneratedValue(strategy: 'SEQUENCE'), ORM\Column(type: 'bigint', unique: true)]
    #[SequenceGenerator(sequenceName: 'analysis_join_id_seq')]
    protected int $id;

    #[ORM\ManyToOne(targetEntity: SedimentCoreDepth::class, inversedBy: 'botanyAnalyses')]
    #[ORM\JoinColumn(name: 'subject_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'analysis_join:acl:read',
        'analysis_join:create',
        'sediment_core_depth_botany_analysis:acl:read',
        'sediment_core_depth_botany_analysis:export',
    ])]
    #[Assert\NotBlank(groups: ['validation:analysis_join:create'])]
    private ?SedimentCoreDepth $subject = null;

    /** @var Collection<AnalysisSedimentCoreDepthBotanyTaxonomy> */
    #[ORM\OneToMany(targetEntity: AnalysisSedimentCoreDepthBotanyTaxonomy::class, mappedBy: 'analysis', cascade: ['remove'])]
    private Collection $taxonomies;

    public function getSubject(): ?SedimentCoreDepth
    {
        return $this->subject;
    }

    public function setSubject(?SedimentCoreDepth $subject): self
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

<?php

namespace App\Entity\Data\Botany;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Doctrine\Filter\Granted\GrantedParentStratigraphicUnitFilter;
use App\Doctrine\Filter\SearchSiteAndIdFilter;
use App\Dto\Output\WfsGetFeatureCollectionExtentMatched;
use App\Dto\Output\WfsGetFeatureCollectionNumberMatched;
use App\Entity\Data\ArchaeologicalSite;
use App\Entity\Data\Join\Analysis\AnalysisBotanyCharcoal;
use App\Entity\Data\StratigraphicUnit;
use App\Entity\Data\View\BotanyCharcoalView;
use App\Entity\Data\View\Code\BotanyCharcoalCodeView;
use App\Entity\Vocabulary\Botany\ElementPart;
use App\Entity\Vocabulary\Botany\Taxonomy;
use App\Metadata\Attribute\SubResourceFilters\ApiAnalysisSubresourceFilters;
use App\Metadata\Attribute\SubResourceFilters\ApiStratigraphicUnitSubresourceFilters;
use App\Metadata\ExportFeatureCollection;
use App\Metadata\GetAggregatedFeatureCollection;
use App\State\GeoserverAggregatedExtentMatchedProvider;
use App\State\GeoserverAggregatedNumberMatchedProvider;
use App\State\SiteChildCollectionProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\SequenceGenerator;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(
    name: 'botany_charcoals',
)]
#[ApiResource(
    shortName: 'BotanyCharcoal',
    operations: [
        new Get(
            uriTemplate: '/data/botany/charcoals/{id}',
        ),
        new GetCollection(
            uriTemplate: '/data/botany/charcoals',
            formats: ['jsonld' => 'application/ld+json', 'csv' => 'text/csv'],
        ),
        new GetCollection(
            uriTemplate: '/data/stratigraphic_units/{parentId}/botany/charcoals',
            formats: ['jsonld' => 'application/ld+json', 'csv' => 'text/csv'],
            uriVariables: [
                'parentId' => new Link(
                    toProperty: 'stratigraphicUnit',
                    fromClass: StratigraphicUnit::class,
                ),
            ]
        ),
        new GetCollection(
            uriTemplate: '/data/archaeological_sites/{parentId}/botany/charcoals',
            formats: ['jsonld' => 'application/ld+json', 'csv' => 'text/csv'],
            uriVariables: [
                'parentId' => new Link(
                    fromClass: ArchaeologicalSite::class,
                ),
            ],
            provider: SiteChildCollectionProvider::class,
        ),
        new Post(
            uriTemplate: '/data/botany/charcoals',
            securityPostDenormalize: 'is_granted("create", object)',
            validationContext: ['groups' => ['validation:botany_charcoal:create']],
        ),
        new Patch(
            uriTemplate: '/data/botany/charcoals/{id}',
            security: 'is_granted("update", object)',
            validationContext: ['groups' => ['validation:botany_charcoal:create']],
        ),
        new Delete(
            uriTemplate: '/data/botany/charcoals/{id}',
            security: 'is_granted("delete", object)',
        ),
        new GetAggregatedFeatureCollection(
            uriTemplate: '/features/botany/charcoals.{_format}',
            typeName: 'mgr:archaeological_sites',
            parentAccessor: 'stratigraphicUnit.site',
            entityTypeName: 'mgr:botany_charcoals',
            propertyNames: ['id', 'code', 'name'],
        ),
        new Get(
            uriTemplate: '/features/number_matched/botany/charcoals',
            defaults: ['typeName' => 'mgr:archaeological_sites', 'parentAccessor' => 'stratigraphicUnit.site'],
            normalizationContext: ['groups' => ['wfs_number_matched:read']],
            output: WfsGetFeatureCollectionNumberMatched::class,
            provider: GeoserverAggregatedNumberMatchedProvider::class,
        ),
        new Get(
            uriTemplate: '/features/extent_matched/botany/charcoals',
            defaults: ['typeName' => 'mgr:archaeological_sites', 'parentAccessor' => 'stratigraphicUnit.site'],
            normalizationContext: ['groups' => ['wfs_extent_matched:read']],
            output: WfsGetFeatureCollectionExtentMatched::class,
            provider: GeoserverAggregatedExtentMatchedProvider::class,
        ),
        new ExportFeatureCollection(
            uriTemplate: '/features/export/botany/charcoals',
            typeName: 'mgr:botany_charcoals',
        ),
    ],
    normalizationContext: ['groups' => ['botany_charcoal:acl:read']],
    denormalizationContext: ['groups' => ['botany_charcoal:create']],
    order: ['id' => 'DESC'],
)]
#[ApiFilter(
    OrderFilter::class,
    properties: [
        'codeView.code',
        'id',
        'stratigraphicUnit.site.code',
        'stratigraphicUnit.codeView.code',
        'cf',
        'sp',
        'type',
        'flat.value',
        'part.value',
        'taxonomy.flat.species',
        'taxonomy.flat.genus',
        'taxonomy.flat.family',
        'taxonomy.flat.class',
        'endsPreserved',
    ])]
#[ApiFilter(SearchSiteAndIdFilter::class)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'analyses.summary' => 'ipartial',
        'taxonomy' => 'exact',
        'notes' => 'ipartial',
        'part' => 'exact',
        'taxonomy.flat.classId' => 'exact',
        'taxonomy.flat.familyId' => 'exact',
        'taxonomy.flat.genusId' => 'exact',
    ]
)]
#[ApiFilter(
    ExistsFilter::class,
    properties: [
        'analyses',
        'analyses.summary',
        'notes',
        'part',
        'taxonomy.flat.class',
        'taxonomy.flat.genus',
        'taxonomy.flat.species',
    ]
)]
#[ApiFilter(
    BooleanFilter::class,
    properties: [
        'cf',
        'sp',
        'type',
    ]
)]
#[ApiFilter(
    GrantedParentStratigraphicUnitFilter::class
)]
#[ApiAnalysisSubresourceFilters('analyses.analysis')]
#[ApiStratigraphicUnitSubresourceFilters('stratigraphicUnit')]
class Charcoal
{
    #[ORM\OneToOne(
        targetEntity: BotanyCharcoalCodeView::class,
        mappedBy: 'charcoal',
    )]
    private ?BotanyCharcoalCodeView $codeView = null;

    #[ORM\OneToOne(targetEntity: BotanyCharcoalView::class, mappedBy: 'charcoal', fetch: 'LAZY')]
    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal:export',
    ])]
    #[ApiProperty(required: true)]
    private BotanyCharcoalView $flat;

    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint')]
    #[SequenceGenerator(sequenceName: 'botany_item_id_seq')]
    #[Groups([
        'botany_charcoal:acl:read',
    ])]
    #[ApiProperty(required: true)]
    private int $id;

    #[ORM\ManyToOne(targetEntity: StratigraphicUnit::class, inversedBy: 'botanyCharcoals')]
    #[ORM\JoinColumn(name: 'stratigraphic_unit_id', referencedColumnName: 'id', nullable: false, onDelete: 'RESTRICT')]
    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal:create',
        'botany_charcoal:export',
    ])]
    #[Assert\NotBlank(groups: [
        'validation:botany_charcoal:create',
    ])]
    #[ApiProperty(required: true)]
    private StratigraphicUnit $stratigraphicUnit;

    /** @var Collection<AnalysisBotanyCharcoal> */
    #[ORM\OneToMany(
        targetEntity: AnalysisBotanyCharcoal::class,
        mappedBy: 'subject',
        cascade: ['persist', 'remove'],
        orphanRemoval: true,
    )]
    private Collection $analyses;

    #[ORM\ManyToOne(targetEntity: Taxonomy::class)]
    #[ORM\JoinColumn(name: 'voc_taxonomy_id', referencedColumnName: 'id', nullable: true, onDelete: 'RESTRICT')]
    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal:create',
        'botany_charcoal:export',
    ])]
    #[Assert\NotBlank(groups: [
        'validation:botany_charcoal:create',
    ])]
    #[ApiProperty(required: true)]
    private Taxonomy $taxonomy;

    #[ORM\ManyToOne(targetEntity: ElementPart::class)]
    #[ORM\JoinColumn(name: 'voc_element_part_id', referencedColumnName: 'id', nullable: true, onDelete: 'RESTRICT')]
    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal:create',
        'botany_charcoal:export',
    ])]
    private ?ElementPart $part = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal:create',
        'botany_charcoal:export',
    ])]
    private bool $cf = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal:create',
        'botany_charcoal:export',
    ])]
    private bool $sp = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal:create',
        'botany_charcoal:export',
    ])]
    private bool $type = false;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal:create',
        'botany_charcoal:export',
    ])]
    private ?string $notes = null;

    public function __construct()
    {
        $this->analyses = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getStratigraphicUnit(): StratigraphicUnit
    {
        return $this->stratigraphicUnit;
    }

    public function setStratigraphicUnit(StratigraphicUnit $stratigraphicUnit): Charcoal
    {
        $this->stratigraphicUnit = $stratigraphicUnit;

        return $this;
    }

    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal_analysis:acl:read',
    ])]
    public function getCode(): string
    {
        return $this->codeView->getCode();
    }

    public function getTaxonomy(): Taxonomy
    {
        return $this->taxonomy;
    }

    public function setTaxonomy(Taxonomy $taxonomy): Charcoal
    {
        $this->taxonomy = $taxonomy;

        return $this;
    }

    public function getPart(): ?ElementPart
    {
        return $this->part;
    }

    public function setPart(?ElementPart $part): Charcoal
    {
        $this->part = $part;

        return $this;
    }

    public function isCf(): bool
    {
        return $this->cf;
    }

    public function setCf(bool $cf): Charcoal
    {
        $this->cf = $cf;

        return $this;
    }

    public function isSp(): bool
    {
        return $this->sp;
    }

    public function setSp(bool $sp): Charcoal
    {
        $this->sp = $sp;

        return $this;
    }

    public function isType(): bool
    {
        return $this->type;
    }

    public function setType(bool $type): Charcoal
    {
        $this->type = $type;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): Charcoal
    {
        $this->notes = $notes ?? null;

        return $this;
    }

    public function getFlat(): BotanyCharcoalView
    {
        return $this->flat;
    }

    public function getAnalyses(): Collection
    {
        return $this->analyses;
    }

    public function setAnalyses(Collection $analyses): Charcoal
    {
        $this->analyses = $analyses;

        return $this;
    }
}

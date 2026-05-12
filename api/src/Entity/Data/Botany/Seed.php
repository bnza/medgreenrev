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
use App\Entity\Data\Join\Analysis\AnalysisBotanySeed;
use App\Entity\Data\StratigraphicUnit;
use App\Entity\Data\View\BotanySeedView;
use App\Entity\Data\View\Code\BotanySeedCodeView;
use App\Entity\Vocabulary\Botany\Element as VocabularyElement;
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
    name: 'botany_seeds',
)]
#[ApiResource(
    shortName: 'BotanySeed',
    operations: [
        new Get(
            uriTemplate: '/data/botany/seeds/{id}',
        ),
        new GetCollection(
            uriTemplate: '/data/botany/seeds',
            formats: ['jsonld' => 'application/ld+json', 'csv' => 'text/csv'],
        ),
        new GetCollection(
            uriTemplate: '/data/stratigraphic_units/{parentId}/botany/seeds',
            formats: ['jsonld' => 'application/ld+json', 'csv' => 'text/csv'],
            uriVariables: [
                'parentId' => new Link(
                    toProperty: 'stratigraphicUnit',
                    fromClass: StratigraphicUnit::class,
                ),
            ]
        ),
        new GetCollection(
            uriTemplate: '/data/archaeological_sites/{parentId}/botany/seeds',
            formats: ['jsonld' => 'application/ld+json', 'csv' => 'text/csv'],
            uriVariables: [
                'parentId' => new Link(
                    fromClass: ArchaeologicalSite::class,
                ),
            ],
            provider: SiteChildCollectionProvider::class,
        ),
        new Post(
            uriTemplate: '/data/botany/seeds',
            securityPostDenormalize: 'is_granted("create", object)',
            validationContext: ['groups' => ['validation:botany_seed:create']],
        ),
        new Patch(
            uriTemplate: '/data/botany/seeds/{id}',
            security: 'is_granted("update", object)',
            validationContext: ['groups' => ['validation:botany_seed:create']],
        ),
        new Delete(
            uriTemplate: '/data/botany/seeds/{id}',
            security: 'is_granted("delete", object)',
        ),
        new GetAggregatedFeatureCollection(
            uriTemplate: '/features/botany/seeds.{_format}',
            typeName: 'mgr:archaeological_sites',
            parentAccessor: 'stratigraphicUnit.site',
            entityTypeName: 'mgr:botany_seeds',
            propertyNames: ['id', 'code', 'name'],
        ),
        new Get(
            uriTemplate: '/features/number_matched/botany/seeds',
            defaults: ['typeName' => 'mgr:archaeological_sites', 'parentAccessor' => 'stratigraphicUnit.site'],
            normalizationContext: ['groups' => ['wfs_number_matched:read']],
            output: WfsGetFeatureCollectionNumberMatched::class,
            provider: GeoserverAggregatedNumberMatchedProvider::class,
        ),
        new Get(
            uriTemplate: '/features/extent_matched/botany/seeds',
            defaults: ['typeName' => 'mgr:archaeological_sites', 'parentAccessor' => 'stratigraphicUnit.site'],
            normalizationContext: ['groups' => ['wfs_extent_matched:read']],
            output: WfsGetFeatureCollectionExtentMatched::class,
            provider: GeoserverAggregatedExtentMatchedProvider::class,
        ),
        new ExportFeatureCollection(
            uriTemplate: '/features/export/botany/seeds',
            typeName: 'mgr:botany_seeds',
        ),
    ],
    normalizationContext: ['groups' => ['botany_seed:acl:read']],
    denormalizationContext: ['groups' => ['botany_seed:create']],
    order: ['id' => 'DESC'],
)]
#[ApiFilter(
    OrderFilter::class,
    properties: [
        'codeView.code',
        'id',
        'stratigraphicUnit.site.code',
        'stratigraphicUnit.codeView.code',
        'taxonomy.value',
        'cf',
        'sp',
        'type',
        'flat.value',
        'part.value',
        'taxonomy.flat.species',
        'taxonomy.flat.genus',
        'taxonomy.flat.family',
        'taxonomy.flat.class',
        'element.value',
        'endsPreserved',
        'side',
    ])]
#[ApiFilter(SearchSiteAndIdFilter::class)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'analyses.summary' => 'ipartial',
        'element' => 'exact',
        'notes' => 'ipartial',
        'part' => 'exact',
        'taxonomy' => 'exact',
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
        'element',
        'part',
        'notes',
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
class Seed
{
    #[ORM\OneToOne(
        targetEntity: BotanySeedCodeView::class,
        mappedBy: 'seed',
    )]
    private ?BotanySeedCodeView $codeView = null;

    #[ORM\OneToOne(targetEntity: BotanySeedView::class, mappedBy: 'seed', fetch: 'LAZY')]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:export',
    ])]
    #[ApiProperty(required: true)]
    private BotanySeedView $flat;

    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint')]
    #[SequenceGenerator(sequenceName: 'botany_item_id_seq')]
    #[Groups([
        'botany_seed:acl:read',
    ])]
    private int $id;

    #[ORM\ManyToOne(targetEntity: StratigraphicUnit::class, inversedBy: 'botanySeeds')]
    #[ORM\JoinColumn(name: 'stratigraphic_unit_id', referencedColumnName: 'id', nullable: false, onDelete: 'RESTRICT')]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:create',
        'botany_seed:export',
    ])]
    #[Assert\NotBlank(groups: [
        'validation:botany_seed:create',
    ])]
    #[ApiProperty(required: true)]
    private StratigraphicUnit $stratigraphicUnit;

    /** @var Collection<AnalysisBotanySeed> */
    #[ORM\OneToMany(
        targetEntity: AnalysisBotanySeed::class,
        mappedBy: 'subject',
        cascade: ['persist', 'remove'],
        orphanRemoval: true,
    )]
    private Collection $analyses;

    #[ORM\ManyToOne(targetEntity: Taxonomy::class)]
    #[ORM\JoinColumn(name: 'voc_taxonomy_id', referencedColumnName: 'id', nullable: true, onDelete: 'RESTRICT')]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:create',
        'botany_seed:export',
    ])]
    #[Assert\NotBlank(groups: [
        'validation:botany_seed:create',
    ])]
    #[ApiProperty(required: true)]
    private Taxonomy $taxonomy;

    #[ORM\ManyToOne(targetEntity: VocabularyElement::class)]
    #[ORM\JoinColumn(name: 'voc_element_id', referencedColumnName: 'id', nullable: true, onDelete: 'RESTRICT')]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:create',
        'botany_seed:export',
    ])]
    private ?VocabularyElement $element;

    #[ORM\ManyToOne(targetEntity: ElementPart::class)]
    #[ORM\JoinColumn(name: 'voc_element_part_id', referencedColumnName: 'id', nullable: true, onDelete: 'RESTRICT')]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:create',
        'botany_seed:export',
    ])]
    private ?ElementPart $part = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:create',
        'botany_seed:export',
    ])]
    private bool $cf = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:create',
        'botany_seed:export',
    ])]
    private bool $sp = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:create',
        'botany_seed:export',
    ])]
    private bool $type = false;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:create',
        'botany_seed:export',
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

    public function setStratigraphicUnit(StratigraphicUnit $stratigraphicUnit): Seed
    {
        $this->stratigraphicUnit = $stratigraphicUnit;

        return $this;
    }

    #[Groups([
        'botany_seed:acl:read',
        'botany_seed_analysis:acl:read',
    ])]
    public function getCode(): string
    {
        return $this->codeView->getCode();
    }

    public function getTaxonomy(): Taxonomy
    {
        return $this->taxonomy;
    }

    public function setTaxonomy(Taxonomy $taxonomy): Seed
    {
        $this->taxonomy = $taxonomy;

        return $this;
    }

    public function getElement(): ?VocabularyElement
    {
        return $this->element;
    }

    public function setElement(?VocabularyElement $element): Seed
    {
        $this->element = $element;

        return $this;
    }

    public function getPart(): ?ElementPart
    {
        return $this->part;
    }

    public function setPart(?ElementPart $part): Seed
    {
        $this->part = $part;

        return $this;
    }

    public function isCf(): bool
    {
        return $this->cf;
    }

    public function setCf(bool $cf): Seed
    {
        $this->cf = $cf;

        return $this;
    }

    public function isSp(): bool
    {
        return $this->sp;
    }

    public function setSp(bool $sp): Seed
    {
        $this->sp = $sp;

        return $this;
    }

    public function isType(): bool
    {
        return $this->type;
    }

    public function setType(bool $type): Seed
    {
        $this->type = $type;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): Seed
    {
        $this->notes = $notes ?? null;

        return $this;
    }

    public function getFlat(): BotanySeedView
    {
        return $this->flat;
    }

    public function getAnalyses(): Collection
    {
        return $this->analyses;
    }

    public function setAnalyses(Collection $analyses): Seed
    {
        $this->analyses = $analyses;

        return $this;
    }
}

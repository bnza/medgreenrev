<?php

namespace App\Entity\Data\Join;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
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
use App\Dto\Output\WfsGetFeatureCollectionExtentMatched;
use App\Dto\Output\WfsGetFeatureCollectionNumberMatched;
use App\Entity\Data\SamplingStratigraphicUnit;
use App\Entity\Data\SedimentCore;
use App\Metadata\ExportFeatureCollection;
use App\Metadata\GetAggregatedFeatureCollection;
use App\State\GeoserverAggregatedExtentMatchedProvider;
use App\State\GeoserverAggregatedNumberMatchedProvider;
use App\Validator as AppAssert;
use BcMath\Number;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(
    name: 'sediment_core_depths',
)]
#[ORM\UniqueConstraint(columns: ['sediment_core_id', 'depth_min'])]
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/data/sediment_core_depths/{id}',
        ),
        new GetCollection(
            uriTemplate: '/data/sediment_core_depths',
            formats: ['csv' => 'text/csv', 'jsonld' => 'application/ld+json'],
        ),
        new GetCollection(
            uriTemplate: '/data/stratigraphic_units/{parentId}/sediment_cores/depths',
            formats: ['csv' => 'text/csv', 'jsonld' => 'application/ld+json'],
            uriVariables: [
                'parentId' => new Link(
                    toProperty: 'stratigraphicUnit',
                    fromClass: SamplingStratigraphicUnit::class,
                ),
            ],
            normalizationContext: [
                'groups' => ['sediment_core_depth:sediment_cores:acl:read', 'sediment_core:acl:read'],
            ],
        ),
        new GetCollection(
            uriTemplate: '/data/sediment_cores/{parentId}/stratigraphic_units/depths',
            formats: ['csv' => 'text/csv', 'jsonld' => 'application/ld+json'],
            uriVariables: [
                'parentId' => new Link(
                    toProperty: 'sedimentCore',
                    fromClass: SedimentCore::class,
                ),
            ],
            normalizationContext: [
                'groups' => ['sediment_core_depth:stratigraphic_units:acl:read', 'sampling_su:read'],
            ],
        ),
        new Post(
            uriTemplate: '/data/sediment_core_depths',
            securityPostDenormalize: 'is_granted("create", object)',
            validationContext: ['groups' => ['validation:sediment_core_depth:create']],
        ),
        new Patch(
            uriTemplate: '/data/sediment_core_depths/{id}',
            security: 'is_granted("update", object)',
        ),
        new Delete(
            uriTemplate: '/data/sediment_core_depths/{id}',
            security: 'is_granted("delete", object)',
        ),

        // Aggregated WFS Feature Collection (grouped by parent site)
        new GetAggregatedFeatureCollection(
            uriTemplate: '/features/sediment_core_depths.{_format}',
            typeName: 'mgr:sampling_sites',
            parentAccessor: 'sedimentCore.site',
            entityTypeName: 'mgr:sediment_core_depths',
            propertyNames: ['id', 'code', 'name'],
        ),

        // Number of matched features (aggregated)
        new Get(
            uriTemplate: '/features/number_matched/sediment_core_depths',
            defaults: ['typeName' => 'mgr:sampling_sites', 'parentAccessor' => 'sedimentCore.site'],
            normalizationContext: ['groups' => ['wfs_number_matched:read']],
            output: WfsGetFeatureCollectionNumberMatched::class,
            provider: GeoserverAggregatedNumberMatchedProvider::class,
        ),

        // Bounding box extent of matched features (aggregated)
        new Get(
            uriTemplate: '/features/extent_matched/sediment_core_depths',
            defaults: ['typeName' => 'mgr:sampling_sites', 'parentAccessor' => 'sedimentCore.site'],
            normalizationContext: ['groups' => ['wfs_extent_matched:read']],
            output: WfsGetFeatureCollectionExtentMatched::class,
            provider: GeoserverAggregatedExtentMatchedProvider::class,
        ),

        // Export feature collection
        new ExportFeatureCollection(
            uriTemplate: '/features/export/sediment_core_depths',
            typeName: 'mgr:sediment_core_depths',
        ),
    ],
    normalizationContext: [
        'groups' => ['sediment_core_depth:acl:read', 'sediment_core:acl:read', 'sampling_su:read'],
    ],
    order: ['id' => 'DESC'],
)]
#[ApiFilter(
    OrderFilter::class,
    properties: [
        'id',
        'depthMin',
        'depthMax',
        // Mirror SedimentCore sortable properties (excluding id)
        'sedimentCore.year',
        'sedimentCore.number',
        'sedimentCore.site.code',
        // Mirror StratigraphicUnit sortable properties (excluding id)
        'stratigraphicUnit.year',
        'stratigraphicUnit.number',
        'stratigraphicUnit.site.code',
    ],
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'sedimentCore' => 'exact',
        'sedimentCore.site' => 'exact',
        'sedimentCore.site.code' => 'exact',
        'sedimentCore.year' => 'exact',
        'sedimentCore.number' => 'exact',
        'stratigraphicUnit' => 'exact',
        'stratigraphicUnit.site' => 'exact',
    ]
)]
#[ApiFilter(
    RangeFilter::class,
    properties: [
        'depthMin',
        'depthMax',
        'sedimentCore.year',
        'sedimentCore.number',
        'stratigraphicUnit.year',
        'stratigraphicUnit.number',
        'stratigraphicUnit.chronologyLower',
        'stratigraphicUnit.chronologyUpper',
    ]
)]
#[ApiFilter(ExistsFilter::class, properties: [
    'notes',
])]
#[ApiFilter(
    BooleanFilter::class,
    properties: [
        'geochemistry',
        'microCharcoal',
        'organicChemistry',
        'oslDating',
        'phytoliths',
        'plantMacroRemains',
        'pollen',
        'sedimentaryDna',
    ])]
#[UniqueEntity(
    fields: ['sedimentCore', 'depthMin'],
    message: 'Duplicate [sediment core, min depth] combination.',
    groups: ['validation:sediment_core_depth:create']
)]
#[AppAssert\BelongToTheSameSite(groups: ['validation:sediment_core_depth:create'])]
class SedimentCoreDepth
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint', unique: true)]
    #[Groups([
        'sediment_core_depth:acl:read',
        'sediment_core_depth:stratigraphic_units:acl:read',
        'sediment_core_depth:sediment_cores:acl:read',
    ])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: SedimentCore::class, inversedBy: 'sedimentCoresStratigraphicUnits')]
    #[ORM\JoinColumn(name: 'sediment_core_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'sediment_core_depth:acl:read',
        'sediment_core_depth:sediment_cores:acl:read',
        'sediment_core_depth:sediment_cores:export',
    ])]
    #[Assert\NotBlank(groups: ['validation:sediment_core_depth:create'])]
    #[ApiProperty(required: true)]
    private ?SedimentCore $sedimentCore = null;

    #[ORM\ManyToOne(targetEntity: SamplingStratigraphicUnit::class, inversedBy: 'stratigraphicUnitSedimentCores')]
    #[ORM\JoinColumn(name: 'su_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'sediment_core_depth:acl:read',
        'sediment_core_depth:stratigraphic_units:acl:read',
        'sediment_core_depth:stratigraphic_units:export',
    ])]
    #[Assert\NotBlank(groups: ['validation:sediment_core_depth:create'])]
    #[ApiProperty(required: true)]
    private ?SamplingStratigraphicUnit $stratigraphicUnit = null;

    #[ORM\Column(type: 'number', precision: 5, scale: 1)]
    #[Groups([
        'sediment_core_depth:acl:read',
        'sediment_core_depth:sediment_cores:acl:read',
        'sediment_core_depth:stratigraphic_units:acl:read',
    ])]
    #[Assert\NotBlank(groups: ['validation:sediment_core_depth:create'])]
    #[Assert\LessThan(propertyPath: 'depthMax', groups: ['validation:sediment_core_depth:create'])]
    #[Assert\LessThan(value: 10000, groups: ['validation:sediment_core_depth:create'])]
    #[ApiProperty(
        required: true,
        schema: [
            'type' => 'string',
            'pattern' => '^[0-9]{1,4}(\.[0-9]+)?$',
            'example' => '8.5',
        ]
    )]
    private Number $depthMin;

    #[ORM\Column(type: 'number', precision: 5, scale: 1)]
    #[Groups([
        'sediment_core_depth:acl:read',
        'sediment_core_depth:sediment_cores:acl:read',
        'sediment_core_depth:stratigraphic_units:acl:read',
    ])]
    #[Assert\NotBlank(groups: ['validation:sediment_core_depth:create'])]
    #[Assert\GreaterThan(propertyPath: 'depthMin', groups: ['validation:sediment_core_depth:create'])]
    #[Assert\LessThan(value: 10000, groups: ['validation:sediment_core_depth:create'])]
    #[ApiProperty(
        required: true,
        schema: [
            'type' => 'string',
            'pattern' => '^[0-9]{1,4}(\.[0-9]+)?$',
            'example' => '9.0',
        ]
    )]
    private Number $depthMax;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups([
        'sediment_core_depth:acl:read',
        'sediment_core_depth:sediment_cores:acl:read',
        'sediment_core_depth:stratigraphic_units:acl:read',
    ])]
    private ?string $notes = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups([
        'sediment_core_depth:create',
        'sediment_core_depth:acl:read',
        'sediment_core_depth:export',
        'sampling_su:read',
    ])]
    private bool $geochemistry = false;

    #[ORM\Column(type: 'boolean')]
    #[Groups([
        'sediment_core_depth:create',
        'sediment_core_depth:acl:read',
        'sediment_core_depth:export',
        'sampling_su:read',
    ])]
    private bool $microCharcoal = false;

    #[ORM\Column(type: 'boolean')]
    #[Groups([
        'sediment_core_depth:create',
        'sediment_core_depth:acl:read',
        'sediment_core_depth:export',
        'sampling_su:read',
    ])]
    private bool $organicChemistry = false;

    #[ORM\Column(type: 'boolean')]
    #[Groups([
        'sediment_core_depth:create',
        'sediment_core_depth:acl:read',
        'sediment_core_depth:export',
        'sampling_su:read',
    ])]
    private bool $oslDating = false;

    #[ORM\Column(type: 'boolean')]
    #[Groups([
        'sediment_core_depth:create',
        'sediment_core_depth:acl:read',
        'sediment_core_depth:export',
        'sampling_su:read',
    ])]
    private bool $phytoliths = false;

    #[ORM\Column(type: 'boolean')]
    #[Groups([
        'sediment_core_depth:create',
        'sediment_core_depth:acl:read',
        'sediment_core_depth:export',
        'sampling_su:read',
    ])]
    private bool $plantMacroRemains = false;

    #[ORM\Column(type: 'boolean')]
    #[Groups([
        'sediment_core_depth:create',
        'sediment_core_depth:acl:read',
        'sediment_core_depth:export',
        'sampling_su:read',
    ])]
    private bool $pollen = false;

    #[ORM\Column(type: 'boolean')]
    #[Groups([
        'sediment_core_depth:create',
        'sediment_core_depth:acl:read',
        'sediment_core_depth:export',
        'sampling_su:read',
    ])]
    private bool $sedimentaryDna = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSedimentCore(): ?SedimentCore
    {
        return $this->sedimentCore;
    }

    public function setSedimentCore(?SedimentCore $sedimentCore): SedimentCoreDepth
    {
        $this->sedimentCore = $sedimentCore;

        return $this;
    }

    public function getStratigraphicUnit(): ?SamplingStratigraphicUnit
    {
        return $this->stratigraphicUnit;
    }

    public function setStratigraphicUnit(?SamplingStratigraphicUnit $stratigraphicUnit): SedimentCoreDepth
    {
        $this->stratigraphicUnit = $stratigraphicUnit;

        return $this;
    }

    public function getDepthMin(): Number
    {
        return $this->depthMin;
    }

    public function setDepthMin(Number|string $depthMin): SedimentCoreDepth
    {
        if (is_string($depthMin)) {
            $depthMin = new Number($depthMin);
        }
        $this->depthMin = $depthMin;

        return $this;
    }

    public function getDepthMax(): Number
    {
        return $this->depthMax;
    }

    public function setDepthMax(Number|string $depthMax): SedimentCoreDepth
    {
        if (is_string($depthMax)) {
            $depthMax = new Number($depthMax);
        }
        $this->depthMax = $depthMax;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): SedimentCoreDepth
    {
        $this->notes = $notes ?? null;

        return $this;
    }

    public function isPollen(): bool
    {
        return $this->pollen;
    }

    public function setPollen(bool $pollen): SedimentCoreDepth
    {
        $this->pollen = $pollen;

        return $this;
    }

    public function isSedimentaryDna(): bool
    {
        return $this->sedimentaryDna;
    }

    public function setSedimentaryDna(bool $sedimentaryDna): SedimentCoreDepth
    {
        $this->sedimentaryDna = $sedimentaryDna;

        return $this;
    }

    public function isPhytoliths(): bool
    {
        return $this->phytoliths;
    }

    public function setPhytoliths(bool $phytoliths): SedimentCoreDepth
    {
        $this->phytoliths = $phytoliths;

        return $this;
    }

    public function isGeochemistry(): bool
    {
        return $this->geochemistry;
    }

    public function setGeochemistry(bool $geochemistry): SedimentCoreDepth
    {
        $this->geochemistry = $geochemistry;

        return $this;
    }

    public function isOrganicChemistry(): bool
    {
        return $this->organicChemistry;
    }

    public function setOrganicChemistry(bool $organicChemistry): SedimentCoreDepth
    {
        $this->organicChemistry = $organicChemistry;

        return $this;
    }

    public function isPlantMacroRemains(): bool
    {
        return $this->plantMacroRemains;
    }

    public function setPlantMacroRemains(bool $plantMacroRemains): SedimentCoreDepth
    {
        $this->plantMacroRemains = $plantMacroRemains;

        return $this;
    }

    public function isOslDating(): bool
    {
        return $this->oslDating;
    }

    public function setOslDating(bool $oslDating): SedimentCoreDepth
    {
        $this->oslDating = $oslDating;

        return $this;
    }

    public function isMicroCharcoal(): bool
    {
        return $this->microCharcoal;
    }

    public function setMicroCharcoal(bool $microCharcoal): SedimentCoreDepth
    {
        $this->microCharcoal = $microCharcoal;

        return $this;
    }

    #[Groups([
        'sediment_core_depth:acl:read',
    ])]
    public function getCode(): string
    {
        return sprintf(
            '%s.%s',
            $this->getSedimentCore()->getCode(),
            $this->depthMin->mul(10)->round()
        );
    }
}

<?php

namespace App\Entity\Data\View;

use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use App\Doctrine\Filter\UnaccentedSearchFilter;
use App\Entity\Data\Analysis;
use App\Entity\Data\StratigraphicUnit;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'vw_abs_dating_analyses',
)]
#[ApiResource(
    shortName: 'AbsDatingAnalysis',
    operations: [
        new Get(
            uriTemplate: '/analyses/absolute_dating/{id}',
            requirements: ['id' => '\d+']
        ),
        new GetCollection(
            uriTemplate: '/analyses/absolute_dating',
            formats: ['jsonld' => 'application/ld+json', 'csv' => 'text/csv'],
            order: ['id' => 'DESC'],
        ),
        new GetCollection(
            uriTemplate: '/analyses/{parentId}/absolute_dating',
            formats: ['jsonld' => 'application/ld+json', 'csv' => 'text/csv'],
            uriVariables: [
                'parentId' => new Link(
                    toProperty: 'analysis',
                    fromClass: Analysis::class,
                ),
            ],
            requirements: ['parentId' => '\d+'],
        ),
    ],
    routePrefix: 'data',
    normalizationContext: [
        'groups' => ['abs_dating_analysis:read'],
    ]
)]
#[ApiFilter(
    OrderFilter::class,
    properties: [
        'id',
        'resourceLabel',
        'analysis.status',
        'analysis.identifier',
        'analysis.laboratory',
        'analysis.responsible',
        'analysis.type.value',
        'analysis.year',
        'datingLower',
        'datingUpper',
        'probability',
        'uncalibratedDating',
        'error',
        'calibrationCurve',
        'stratigraphicUnit.site.code',
    ]
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'stratigraphicUnit' => 'exact',
        'stratigraphicUnit.site' => 'exact',
        'analysis.type.value' => 'exact',
        'analysis.identifier' => 'ipartial',
    ]
)]
#[ApiFilter(RangeFilter::class,
    properties: [
        'analysis.year',
        'datingLower',
        'datingUpper',
        'uncalibratedDating',
        'error',
    ]
)]
#[ApiFilter(ExistsFilter::class,
    properties: [
        'probability',
    ]
)]
#[ApiFilter(UnaccentedSearchFilter::class,
    properties: [
        'analysis.laboratory',
        'analysis.responsible',
    ]
)]
class AbsDatingAnalysisView
{
    #[ORM\Id,
        ORM\Column(type: 'bigint', unique: true)]
    #[Groups(['abs_dating_analysis:read'])]
    private int $id;

    #[ORM\ManyToOne(targetEntity: StratigraphicUnit::class)]
    #[Groups(['abs_dating_analysis:read'])]
    private StratigraphicUnit $stratigraphicUnit;

    #[ORM\ManyToOne(targetEntity: Analysis::class)]
    #[Groups(['abs_dating_analysis:read'])]
    private Analysis $analysis;

    #[ORM\Column(type: 'bigint')]
    #[Groups(['abs_dating_analysis:read'])]
    private int $subjectId;

    #[ORM\Column(type: 'string')]
    #[Groups(['abs_dating_analysis:read'])]
    private string $subjectType;

    #[ORM\Column(type: 'string')]
    #[Groups(['abs_dating_analysis:read'])]
    private string $resourceLabel;

    #[ORM\Column(type: 'smallint')]
    #[Groups(['abs_dating_analysis:read'])]
    protected int $datingLower;

    #[ORM\Column(type: 'smallint')]
    #[Groups(['abs_dating_analysis:read'])]
    protected int $datingUpper;

    #[ORM\Column(type: 'smallint')]
    #[Groups(['abs_dating_analysis:read'])]
    protected int $uncalibratedDating;

    #[ORM\Column(type: 'smallint')]
    #[Groups(['abs_dating_analysis:read'])]
    protected int $error;

    #[ORM\Column(type: 'string')]
    #[Groups(['abs_dating_analysis:read'])]
    protected string $calibrationCurve;

    #[ORM\Column(type: 'decimal', precision: 4, scale: 1, nullable: true)]
    #[Groups(['abs_dating_analysis:read'])]
    protected ?string $probability = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['abs_dating_analysis:read'])]
    protected string $notes;

    public function getId(): int
    {
        return $this->id;
    }

    public function getAnalysis(): Analysis
    {
        return $this->analysis;
    }

    public function setAnalysis(Analysis $analysis): AbsDatingAnalysisView
    {
        $this->analysis = $analysis;

        return $this;
    }

    public function getSubjectId(): int
    {
        return $this->subjectId;
    }

    public function setSubjectId(int $subjectId): AbsDatingAnalysisView
    {
        $this->subjectId = $subjectId;

        return $this;
    }

    public function getSubjectType(): string
    {
        return $this->subjectType;
    }

    public function setSubjectType(string $subjectType): AbsDatingAnalysisView
    {
        $this->subjectType = $subjectType;

        return $this;
    }

    public function getResourceLabel(): string
    {
        return $this->resourceLabel;
    }

    public function setResourceLabel(string $resourceLabel): AbsDatingAnalysisView
    {
        $this->resourceLabel = $resourceLabel;

        return $this;
    }

    public function getStratigraphicUnit(): StratigraphicUnit
    {
        return $this->stratigraphicUnit;
    }

    public function setStratigraphicUnit(StratigraphicUnit $stratigraphicUnit): AbsDatingAnalysisView
    {
        $this->stratigraphicUnit = $stratigraphicUnit;

        return $this;
    }

    public function getDatingLower(): int
    {
        return $this->datingLower;
    }

    public function setDatingLower(int $datingLower): AbsDatingAnalysisView
    {
        $this->datingLower = $datingLower;

        return $this;
    }

    public function getDatingUpper(): int
    {
        return $this->datingUpper;
    }

    public function setDatingUpper(int $datingUpper): AbsDatingAnalysisView
    {
        $this->datingUpper = $datingUpper;

        return $this;
    }

    public function getUncalibratedDating(): int
    {
        return $this->uncalibratedDating;
    }

    public function setUncalibratedDating(int $uncalibratedDating): AbsDatingAnalysisView
    {
        $this->uncalibratedDating = $uncalibratedDating;

        return $this;
    }

    public function getError(): int
    {
        return $this->error;
    }

    public function setError(int $error): AbsDatingAnalysisView
    {
        $this->error = $error;

        return $this;
    }

    public function getCalibrationCurve(): string
    {
        return $this->calibrationCurve;
    }

    public function setCalibrationCurve(string $calibrationCurve): AbsDatingAnalysisView
    {
        $this->calibrationCurve = $calibrationCurve;

        return $this;
    }

    public function getProbability(): ?string
    {
        return $this->probability;
    }

    public function setProbability(?string $probability): AbsDatingAnalysisView
    {
        $this->probability = $probability;

        return $this;
    }

    public function getNotes(): string
    {
        return $this->notes;
    }

    public function setNotes(string $notes): AbsDatingAnalysisView
    {
        $this->notes = $notes;

        return $this;
    }
}

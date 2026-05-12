<?php

namespace App\Entity\Data\Join\Analysis;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\View\AnalysisContextBotanyTaxonomyView;
use App\Entity\Vocabulary\Botany\Taxonomy;
use App\Metadata\Attribute\ApiAnalysisBotanyTaxonomyResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'analysis_context_botany_taxonomies',
)]
#[ApiAnalysisBotanyTaxonomyResource(
    taxonomyResourceName: 'context_botany_taxonomies',
    readGroup: 'context_botany_analysis:acl:read',
    createGroup: 'context_botany_taxonomy:create',
    updateGroup: 'context_botany_taxonomy:update',
    parentResourceName: 'contexts/botany',
    parentClass: AnalysisContextBotany::class,
)]
#[ApiFilter(OrderFilter::class, properties: [
    'id',
    'cf',
    'sp',
    'type',
    'flat.value',
    'taxonomy.flat.species',
    'taxonomy.flat.genus',
    'taxonomy.flat.family',
    'taxonomy.flat.class',
])]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'taxonomy.flat.classId' => 'exact',
        'taxonomy.flat.familyId' => 'exact',
        'taxonomy.flat.genusId' => 'exact',
    ]
)]
#[ApiFilter(
    ExistsFilter::class,
    properties: [
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
#[ORM\UniqueConstraint(columns: ['analysis_id', 'taxonomy_id'])]
class AnalysisContextBotanyTaxonomy
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint', unique: true)]
    #[Groups([
        'context_botany_analysis:acl:read',
        'context_botany_analysis:export',
    ])]
    #[ApiProperty(required: true)]
    private int $id;

    #[ORM\OneToOne(targetEntity: AnalysisContextBotanyTaxonomyView::class, mappedBy: 'analysisContext', fetch: 'LAZY')]
    #[Groups([
        'context_botany_analysis:acl:read',
        'context_botany_analysis:export',
    ])]
    #[ApiProperty(required: true)]
    private AnalysisContextBotanyTaxonomyView $flat;

    #[ORM\ManyToOne(targetEntity: AnalysisContextBotany::class, inversedBy: 'taxonomies')]
    #[ORM\JoinColumn(name: 'analysis_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'context_botany_analysis:acl:read',
        'context_botany_taxonomy:create',
    ])]
    private AnalysisContextBotany $analysis;

    #[ORM\ManyToOne(targetEntity: Taxonomy::class)]
    #[ORM\JoinColumn(name: 'taxonomy_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'context_botany_analysis:acl:read',
        'context_botany_taxonomy:create',
        'context_botany_taxonomy:update',
    ])]
    private Taxonomy $taxonomy;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'context_botany_analysis:acl:read',
        'context_botany_taxonomy:create',
        'context_botany_taxonomy:update',
    ])]
    private bool $cf = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'context_botany_analysis:acl:read',
        'context_botany_taxonomy:create',
        'context_botany_taxonomy:update',
    ])]
    private bool $sp = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'context_botany_analysis:acl:read',
        'context_botany_taxonomy:create',
        'context_botany_taxonomy:update',
    ])]
    private bool $type = false;

    public function getId(): int
    {
        return $this->id;
    }

    public function getAnalysis(): AnalysisContextBotany
    {
        return $this->analysis;
    }

    public function setAnalysis(AnalysisContextBotany $analysis): AnalysisContextBotanyTaxonomy
    {
        $this->analysis = $analysis;

        return $this;
    }

    public function getTaxonomy(): Taxonomy
    {
        return $this->taxonomy;
    }

    public function setTaxonomy(Taxonomy $taxonomy): AnalysisContextBotanyTaxonomy
    {
        $this->taxonomy = $taxonomy;

        return $this;
    }

    public function isCf(): bool
    {
        return $this->cf;
    }

    public function setCf(bool $cf): AnalysisContextBotanyTaxonomy
    {
        $this->cf = $cf;

        return $this;
    }

    public function isSp(): bool
    {
        return $this->sp;
    }

    public function setSp(bool $sp): AnalysisContextBotanyTaxonomy
    {
        $this->sp = $sp;

        return $this;
    }

    public function isType(): bool
    {
        return $this->type;
    }

    public function setType(bool $type): AnalysisContextBotanyTaxonomy
    {
        $this->type = $type;

        return $this;
    }

    public function getFlat(): AnalysisContextBotanyTaxonomyView
    {
        return $this->flat;
    }
}

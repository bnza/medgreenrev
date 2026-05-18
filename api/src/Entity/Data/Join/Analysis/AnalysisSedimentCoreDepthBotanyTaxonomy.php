<?php

namespace App\Entity\Data\Join\Analysis;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\View\AnalysisSedimentCoreDepthBotanyTaxonomyView;
use App\Entity\Vocabulary\Botany\Taxonomy;
use App\Metadata\Attribute\ApiAnalysisBotanyTaxonomyResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'analysis_sediment_core_depth_botany_taxonomies')]
#[ORM\AssociationOverrides([
    new ORM\AssociationOverride(
        name: 'analysis',
        joinColumns: [new ORM\JoinColumn(name: 'analysis_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')],
    ),
])]
#[ApiAnalysisBotanyTaxonomyResource(
    taxonomyResourceName: 'sediment_core_depth_botany_taxonomies',
    readGroup: 'sediment_core_depth_botany_analysis:acl:read',
    createGroup: 'sediment_core_depth_botany_taxonomy:create',
    updateGroup: 'sediment_core_depth_botany_taxonomy:update',
    parentResourceName: 'sediment_core_depths/botany',
    parentClass: AnalysisSedimentCoreDepthBotany::class,
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
class AnalysisSedimentCoreDepthBotanyTaxonomy
{
    #[ORM\Id, ORM\GeneratedValue(strategy: 'SEQUENCE'), ORM\Column(type: 'bigint', unique: true)]
    #[ApiProperty(required: true)]
    #[Groups([
        'sediment_core_depth_botany_analysis:acl:read',
        'sediment_core_depth_botany_analysis:export',
    ])]
    private int $id;

    #[ORM\OneToOne(targetEntity: AnalysisSedimentCoreDepthBotanyTaxonomyView::class, mappedBy: 'analysisSedimentCoreDepth', fetch: 'LAZY')]
    #[Groups([
        'sediment_core_depth_botany_analysis:acl:read',
        'sediment_core_depth_botany_analysis:export',
    ])]
    #[ApiProperty(required: true)]
    private AnalysisSedimentCoreDepthBotanyTaxonomyView $flat;

    #[ORM\ManyToOne(targetEntity: AnalysisSedimentCoreDepthBotany::class, inversedBy: 'taxonomies')]
    #[ORM\JoinColumn(name: 'analysis_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'sediment_core_depth_botany_analysis:acl:read',
        'sediment_core_depth_botany_taxonomy:create',
    ])]
    private AnalysisSedimentCoreDepthBotany $analysis;

    #[ORM\ManyToOne(targetEntity: Taxonomy::class)]
    #[ORM\JoinColumn(name: 'taxonomy_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'sediment_core_depth_botany_analysis:acl:read',
        'sediment_core_depth_botany_taxonomy:create',
        'sediment_core_depth_botany_taxonomy:update',
    ])]
    private Taxonomy $taxonomy;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'sediment_core_depth_botany_analysis:acl:read',
        'sediment_core_depth_botany_taxonomy:create',
        'sediment_core_depth_botany_taxonomy:update',
    ])]
    private bool $cf = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'sediment_core_depth_botany_analysis:acl:read',
        'sediment_core_depth_botany_taxonomy:create',
        'sediment_core_depth_botany_taxonomy:update',
    ])]
    private bool $sp = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'sediment_core_depth_botany_analysis:acl:read',
        'sediment_core_depth_botany_taxonomy:create',
        'sediment_core_depth_botany_taxonomy:update',
    ])]
    private bool $type = false;

    public function getId(): int
    {
        return $this->id;
    }

    public function getAnalysis(): AnalysisSedimentCoreDepthBotany
    {
        return $this->analysis;
    }

    public function setAnalysis(AnalysisSedimentCoreDepthBotany $analysis): AnalysisSedimentCoreDepthBotanyTaxonomy
    {
        $this->analysis = $analysis;

        return $this;
    }

    public function getTaxonomy(): Taxonomy
    {
        return $this->taxonomy;
    }

    public function setTaxonomy(Taxonomy $taxonomy): AnalysisSedimentCoreDepthBotanyTaxonomy
    {
        $this->taxonomy = $taxonomy;

        return $this;
    }

    public function isCf(): bool
    {
        return $this->cf;
    }

    public function setCf(bool $cf): AnalysisSedimentCoreDepthBotanyTaxonomy
    {
        $this->cf = $cf;

        return $this;
    }

    public function isSp(): bool
    {
        return $this->sp;
    }

    public function setSp(bool $sp): AnalysisSedimentCoreDepthBotanyTaxonomy
    {
        $this->sp = $sp;

        return $this;
    }

    public function isType(): bool
    {
        return $this->type;
    }

    public function setType(bool $type): AnalysisSedimentCoreDepthBotanyTaxonomy
    {
        $this->type = $type;

        return $this;
    }

    public function getFlat(): AnalysisSedimentCoreDepthBotanyTaxonomyView
    {
        return $this->flat;
    }
}

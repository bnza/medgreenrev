<?php

namespace App\Entity\Data\Join\Analysis;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\View\AnalysisSampleBotanyTaxonomyView;
use App\Entity\Vocabulary\Botany\Taxonomy;
use App\Metadata\Attribute\ApiAnalysisBotanyTaxonomyResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'analysis_sample_botany_taxonomies',
)]
#[ORM\AssociationOverrides([
    new ORM\AssociationOverride(
        name: 'analysis',
        joinColumns: [new ORM\JoinColumn(name: 'analysis_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')],
    ),
])]
#[ApiAnalysisBotanyTaxonomyResource(
    taxonomyResourceName: 'sample_botany_taxonomies',
    readGroup: 'sample_botany_analysis:acl:read',
    createGroup: 'sample_botany_taxonomy:create',
    updateGroup: 'sample_botany_taxonomy:update',
    parentResourceName: 'samples/botany',
    parentClass: AnalysisSampleBotany::class,
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
class AnalysisSampleBotanyTaxonomy
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint', unique: true)]
    #[Groups([
        'sample_botany_analysis:acl:read',
        'sample_botany_analysis:export',
    ])]
    #[ApiProperty(required: true)]
    private int $id;

    #[ORM\OneToOne(targetEntity: AnalysisSampleBotanyTaxonomyView::class, mappedBy: 'analysisSample', fetch: 'LAZY')]
    #[Groups([
        'sample_botany_analysis:acl:read',
        'sample_botany_analysis:export',
    ])]
    #[ApiProperty(required: true)]
    private AnalysisSampleBotanyTaxonomyView $flat;

    #[ORM\ManyToOne(targetEntity: AnalysisSampleBotany::class, inversedBy: 'taxonomies')]
    #[ORM\JoinColumn(name: 'analysis_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'sample_botany_analysis:acl:read',
        'sample_botany_taxonomy:create',
    ])]
    private AnalysisSampleBotany $analysis;

    #[ORM\ManyToOne(targetEntity: Taxonomy::class)]
    #[ORM\JoinColumn(name: 'taxonomy_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups([
        'sample_botany_analysis:acl:read',
        'sample_botany_taxonomy:create',
        'sample_botany_taxonomy:update',
    ])]
    private Taxonomy $taxonomy;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'sample_botany_analysis:acl:read',
        'sample_botany_taxonomy:create',
        'sample_botany_taxonomy:update',
    ])]
    private bool $cf = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'sample_botany_analysis:acl:read',
        'sample_botany_taxonomy:create',
        'sample_botany_taxonomy:update',
    ])]
    private bool $sp = false;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups([
        'sample_botany_analysis:acl:read',
        'sample_botany_taxonomy:create',
        'sample_botany_taxonomy:update',
    ])]
    private bool $type = false;

    public function getId(): int
    {
        return $this->id;
    }

    public function getAnalysis(): AnalysisSampleBotany
    {
        return $this->analysis;
    }

    public function setAnalysis(AnalysisSampleBotany $analysis): AnalysisSampleBotanyTaxonomy
    {
        $this->analysis = $analysis;

        return $this;
    }

    public function getTaxonomy(): Taxonomy
    {
        return $this->taxonomy;
    }

    public function setTaxonomy(Taxonomy $taxonomy): AnalysisSampleBotanyTaxonomy
    {
        $this->taxonomy = $taxonomy;

        return $this;
    }

    public function isCf(): bool
    {
        return $this->cf;
    }

    public function setCf(bool $cf): AnalysisSampleBotanyTaxonomy
    {
        $this->cf = $cf;

        return $this;
    }

    public function isSp(): bool
    {
        return $this->sp;
    }

    public function setSp(bool $sp): AnalysisSampleBotanyTaxonomy
    {
        $this->sp = $sp;

        return $this;
    }

    public function isType(): bool
    {
        return $this->type;
    }

    public function setType(bool $type): AnalysisSampleBotanyTaxonomy
    {
        $this->type = $type;

        return $this;
    }

    public function getFlat(): AnalysisSampleBotanyTaxonomyView
    {
        return $this->flat;
    }
}

<?php

namespace App\Entity\Data\Join\Analysis;

use App\Entity\Vocabulary\Botany\Taxonomy;
use App\Metadata\Attribute\ApiAnalysisBotanyTaxonomyResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'analysis_sample_botany_taxonomies',
)]
#[ApiAnalysisBotanyTaxonomyResource(
    taxonomyResourceName: 'sample_botany_taxonomies',
    readGroup: 'sample_botany_analysis:acl:read',
    createGroup: 'sample_botany_taxonomy:create',
    updateGroup: 'sample_botany_taxonomy:update',
    parentResourceName: 'samples/botany',
    parentClass: AnalysisSampleBotany::class,
)]
#[ORM\UniqueConstraint(columns: ['analysis_id', 'taxonomy_id'])]
class AnalysisSampleBotanyTaxonomy
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint', unique: true)]
    private int $id;

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
}

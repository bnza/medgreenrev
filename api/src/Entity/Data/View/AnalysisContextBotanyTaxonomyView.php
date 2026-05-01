<?php

namespace App\Entity\Data\View;

use App\Entity\Data\Join\Analysis\AnalysisContextBotanyTaxonomy;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_analysis_context_botany_taxonomy')]
class AnalysisContextBotanyTaxonomyView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: AnalysisContextBotanyTaxonomy::class, inversedBy: 'flat')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    private AnalysisContextBotanyTaxonomy $analysisContext;

    #[ORM\Column(name: 'taxonomy_value', type: 'string', nullable: true)]
    #[Groups([
        'context_botany_analysis:acl:read',
        'context_botany_analysis:export',
    ])]
    private ?string $value = null;

    public function getId(): int
    {
        return $this->id;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }
}

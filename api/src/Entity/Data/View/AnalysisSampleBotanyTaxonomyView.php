<?php

namespace App\Entity\Data\View;

use App\Entity\Data\Join\Analysis\AnalysisSampleBotanyTaxonomy;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_analysis_sample_botany_taxonomy')]
class AnalysisSampleBotanyTaxonomyView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: AnalysisSampleBotanyTaxonomy::class, inversedBy: 'flat')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    private AnalysisSampleBotanyTaxonomy $analysisSample;

    #[ORM\Column(name: 'taxonomy_value', type: 'string', nullable: true)]
    #[Groups([
        'sample_botany_analysis:acl:read',
        'sample_botany_analysis:export',
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

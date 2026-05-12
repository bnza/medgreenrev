<?php

namespace App\Entity\Data\View;

use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\Join\Analysis\AnalysisSedimentCoreDepthBotanyTaxonomy;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_analysis_sediment_core_depth_botany_taxonomy')]
class AnalysisSedimentCoreDepthBotanyTaxonomyView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ApiProperty(required: true)]
    private int $id;

    #[ORM\OneToOne(targetEntity: AnalysisSedimentCoreDepthBotanyTaxonomy::class, inversedBy: 'flat')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    private AnalysisSedimentCoreDepthBotanyTaxonomy $analysisSedimentCoreDepth;

    #[ORM\Column(name: 'taxonomy_value', type: 'string', nullable: true)]
    #[Groups([
        'sediment_core_depth_botany_analysis:acl:read',
        'sediment_core_depth_botany_analysis:export',
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

<?php

namespace App\Entity\Data\View;

use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\Botany\Charcoal;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_botany_charcoal')]
class BotanyCharcoalView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ApiProperty(required: true)]
    private int $id;

    #[ORM\OneToOne(targetEntity: Charcoal::class, inversedBy: 'flat')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    private Charcoal $charcoal;

    #[ORM\Column(name: 'taxonomy_value', type: 'string', nullable: true)]
    #[Groups([
        'botany_charcoal:acl:read',
        'botany_charcoal:export',
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

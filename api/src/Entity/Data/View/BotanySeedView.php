<?php

namespace App\Entity\Data\View;

use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\Botany\Seed;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_botany_seed')]
class BotanySeedView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ApiProperty(required: true)]
    private int $id;
    #[ORM\OneToOne(targetEntity: Seed::class, inversedBy: 'flat')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    private Seed $seed;

    #[ORM\Column(name: 'taxonomy_value', type: 'string', nullable: true)]
    #[Groups([
        'botany_seed:acl:read',
        'botany_seed:export',
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

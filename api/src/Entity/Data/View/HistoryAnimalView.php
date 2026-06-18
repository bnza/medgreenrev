<?php

namespace App\Entity\Data\View;

use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\History\Animal;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_history_animal')]
class HistoryAnimalView
{
    #[ORM\Id]
    #[ORM\Column(type: 'bigint')]
    #[ApiProperty(required: true)]
    private int $id;

    #[ORM\OneToOne(targetEntity: Animal::class, inversedBy: 'flat')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    private Animal $animal;

    #[ORM\Column(name: 'taxonomy_id', type: 'smallint', nullable: true)]
    #[Groups([
        'history_animal:acl:read',
        'history_animal:export',
    ])]
    private ?int $taxonomyId = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'history_animal:acl:read',
        'history_animal:export',
    ])]
    private ?string $value = null;

    #[ORM\Column(name: 'english_name', type: 'string', nullable: true)]
    #[Groups([
        'history_animal:acl:read',
        'history_animal:export',
    ])]
    private ?string $englishName = null;

    #[ORM\Column(name: 'spanish_name', type: 'string', nullable: true)]
    #[Groups([
        'history_animal:acl:read',
        'history_animal:export',
    ])]
    private ?string $spanishName = null;

    #[ORM\Column(name: 'class', type: 'string', nullable: true)]
    #[Groups([
        'history_animal:acl:read',
        'history_animal:export',
    ])]
    private ?string $class = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'history_animal:acl:read',
        'history_animal:export',
    ])]
    private ?string $family = null;

    public function getId(): int
    {
        return $this->id;
    }

    public function getTaxonomyId(): ?int
    {
        return $this->taxonomyId;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function getEnglishName(): ?string
    {
        return $this->englishName;
    }

    public function getSpanishName(): ?string
    {
        return $this->spanishName;
    }

    public function getClass(): ?string
    {
        return $this->class;
    }

    public function getFamily(): ?string
    {
        return $this->family;
    }
}

<?php

namespace App\Entity\Data\View;

use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\History\Plant;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_history_plant')]
class HistoryPlantView
{
    #[ORM\Id]
    #[ORM\Column(type: 'bigint')]
    #[ApiProperty(required: true)]
    private int $id;

    #[ORM\OneToOne(targetEntity: Plant::class, inversedBy: 'flat')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    private Plant $plant;

    #[ORM\Column(name: 'taxonomy_id', type: 'integer', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?int $taxonomyId = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?string $value = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?string $level = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?int $rank = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?string $species = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?string $genus = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?string $family = null;

    #[ORM\Column(name: 'class', type: 'string', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?string $class = null;

    #[ORM\Column(name: 'spanish_name', type: 'string', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?string $spanishName = null;

    #[ORM\Column(name: 'english_name', type: 'string', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?string $englishName = null;

    #[ORM\Column(name: 'genus_id', type: 'integer', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?int $genusId = null;

    #[ORM\Column(name: 'family_id', type: 'integer', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?int $familyId = null;

    #[ORM\Column(name: 'class_id', type: 'integer', nullable: true)]
    #[Groups([
        'history_plant:acl:read',
        'history_plant:export',
    ])]
    private ?int $classId = null;

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

    public function getLevel(): ?string
    {
        return $this->level;
    }

    public function getRank(): ?int
    {
        return $this->rank;
    }

    public function getSpecies(): ?string
    {
        return $this->species;
    }

    public function getGenus(): ?string
    {
        return $this->genus;
    }

    public function getFamily(): ?string
    {
        return $this->family;
    }

    public function getClass(): ?string
    {
        return $this->class;
    }

    public function getSpanishName(): ?string
    {
        return $this->spanishName;
    }

    public function getEnglishName(): ?string
    {
        return $this->englishName;
    }

    public function getGenusId(): ?int
    {
        return $this->genusId;
    }

    public function getFamilyId(): ?int
    {
        return $this->familyId;
    }

    public function getClassId(): ?int
    {
        return $this->classId;
    }
}

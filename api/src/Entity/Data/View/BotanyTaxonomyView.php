<?php

namespace App\Entity\Data\View;

use App\Entity\Vocabulary\Botany\Taxonomy;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(
    name: 'vw_botany_taxonomy',
    schema: 'vocabulary'
)]
class BotanyTaxonomyView
{
    #[ORM\Id]
    #[ORM\Column(type: 'smallint')]
    private int $id;

    #[ORM\OneToOne(targetEntity: Taxonomy::class, inversedBy: 'flat')]
    #[ORM\JoinColumn(name: 'id', referencedColumnName: 'id')]
    private Taxonomy $taxonomy;

    #[ORM\Column(type: 'string')]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private string $value;

    #[ORM\Column(type: 'string')]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private string $level;

    #[ORM\Column(type: 'smallint')]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private int $rank;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?string $species = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?string $genus = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?string $family = null;

    #[ORM\Column(name: 'class', type: 'string', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?string $class = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?string $spanishName = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?string $englishName = null;

    #[ORM\Column(type: 'smallint', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?int $genusId = null;

    #[ORM\Column(type: 'smallint', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?int $familyId = null;

    #[ORM\Column(type: 'smallint', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?int $classId = null;

    public function getId(): int
    {
        return $this->id;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function getLevel(): string
    {
        return $this->level;
    }

    public function getRank(): int
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

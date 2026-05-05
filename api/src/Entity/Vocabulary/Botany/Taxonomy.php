<?php

namespace App\Entity\Vocabulary\Botany;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Doctrine\Filter\SearchPropertyAliasFilter;
use App\Entity\Data\View\BotanyTaxonomyView;
use App\Repository\BotanyTaxonomyRepository;
use App\Validator as AppAssert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: BotanyTaxonomyRepository::class)]
#[ORM\Table(
    name: 'botany_taxonomy',
    schema: 'vocabulary'
)]
#[ORM\UniqueConstraint(columns: ['value', 'parent_id'], options: ['nulls_distinct' => false])]
#[ApiResource(
    shortName: 'VocBotanyTaxonomy',
    operations: [
        new GetCollection(
            uriTemplate: '/vocabulary/botany/taxonomies',
            order: ['value' => 'ASC'],
        ),
        new GetCollection(
            uriTemplate: '/data/vocabulary/botany/taxonomies',
            paginationEnabled: true,
            order: ['id' => 'DESC'],
            normalizationContext: ['groups' => ['voc_botany_taxonomy:acl:read']]
        ),
        new Get(
            uriTemplate: '/vocabulary/botany/taxonomies/{id}',
        ),
        new Post(
            uriTemplate: '/vocabulary/botany/taxonomies',
            denormalizationContext: ['groups' => ['voc_botany_taxonomy:create']],
            securityPostDenormalize: 'is_granted("create", object)',
            validationContext: ['groups' => ['validation:voc_botany_taxonomy:create']],
        ),
        new Patch(
            uriTemplate: '/vocabulary/botany/taxonomies/{id}',
            denormalizationContext: ['groups' => ['voc_botany_taxonomy:update']],
            security: 'is_granted("update", object)',
        ),
        new Delete(
            uriTemplate: '/vocabulary/botany/taxonomies/{id}',
            security: 'is_granted("delete", object)',
            validationContext: ['groups' => ['validation:voc_botany_taxonomy:delete']],
            validate: true
        ),
    ],
    normalizationContext: ['groups' => ['voc_botany_taxonomy:read']],
    paginationEnabled: false,
)]
#[ApiFilter(OrderFilter::class, properties: [
    'id',
    'value',
    'level',
    'englishName',
    'spanishName',
    'flat.rank',
    'flat.family',
    'flat.class',
    'flat.genus',
    'flat.species']
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'level' => 'exact',
        'parent' => 'exact',
    ]
)]
#[ApiFilter(
    RangeFilter::class,
    properties: [
        'flat.rank',
    ]
)]
#[ApiFilter(
    SearchPropertyAliasFilter::class,
    properties: [
        'search' => 'flat.value',
    ]
)]
#[UniqueEntity(
    fields: ['value', 'parent'],
    message: 'Duplicate taxonomy value: {{ value }}.',
    groups: ['validation:voc_botany_taxonomy:create']
)]
#[AppAssert\NotReferenced(self::class, message: 'Cannot delete the taxonomy because it is referenced by: {{ classes }}.', groups: ['validation:voc_botany_taxonomy:delete'])]
class Taxonomy
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'smallint')]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
    ])]
    private int $id;

    #[ORM\Column(type: 'string')]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_botany_taxonomy:create',
        'voc_history_plant:acl:read',
        'history_plant:export',
        'botany_charcoal:export',
        'botany_seed:export',
    ])]
    #[Assert\NotBlank(groups: [
        'validation:voc_botany_taxonomy:create',
    ])]
    private string $value;

    #[ORM\ManyToOne(targetEntity: Taxonomy::class, inversedBy: 'children')]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', nullable: true, onDelete: 'CASCADE')]
    #[Groups([
        'voc_botany_taxonomy:create',
    ])]
    private ?Taxonomy $parent = null;

    /** @var Collection<Taxonomy> */
    #[ORM\OneToMany(targetEntity: Taxonomy::class, mappedBy: 'parent')]
    private Collection $children;

    #[ORM\Column(type: 'string')]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_botany_taxonomy:create',
    ])]
    #[Assert\NotBlank(groups: [
        'validation:voc_botany_taxonomy:create',
    ])]
    #[Assert\Choice(
        choices: ['class', 'family', 'genus', 'species'],
        groups: ['validation:voc_botany_taxonomy:create'],
    )]
    private string $level;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_botany_taxonomy:create',
        'voc_botany_taxonomy:update',
    ])]
    private ?string $spanishName = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_botany_taxonomy:create',
        'voc_botany_taxonomy:update',
    ])]
    private ?string $englishName = null;

    #[ORM\OneToOne(targetEntity: BotanyTaxonomyView::class, mappedBy: 'taxonomy', fetch: 'LAZY')]
    #[Groups([
        'voc_botany_taxonomy:read',
        'voc_botany_taxonomy:acl:read',
        'voc_history_plant:read',
        'voc_history_plant:acl:read',
        'botany_seed:export',
        'botany_charcoal:export',
        'history_plant:export',
    ])]
    private ?BotanyTaxonomyView $flat = null;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function setValue(string $value): Taxonomy
    {
        $this->value = $value;

        return $this;
    }

    public function getParent(): ?Taxonomy
    {
        return $this->parent;
    }

    public function setParent(?Taxonomy $parent): Taxonomy
    {
        $this->parent = $parent;

        return $this;
    }

    /** @return Collection<Taxonomy> */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    public function getLevel(): string
    {
        return $this->level;
    }

    public function setLevel(string $level): Taxonomy
    {
        $this->level = $level;

        return $this;
    }

    public function getSpanishName(): ?string
    {
        return $this->spanishName;
    }

    public function setSpanishName(?string $spanishName): Taxonomy
    {
        $this->spanishName = $spanishName;

        return $this;
    }

    public function getEnglishName(): ?string
    {
        return $this->englishName;
    }

    public function setEnglishName(?string $englishName): Taxonomy
    {
        $this->englishName = $englishName;

        return $this;
    }

    public function getFlat(): ?BotanyTaxonomyView
    {
        return $this->flat;
    }
}

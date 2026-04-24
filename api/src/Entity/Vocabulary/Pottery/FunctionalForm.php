<?php

namespace App\Entity\Vocabulary\Pottery;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Doctrine\Filter\SearchPropertyAliasFilter;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'pottery_functional_forms',
    schema: 'vocabulary',
)]
#[ApiResource(
    shortName: 'VocPotteryFunctionalForm',
    operations: [
        new GetCollection(
            uriTemplate: '/pottery/functional_forms',
            order: ['value' => 'ASC'],
        ),
        new Get(
            uriTemplate: '/pottery/functional_forms/{id}',
        ),
    ],
    routePrefix: 'vocabulary',
    normalizationContext: ['groups' => ['vocabulary:pottery:functional_form:read']],
    paginationEnabled: false,
)]
#[ApiFilter(
    SearchPropertyAliasFilter::class,
    properties: [
        'search' => 'value',
    ]
)]
class FunctionalForm
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'smallint')]
    public int $id;

    #[ORM\Column(type: 'string', unique: true)]
    #[Groups([
        'pottery:acl:read',
        'pottery:export',
        'vocabulary:pottery:functional_form:read',
    ])]
    #[ApiProperty(required: true)]
    public string $value;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        'pottery:export',
        'vocabulary:pottery:functional_form:read',
    ])]
    public ?string $variant = null;

    #[ORM\ManyToOne(targetEntity: FunctionalGroup::class, inversedBy: 'functionalForms')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([
        'pottery:acl:read',
        'pottery:export',
        'vocabulary:pottery:functional_form:read',
    ])]
    public FunctionalGroup $functionalGroup;
}

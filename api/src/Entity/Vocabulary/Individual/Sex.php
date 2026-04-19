<?php

namespace App\Entity\Vocabulary\Individual;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'individual_sexes',
    schema: 'vocabulary'
)]
#[ORM\UniqueConstraint(columns: ['value'])]
#[ApiResource(
    shortName: 'VocIndividualSex',
    operations: [
        new GetCollection(
            uriTemplate: '/individual/sex',
            order: ['id' => 'ASC'],
        ),
        new Get(
            uriTemplate: '/individual/sex/{id}',
        ),
    ],
    routePrefix: 'vocabulary',
    paginationEnabled: false
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'value' => 'ipartial',
    ]
)]
class Sex
{
    #[ORM\Id,
        ORM\Column(type: 'smallint')]
    public int $id;

    #[ORM\Column(type: 'string')]
    #[ApiProperty(required: true)]
    public string $value;

    #[ORM\Column(type: 'string')]
    #[ApiProperty(required: true)]
    #[Groups([
        'individual:export',
    ])]
    public string $code;
}

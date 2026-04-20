<?php

namespace App\Entity\Vocabulary\Zoo;

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
    name: 'zoo_bone_sides',
    schema: 'vocabulary'
)]
#[ORM\UniqueConstraint(columns: ['value'])]
#[ApiResource(
    shortName: 'VocZooBoneSide',
    operations: [
        new GetCollection(
            uriTemplate: '/zoo/bone-side',
            order: ['id' => 'ASC'],
        ),
        new Get(
            uriTemplate: '/zoo/bone-side/{id}',
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
class BoneSide
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
        'zoo:export',
    ])]
    public string $code;
}

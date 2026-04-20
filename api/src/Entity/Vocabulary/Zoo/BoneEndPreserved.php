<?php

namespace App\Entity\Vocabulary\Zoo;

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
    name: 'zoo_bone_end_preserved',
    schema: 'vocabulary'
)]
#[ORM\UniqueConstraint(columns: ['code'])]
#[ORM\UniqueConstraint(columns: ['value'])]
#[ApiResource(
    shortName: 'VocZooBoneEndPreserved',
    operations: [
        new GetCollection(
            uriTemplate: '/zoo/bone_end_preserved',
            order: ['value' => 'ASC'],
        ),
        new Get(
            uriTemplate: '/zoo/bone_end_preserved/{id}',
        ),
    ],
    routePrefix: 'vocabulary',
    paginationEnabled: false
)]
#[ApiFilter(
    SearchPropertyAliasFilter::class,
    properties: [
        'search' => 'value',
    ]
)]
class BoneEndPreserved
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'smallint')]
    public int $id;

    #[ORM\Column(type: 'string')]
    #[Groups([
        'zoo_bone:export',
    ])]
    public string $code;

    #[ORM\Column(type: 'string')]
    #[ApiProperty(required: true)]
    #[Groups([
        'zoo_bone:export',
    ])]
    public string $value;
}

<?php

namespace App\Entity\Data\View\List;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(
    name: 'vw_history_animals',
)]
#[ApiResource(
    shortName: 'ListHistoryAnimal',
    operations: [
        new Get(
            uriTemplate: '/history/animals/{id}',
        ),
        new GetCollection(
            uriTemplate: '/history/animals',
        ),
    ],
    routePrefix: 'list',
    order: ['value' => 'ASC'],
)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'value' => 'ipartial',
    ]
)]
class HistoryAnimalView
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'IDENTITY'),
        ORM\Column(type: 'string', unique: true)]
    #[ApiProperty(required: true)]
    public readonly string $id;

    #[ORM\Column(type: 'string')]
    public readonly string $value;

    #[ORM\Column(name: 'taxonomy_id', type: 'integer', nullable: true)]
    public readonly ?int $taxonomyId;

    #[ORM\Column(type: 'string', nullable: true)]
    public readonly ?string $taxonomy;
}

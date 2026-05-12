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
    name: 'vw_history_plants',
)]
#[ApiResource(
    shortName: 'ListHistoryPlant',
    operations: [
        new Get(
            uriTemplate: '/history/plants/{id}',
        ),
        new GetCollection(
            uriTemplate: '/history/plants',
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
class HistoryPlantView
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'IDENTITY'),
        ORM\Column(type: 'string', unique: true)]
    #[ApiProperty(required: true)]
    public readonly string $id;

    #[ORM\Column(type: 'string')]
    public readonly string $value;
}

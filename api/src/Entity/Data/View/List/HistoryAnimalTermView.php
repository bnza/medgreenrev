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
    name: 'vw_history_animal_terms',
)]
#[ApiResource(
    shortName: 'ListHistoryAnimalTerm',
    operations: [
        new Get(
            uriTemplate: '/history/animal-terms/{id}',
        ),
        new GetCollection(
            uriTemplate: '/history/animal-terms',
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
class HistoryAnimalTermView
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'IDENTITY'),
        ORM\Column(type: 'string', unique: true)]
    #[ApiProperty(required: true)]
    public readonly string $id;

    #[ORM\Column(type: 'string')]
    public readonly string $value;
}

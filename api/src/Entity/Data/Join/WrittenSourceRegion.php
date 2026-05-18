<?php

namespace App\Entity\Data\Join;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\Data\History\WrittenSource;
use App\Entity\Vocabulary\Region;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'history_written_source_regions',
)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
    ],
    routePrefix: 'data',
    order: ['id' => 'DESC'],
)]
#[ORM\UniqueConstraint(columns: ['written_source_id', 'region_id'])]
class WrittenSourceRegion
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint', unique: true)]
    #[ApiProperty(required: true)]
    private int $id;

    #[ORM\ManyToOne(targetEntity: WrittenSource::class, inversedBy: 'regions')]
    #[ORM\JoinColumn(name: 'written_source_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private WrittenSource $writtenSource;

    #[ORM\ManyToOne(targetEntity: Region::class)]
    #[ORM\JoinColumn(name: 'region_id', referencedColumnName: 'id', nullable: false, onDelete: 'RESTRICT')]
    #[Groups([
        'history_written_source:acl:read',
        'history_written_source:export',
    ])]
    private Region $region;

    public function getId(): int
    {
        return $this->id;
    }

    public function getWrittenSource(): WrittenSource
    {
        return $this->writtenSource;
    }

    public function setWrittenSource(WrittenSource $writtenSource): WrittenSourceRegion
    {
        $this->writtenSource = $writtenSource;

        return $this;
    }

    public function getRegion(): Region
    {
        return $this->region;
    }

    public function setRegion(Region $region): WrittenSourceRegion
    {
        $this->region = $region;

        return $this;
    }
}

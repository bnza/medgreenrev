<?php

namespace App\Entity\Data\Join\MediaObject;

use App\Entity\Data\SedimentCore;
use App\Metadata\Attribute\ApiMediaObjectJoinResource;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\SequenceGenerator;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'media_object_sediment_cores',
)]
#[ApiMediaObjectJoinResource(
    itemClass: SedimentCore::class,
    templateParentResourceName: 'sediment_cores',
    itemNormalizationGroups: ['sediment_core:acl:read']
)]
class MediaObjectSedimentCore extends BaseMediaObjectJoin
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'bigint', unique: true)]
    #[SequenceGenerator(sequenceName: 'media_object_join_id_seq')]
    protected int $id;

    #[ORM\ManyToOne(targetEntity: SedimentCore::class, inversedBy: 'mediaObjects')]
    #[ORM\JoinColumn(name: 'item_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups(['media_object_join:acl:read', 'media_object_join:create'])]
    private SedimentCore $item;

    public function getItem(): SedimentCore
    {
        return $this->item;
    }

    public function setItem(SedimentCore $item): BaseMediaObjectJoin
    {
        $this->item = $item;

        return $this;
    }
}

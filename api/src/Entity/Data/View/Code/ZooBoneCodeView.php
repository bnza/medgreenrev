<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\Zoo\Bone;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_zoo_bone_code')]
class ZooBoneCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: Bone::class)]
    #[ORM\JoinColumn(name: 'zoo_bone_id', referencedColumnName: 'id')]
    private Bone $bone;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getBone(): Bone
    {
        return $this->bone;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\Join\SedimentCoreDepth;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_sediment_core_depth_code')]
class SedimentCoreDepthCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: SedimentCoreDepth::class, inversedBy: "codeView")]
    #[ORM\JoinColumn(name: 'sediment_core_depth_id', referencedColumnName: 'id')]
    private SedimentCoreDepth $sedimentCoreDepth;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getSedimentCoreDepth(): SedimentCoreDepth
    {
        return $this->sedimentCoreDepth;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

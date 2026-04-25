<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\SedimentCore;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_sediment_core_code')]
class SedimentCoreCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: SedimentCore::class)]
    #[ORM\JoinColumn(name: 'sediment_core_id', referencedColumnName: 'id')]
    private SedimentCore $sedimentCore;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getSedimentCore(): SedimentCore
    {
        return $this->sedimentCore;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

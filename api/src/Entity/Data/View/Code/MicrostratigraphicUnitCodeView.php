<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\MicrostratigraphicUnit;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_mu_code')]
class MicrostratigraphicUnitCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: MicrostratigraphicUnit::class, inversedBy: "codeView")]
    #[ORM\JoinColumn(name: 'mu_id', referencedColumnName: 'id')]
    private MicrostratigraphicUnit $microstratigraphicUnit;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getMicrostratigraphicUnit(): MicrostratigraphicUnit
    {
        return $this->microstratigraphicUnit;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

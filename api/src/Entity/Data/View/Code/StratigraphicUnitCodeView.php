<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\StratigraphicUnit;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_su_code')]
class StratigraphicUnitCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: StratigraphicUnit::class)]
    #[ORM\JoinColumn(name: 'su_id', referencedColumnName: 'id')]
    private StratigraphicUnit $stratigraphicUnit;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getStratigraphicUnit(): StratigraphicUnit
    {
        return $this->stratigraphicUnit;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

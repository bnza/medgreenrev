<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\Pottery;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_pottery_code')]
class PotteryCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: Pottery::class)]
    #[ORM\JoinColumn(name: 'pottery_id', referencedColumnName: 'id')]
    private Pottery $pottery;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getPottery(): Pottery
    {
        return $this->pottery;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

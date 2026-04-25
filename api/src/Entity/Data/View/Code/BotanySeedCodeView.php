<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\Botany\Seed;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_botany_seed_code')]
class BotanySeedCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: Seed::class)]
    #[ORM\JoinColumn(name: 'botany_seed_id', referencedColumnName: 'id')]
    private Seed $seed;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getSeed(): Seed
    {
        return $this->seed;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

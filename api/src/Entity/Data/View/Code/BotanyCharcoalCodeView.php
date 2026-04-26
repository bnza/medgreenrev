<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\Botany\Charcoal;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_botany_charcoal_code')]
class BotanyCharcoalCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: Charcoal::class, inversedBy: "codeView")]
    #[ORM\JoinColumn(name: 'botany_charcoal_id', referencedColumnName: 'id')]
    private Charcoal $charcoal;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getCharcoal(): Charcoal
    {
        return $this->charcoal;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

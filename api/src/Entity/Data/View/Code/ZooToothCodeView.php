<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\Zoo\Tooth;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_zoo_tooth_code')]
class ZooToothCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: Tooth::class, inversedBy: "codeView")]
    #[ORM\JoinColumn(name: 'zoo_tooth_id', referencedColumnName: 'id')]
    private Tooth $tooth;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getTooth(): Tooth
    {
        return $this->tooth;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use ApiPlatform\Metadata\ApiProperty;
use App\Entity\Data\Context;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_context_code')]
class ContextCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ApiProperty(required: true)]
    private int $id;

    #[ORM\OneToOne(targetEntity: Context::class, inversedBy: 'codeView')]
    #[ORM\JoinColumn(name: 'context_id', referencedColumnName: 'id')]
    private Context $context;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getContext(): Context
    {
        return $this->context;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

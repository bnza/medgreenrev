<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\Sample;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_sample_code')]
class SampleCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: Sample::class)]
    #[ORM\JoinColumn(name: 'sample_id', referencedColumnName: 'id')]
    private Sample $sample;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getSample(): Sample
    {
        return $this->sample;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

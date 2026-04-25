<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\SamplingStratigraphicUnit;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_sampling_su_code')]
class SamplingStratigraphicUnitCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: SamplingStratigraphicUnit::class)]
    #[ORM\JoinColumn(name: 'sampling_su_id', referencedColumnName: 'id')]
    private SamplingStratigraphicUnit $samplingStratigraphicUnit;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getSamplingStratigraphicUnit(): SamplingStratigraphicUnit
    {
        return $this->samplingStratigraphicUnit;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

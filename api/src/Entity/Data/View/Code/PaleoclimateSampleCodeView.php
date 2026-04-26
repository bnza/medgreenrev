<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\PaleoclimateSample;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_paleoclimate_sample_code')]
class PaleoclimateSampleCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: PaleoclimateSample::class, inversedBy: "codeView")]
    #[ORM\JoinColumn(name: 'paleoclimate_sample_id', referencedColumnName: 'id')]
    private PaleoclimateSample $paleoclimateSample;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getPaleoclimateSample(): PaleoclimateSample
    {
        return $this->paleoclimateSample;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

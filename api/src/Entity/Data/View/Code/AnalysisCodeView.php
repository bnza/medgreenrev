<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\Analysis;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_analysis_code')]
class AnalysisCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: Analysis::class, inversedBy: "codeView")]
    #[ORM\JoinColumn(name: 'analysis_id', referencedColumnName: 'id')]
    private Analysis $analysis;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getAnalysis(): Analysis
    {
        return $this->analysis;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

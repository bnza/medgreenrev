<?php

declare(strict_types=1);

namespace App\Entity\Data\View\Code;

use App\Entity\Data\Individual;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(readOnly: true)]
#[ORM\Table(name: 'vw_individual_code')]
class IndividualCodeView
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToOne(targetEntity: Individual::class)]
    #[ORM\JoinColumn(name: 'individual_id', referencedColumnName: 'id')]
    private Individual $individual;

    #[ORM\Column(type: 'string')]
    private string $code;

    public function getId(): int
    {
        return $this->id;
    }

    public function getIndividual(): Individual
    {
        return $this->individual;
    }

    public function getCode(): string
    {
        return $this->code;
    }
}

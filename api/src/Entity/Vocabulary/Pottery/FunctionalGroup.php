<?php

namespace App\Entity\Vocabulary\Pottery;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\Table(
    name: 'pottery_functional_groups',
    schema: 'vocabulary',
)]
#[ApiResource(
    shortName: 'VocPotteryFunctionalGroup',
    operations: [
        new GetCollection(
            uriTemplate: '/pottery/functional_groups',
            order: ['value' => 'ASC'],
        ),
        new Get(
            uriTemplate: '/pottery/functional_groups/{id}',
        ),
    ],
    routePrefix: 'vocabulary',
    paginationEnabled: false
)]
class FunctionalGroup
{
    #[ORM\Id,
        ORM\GeneratedValue(strategy: 'SEQUENCE'),
        ORM\Column(type: 'smallint')]
    public int $id;

    #[ORM\Column(type: 'string', unique: true)]
    #[Groups([
        'pottery:acl:read',
        'pottery:export',
        'vocabulary:pottery:functional_form:read',
    ])]
    #[ApiProperty(required: true)]
    public string $value;

    /** @var Collection<FunctionalForm> */
    #[ORM\OneToMany(targetEntity: FunctionalForm::class, mappedBy: 'functionalGroup')]
    private Collection $functionalForms;

    public function __construct()
    {
        $this->functionalForms = new ArrayCollection();
    }

    public function getFunctionalForms(): Collection
    {
        return $this->functionalForms;
    }

    public function setFunctionalForms(Collection $functionalForms): FunctionalGroup
    {
        $this->functionalForms = $functionalForms;

        return $this;
    }
}

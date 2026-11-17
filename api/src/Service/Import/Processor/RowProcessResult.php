<?php

namespace App\Service\Import\Processor;

final readonly class RowProcessResult
{
    /**
     * @param object|null $entity Validated entity ready for persistence
     * @param list<string> $errors List of validation error messages
     */
    public function __construct(
        public ?object $entity = null,
        public array $errors = [],
    ) {
    }

    public function isValid(): bool
    {
        return empty($this->errors) && null !== $this->entity;
    }
}

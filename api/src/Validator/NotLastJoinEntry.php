<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_CLASS)]
class NotLastJoinEntry extends Constraint
{
    public string $message = 'Cannot delete the last join entry.';

    public function __construct(
        public string $joinCollection,
        public string $parentProperty,
        ?string $message = null,
        ?array $groups = null,
        mixed $payload = null,
    ) {
        parent::__construct([], $groups, $payload);

        if (null !== $message) {
            $this->message = $message;
        }
    }

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}

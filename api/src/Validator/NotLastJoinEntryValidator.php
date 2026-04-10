<?php

namespace App\Validator;

use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class NotLastJoinEntryValidator extends ConstraintValidator
{
    public function __construct(
        private readonly PropertyAccessorInterface $propertyAccessor,
    ) {
    }

    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof NotLastJoinEntry) {
            throw new UnexpectedTypeException($constraint, NotLastJoinEntry::class);
        }

        $parent = $this->propertyAccessor->getValue($value, $constraint->parentProperty);

        if (null === $parent) {
            return;
        }

        $collection = $this->propertyAccessor->getValue($parent, $constraint->joinCollection);

        if ($collection->count() <= 1) {
            $this->context->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}

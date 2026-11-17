<?php

namespace App\Dto\Input;

use App\Entity\Auth\User;

final readonly class GenericImportInputDto implements ImportInputDtoInterface
{
    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        public string $filePath,
        public string $type,
        public User $user,
        public array $context = [],
    ) {
    }

    public function getFilePath(): string
    {
        return $this->filePath;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getContext(): array
    {
        return $this->context;
    }
}

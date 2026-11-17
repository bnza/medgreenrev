<?php

namespace App\Dto\Input;

use App\Entity\Auth\User;

interface ImportInputDtoInterface
{
    public function getFilePath(): string;

    public function getType(): string;

    public function getUser(): User;

    /**
     * @return array<string, mixed>
     */
    public function getContext(): array;
}

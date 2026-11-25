<?php

namespace App\Service\History\Import;

use App\Dto\Input\ImportInputDtoInterface;
use App\Entity\Data\History\Animal;
use App\Entity\Data\History\Plant;
use App\Entity\Vocabulary\History\Language;
use App\Entity\Vocabulary\History\Location;
use App\Service\Import\Processor\EntityImportProcessorInterface;
use App\Service\Import\Processor\RowProcessResult;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class HistoryEntityImportProcessor implements EntityImportProcessorInterface
{
    public const TYPE_ANIMAL = 'animal';
    public const TYPE_PLANT = 'plant';

    /** @var array<string, Location|null> */
    private array $locationCache = [];

    /** @var array<string, Language|null> */
    private array $languageCache = [];

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator,
    ) {
    }

    public function supports(string $type): bool
    {
        return in_array(strtolower($type), [self::TYPE_ANIMAL, self::TYPE_PLANT], true);
    }

    public function getEntityLabel(string $type): string
    {
        return strtolower($type) === self::TYPE_PLANT ? 'Plant' : 'Animal';
    }

    public function getRequiredHeaders(string $type): array
    {
        $entityField = strtolower($type) === self::TYPE_PLANT ? self::TYPE_PLANT : self::TYPE_ANIMAL;

        return ['location', 'language', $entityField, 'english_name', 'chronology_lower', 'chronology_upper', 'reference'];
    }

    public function processRow(int $rowNumber, array $rowData, ImportInputDtoInterface $input): RowProcessResult
    {
        $type = strtolower($input->getType());
        $errors = [];

        // 1. Resolve Location
        $rawLocation = isset($rowData['location']) ? trim((string) $rowData['location']) : '';
        $location = null;
        if ('' === $rawLocation) {
            $errors[] = 'location: This value should not be blank.';
        } else {
            $location = $this->resolveLocation($rawLocation);
            if (null === $location) {
                $errors[] = sprintf('location: Location "%s" does not exist in vocabulary.', $rawLocation);
            }
        }

        // 2. Resolve Language
        $rawLanguage = isset($rowData['language']) ? trim((string) $rowData['language']) : '';
        $language = null;
        if ('' === $rawLanguage) {
            $errors[] = 'language: This value should not be blank.';
        } else {
            $language = $this->resolveLanguage($rawLanguage);
            if (null === $language) {
                $errors[] = sprintf('language: Language "%s" does not exist in vocabulary.', $rawLanguage);
            }
        }

        // 3. Chronology parsing
        $rawLower = isset($rowData['chronology_lower']) ? trim((string) $rowData['chronology_lower']) : '';
        $rawUpper = isset($rowData['chronology_upper']) ? trim((string) $rowData['chronology_upper']) : '';
        $chronologyLower = null;
        $chronologyUpper = null;

        if ('' === $rawLower || !is_numeric($rawLower)) {
            $errors[] = 'chronology_lower: This value should not be blank and must be an integer.';
        } else {
            $chronologyLower = (int) $rawLower;
        }

        if ('' === $rawUpper || !is_numeric($rawUpper)) {
            $errors[] = 'chronology_upper: This value should not be blank and must be an integer.';
        } else {
            $chronologyUpper = (int) $rawUpper;
        }

        // 4. Entity-specific target field
        $entityField = $type === self::TYPE_PLANT ? 'plant' : 'animal';
        $entityValue = isset($rowData[$entityField]) ? trim((string) $rowData[$entityField]) : '';
        if ('' === $entityValue) {
            $errors[] = sprintf('%s: This value should not be blank.', $entityField);
        }

        // 5. Taxonomy reference field (english_name)
        $rawEnglishName = isset($rowData['english_name']) ? trim((string) $rowData['english_name']) : '';
        if ('' === $rawEnglishName) {
            $errors[] = 'english_name: This value should not be blank.';
        }

        // 6. Reference
        $reference = isset($rowData['reference']) ? trim((string) $rowData['reference']) : '';
        if ('' === $reference) {
            $errors[] = 'reference: This value should not be blank.';
        }

        // 7. Notes
        $notes = isset($rowData['notes']) && '' !== trim((string) $rowData['notes']) ? trim((string) $rowData['notes']) : null;

        // Instantiate entity
        $entity = $type === self::TYPE_PLANT ? new Plant() : new Animal();

        if (null !== $location) {
            $entity->setLocation($location);
        }
        if (null !== $language) {
            $entity->setLanguage($language);
        }
        if (null !== $chronologyLower) {
            $entity->setChronologyLower($chronologyLower);
        }
        if (null !== $chronologyUpper) {
            $entity->setChronologyUpper($chronologyUpper);
        }
        if ('' !== $rawEnglishName) {
            $entity->setEnglishName($rawEnglishName);
        }
        if ('' !== $reference) {
            $entity->setReference($reference);
        }
        if (null !== $notes) {
            $entity->setNotes($notes);
        }

        $entity->setCreatedBy($input->getUser());

        if ($type === self::TYPE_PLANT) {
            if ('' !== $entityValue) {
                $entity->setPlant($entityValue);
            }
            $validationGroup = 'validation:history_plant:create';
        } else {
            if ('' !== $entityValue) {
                $entity->setAnimal($entityValue);
            }
            $validationGroup = 'validation:history_animal:create';
        }

        // Run Symfony validator assertions
        $violations = $this->validator->validate($entity, null, [$validationGroup]);
        foreach ($violations as $violation) {
            $errors[] = sprintf('%s: %s', $violation->getPropertyPath(), $violation->getMessage());
        }

        $uniqueErrors = array_values(array_unique($errors));

        if (!empty($uniqueErrors)) {
            return new RowProcessResult(errors: $uniqueErrors);
        }

        return new RowProcessResult(entity: $entity);
    }

    private function resolveLocation(string $value): ?Location
    {
        $key = mb_strtolower(trim($value));
        if (array_key_exists($key, $this->locationCache)) {
            return $this->locationCache[$key];
        }

        $repo = $this->entityManager->getRepository(Location::class);
        $location = $repo->findOneBy(['value' => $value]);

        if (null === $location) {
            // Case-insensitive fallback
            $locations = $repo->findAll();
            foreach ($locations as $loc) {
                if (mb_strtolower(trim($loc->getValue() ?? '')) === $key) {
                    $location = $loc;
                    break;
                }
            }
        }

        $this->locationCache[$key] = $location;

        return $location;
    }

    private function resolveLanguage(string $value): ?Language
    {
        $key = mb_strtolower(trim($value));
        if (array_key_exists($key, $this->languageCache)) {
            return $this->languageCache[$key];
        }

        $repo = $this->entityManager->getRepository(Language::class);
        $language = $repo->findOneBy(['value' => $value]);

        if (null === $language) {
            // Case-insensitive fallback
            $languages = $repo->findAll();
            foreach ($languages as $lang) {
                if (mb_strtolower(trim($lang->value ?? '')) === $key) {
                    $language = $lang;
                    break;
                }
            }
        }

        $this->languageCache[$key] = $language;

        return $language;
    }
}

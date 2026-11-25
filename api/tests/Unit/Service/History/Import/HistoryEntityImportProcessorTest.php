<?php

namespace App\Tests\Unit\Service\History\Import;

use App\Dto\Input\GenericImportInputDto;
use App\Entity\Auth\User;
use App\Entity\Data\History\Animal;
use App\Entity\Data\History\Plant;
use App\Entity\Vocabulary\History\Language;
use App\Entity\Vocabulary\History\Location;
use App\Service\History\Import\HistoryEntityImportProcessor;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class HistoryEntityImportProcessorTest extends TestCase
{
    private EntityManagerInterface $entityManager;
    private ValidatorInterface $validator;
    private HistoryEntityImportProcessor $processor;
    private User $user;
    private Location $location;
    private Language $language;

    protected function setUp(): void
    {
        $this->entityManager = $this->createStub(EntityManagerInterface::class);
        $this->validator = $this->createStub(ValidatorInterface::class);
        $this->processor = new HistoryEntityImportProcessor(
            $this->entityManager,
            $this->validator,
        );

        $this->user = new User();

        $this->location = new Location();
        $this->location->setValue('Rome');

        $this->language = new Language();
        $this->language->value = 'latin';
    }

    public function testSupports(): void
    {
        $this->assertTrue($this->processor->supports('animal'));
        $this->assertTrue($this->processor->supports('ANIMAL'));
        $this->assertTrue($this->processor->supports('plant'));
        $this->assertTrue($this->processor->supports('Plant'));
        $this->assertFalse($this->processor->supports('dating'));
        $this->assertFalse($this->processor->supports('analysis'));
    }

    public function testGetEntityLabel(): void
    {
        $this->assertSame('Animal', $this->processor->getEntityLabel('animal'));
        $this->assertSame('Plant', $this->processor->getEntityLabel('plant'));
    }

    public function testGetRequiredHeaders(): void
    {
        $this->assertSame(
            ['location', 'language', 'animal', 'english_name', 'chronology_lower', 'chronology_upper', 'reference'],
            $this->processor->getRequiredHeaders('animal')
        );
        $this->assertSame(
            ['location', 'language', 'plant', 'english_name', 'chronology_lower', 'chronology_upper', 'reference'],
            $this->processor->getRequiredHeaders('plant')
        );
    }

    public function testProcessRowValidAnimal(): void
    {
        $input = new GenericImportInputDto(filePath: 'test.csv', type: 'animal', user: $this->user);

        $locRepo = $this->createStub(EntityRepository::class);
        $locRepo->method('findOneBy')->willReturn($this->location);

        $langRepo = $this->createStub(EntityRepository::class);
        $langRepo->method('findOneBy')->willReturn($this->language);

        $this->entityManager->method('getRepository')
            ->willReturnMap([
                [Location::class, $locRepo],
                [Language::class, $langRepo],
            ]);

        $validator = $this->createMock(ValidatorInterface::class);
        $validator->expects($this->once())
            ->method('validate')
            ->with($this->isInstanceOf(Animal::class), null, ['validation:history_animal:create'])
            ->willReturn(new ConstraintViolationList());

        $processor = new HistoryEntityImportProcessor($this->entityManager, $validator);

        $rowData = [
            'location' => 'Rome',
            'language' => 'latin',
            'animal' => 'Camel',
            'english_name' => 'Camel',
            'chronology_lower' => '100',
            'chronology_upper' => '200',
            'reference' => 'Pliny the Elder, Nat. Hist. VIII',
            'notes' => 'Some notes',
        ];

        $result = $processor->processRow(1, $rowData, $input);

        $this->assertTrue($result->isValid());
        $this->assertInstanceOf(Animal::class, $result->entity);
        /** @var Animal $entity */
        $entity = $result->entity;
        $this->assertSame('camel', $entity->getAnimal());
        $this->assertSame('camel', $entity->getEnglishName());
        $this->assertSame($this->location, $entity->getLocation());
        $this->assertSame($this->language, $entity->getLanguage());
        $this->assertSame(100, $entity->getChronologyLower());
        $this->assertSame(200, $entity->getChronologyUpper());
        $this->assertSame('Pliny the Elder, Nat. Hist. VIII', $entity->getReference());
        $this->assertSame('Some notes', $entity->getNotes());
        $this->assertSame($this->user, $entity->getCreatedBy());
    }

    public function testProcessRowValidPlant(): void
    {
        $input = new GenericImportInputDto(filePath: 'test.csv', type: 'plant', user: $this->user);

        $locRepo = $this->createStub(EntityRepository::class);
        $locRepo->method('findOneBy')->willReturn($this->location);

        $langRepo = $this->createStub(EntityRepository::class);
        $langRepo->method('findOneBy')->willReturn($this->language);

        $this->entityManager->method('getRepository')
            ->willReturnMap([
                [Location::class, $locRepo],
                [Language::class, $langRepo],
            ]);

        $validator = $this->createMock(ValidatorInterface::class);
        $validator->expects($this->once())
            ->method('validate')
            ->with($this->isInstanceOf(Plant::class), null, ['validation:history_plant:create'])
            ->willReturn(new ConstraintViolationList());

        $processor = new HistoryEntityImportProcessor($this->entityManager, $validator);

        $rowData = [
            'location' => 'Rome',
            'language' => 'latin',
            'plant' => 'Olive',
            'english_name' => 'Olive',
            'chronology_lower' => '-100',
            'chronology_upper' => '50',
            'reference' => 'Columella, De Re Rustica',
            'notes' => null,
        ];

        $result = $processor->processRow(1, $rowData, $input);

        $this->assertTrue($result->isValid());
        $this->assertInstanceOf(Plant::class, $result->entity);
        /** @var Plant $entity */
        $entity = $result->entity;
        $this->assertSame('olive', $entity->getPlant());
        $this->assertSame('olive', $entity->getEnglishName());
        $this->assertSame($this->location, $entity->getLocation());
        $this->assertSame($this->language, $entity->getLanguage());
        $this->assertSame(-100, $entity->getChronologyLower());
        $this->assertSame(50, $entity->getChronologyUpper());
    }

    public function testProcessRowUnknownVocabularyAndValidationErrors(): void
    {
        $input = new GenericImportInputDto(filePath: 'test.csv', type: 'animal', user: $this->user);

        $locRepo = $this->createStub(EntityRepository::class);
        $locRepo->method('findOneBy')->willReturn(null);
        $locRepo->method('findAll')->willReturn([]);

        $langRepo = $this->createStub(EntityRepository::class);
        $langRepo->method('findOneBy')->willReturn(null);
        $langRepo->method('findAll')->willReturn([]);

        $this->entityManager->method('getRepository')
            ->willReturnMap([
                [Location::class, $locRepo],
                [Language::class, $langRepo],
            ]);

        $violation = $this->createStub(ConstraintViolationInterface::class);
        $violation->method('getPropertyPath')->willReturn('chronologyLower');
        $violation->method('getMessage')->willReturn('chronologyLower cannot be greater than chronologyUpper');

        $this->validator->method('validate')->willReturn(new ConstraintViolationList([$violation]));

        $rowData = [
            'location' => 'Atlantis',
            'language' => 'klingon',
            'animal' => 'Dragon',
            'english_name' => 'Dragon',
            'chronology_lower' => '500',
            'chronology_upper' => '400',
            'reference' => 'Mythology Book',
        ];

        $result = $this->processor->processRow(1, $rowData, $input);

        $this->assertFalse($result->isValid());
        $this->assertNull($result->entity);
        $this->assertCount(3, $result->errors);
        $this->assertStringContainsString('Location "Atlantis" does not exist in vocabulary', $result->errors[0]);
        $this->assertStringContainsString('Language "klingon" does not exist in vocabulary', $result->errors[1]);
        $this->assertStringContainsString('chronologyLower cannot be greater than chronologyUpper', $result->errors[2]);
    }

    public function testProcessRowMissingEnglishName(): void
    {
        $input = new GenericImportInputDto(filePath: 'test.csv', type: 'plant', user: $this->user);

        $locRepo = $this->createStub(EntityRepository::class);
        $locRepo->method('findOneBy')->willReturn($this->location);

        $langRepo = $this->createStub(EntityRepository::class);
        $langRepo->method('findOneBy')->willReturn($this->language);

        $this->entityManager->method('getRepository')
            ->willReturnMap([
                [Location::class, $locRepo],
                [Language::class, $langRepo],
            ]);

        $this->validator->method('validate')->willReturn(new ConstraintViolationList());

        $rowData = [
            'location' => 'Rome',
            'language' => 'latin',
            'plant' => 'Olive',
            'english_name' => '',
            'chronology_lower' => '100',
            'chronology_upper' => '200',
            'reference' => 'Columella, De Re Rustica',
        ];

        $result = $this->processor->processRow(1, $rowData, $input);

        $this->assertFalse($result->isValid());
        $this->assertNull($result->entity);
        $this->assertContains('english_name: This value should not be blank.', $result->errors);
    }
}

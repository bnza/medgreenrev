<?php

declare(strict_types=1);

namespace App\Tests\Functional\Command;

use App\Command\HistoryImportCommand;
use App\Entity\Auth\User;
use App\Entity\Data\History\Animal;
use App\Entity\Data\History\Plant;
use App\Entity\Data\MediaObject;
use App\Entity\Vocabulary\History\Language;
use App\Entity\Vocabulary\History\Location;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class HistoryImportCommandTest extends KernelTestCase
{
    private EntityManagerInterface $entityManager;
    private CommandTester $commandTester;
    private string $tempDir;
    private string $userEmail;
    private string $locationValue;
    private string $languageValue;

    protected function setUp(): void
    {
        self::bootKernel();

        $this->entityManager = self::getContainer()->get(EntityManagerInterface::class);

        $user = $this->entityManager->getRepository(User::class)->findOneBy([]);
        $this->assertNotNull($user, 'A user must exist in the database for test execution.');
        $this->userEmail = $user->getEmail();

        $location = $this->entityManager->getRepository(Location::class)->findOneBy([]);
        $this->assertNotNull($location, 'A location must exist in vocabulary for test execution.');
        $this->locationValue = $location->getValue();

        $language = $this->entityManager->getRepository(Language::class)->findOneBy([]);
        $this->assertNotNull($language, 'A language must exist in vocabulary for test execution.');
        $this->languageValue = $language->value;

        $application = new Application(self::$kernel);
        $command = self::getContainer()->get(HistoryImportCommand::class);
        $application->add($command);

        $this->commandTester = new CommandTester($command);

        $this->tempDir = sys_get_temp_dir() . '/history_import_cmd_test_' . uniqid();
        mkdir($this->tempDir, 0777, true);
    }

    protected function tearDown(): void
    {
        if (is_dir($this->tempDir)) {
            $files = glob($this->tempDir . '/*');
            if ($files) {
                foreach ($files as $file) {
                    unlink($file);
                }
            }
            rmdir($this->tempDir);
        }

        parent::tearDown();
    }

    public function testSuccessfulAnimalImportNonInteractive(): void
    {
        $csvFile = $this->tempDir . '/valid_animals.csv';
        $content = "location,language,animal,chronology_lower,chronology_upper,reference,notes\n" .
            sprintf("%s,%s,dromedary,1200,1250,\"ACA, Cancilleria, Reg. 12, fol. 3r\",Imported test animal\n", $this->locationValue, $this->languageValue) .
            sprintf("%s,%s,falcon,1300,1350,\"ARV, Bailia, leg. 4, fol. 1v\",Royal hunting falcon\n", $this->locationValue, $this->languageValue);
        file_put_contents($csvFile, $content);

        $initialCount = $this->entityManager->getRepository(Animal::class)->count([]);

        $exitCode = $this->commandTester->execute([
            'file' => $csvFile,
            '--type' => 'animal',
            '--user' => $this->userEmail,
        ], [
            'interactive' => false,
        ]);

        $output = $this->commandTester->getDisplay();

        $this->assertSame(0, $exitCode, $output);
        $this->assertStringContainsString('Successfully imported 2 animal record(s)', $output);
        $this->assertStringContainsString('MediaObject #', $output);

        $newCount = $this->entityManager->getRepository(Animal::class)->count([]);
        $this->assertSame($initialCount + 2, $newCount);

        // Verify MediaObject description
        $mediaObject = $this->entityManager->getRepository(MediaObject::class)->findOneBy(
            ['description' => 'Raw data imported Animal'],
            ['id' => 'DESC']
        );
        $this->assertNotNull($mediaObject);
        $this->assertSame($this->userEmail, $mediaObject->getUploadedBy()?->getEmail());
    }

    public function testSuccessfulPlantImportNonInteractive(): void
    {
        $csvFile = $this->tempDir . '/valid_plants.csv';
        $content = "location,language,plant,chronology_lower,chronology_upper,reference,notes\n" .
            sprintf("%s,%s,fig,1100,1150,\"ACA, Cancilleria, Reg. 20, fol. 10r\",Fig plantation\n", $this->locationValue, $this->languageValue) .
            sprintf("%s,%s,grapevine,1210,1260,\"AHPV, Protocolo 12, fol. 2r\",Vineyard grant\n", $this->locationValue, $this->languageValue);
        file_put_contents($csvFile, $content);

        $initialCount = $this->entityManager->getRepository(Plant::class)->count([]);

        $exitCode = $this->commandTester->execute([
            'file' => $csvFile,
            '--type' => 'plant',
            '--user' => $this->userEmail,
        ], [
            'interactive' => false,
        ]);

        $output = $this->commandTester->getDisplay();

        $this->assertSame(0, $exitCode, $output);
        $this->assertStringContainsString('Successfully imported 2 plant record(s)', $output);

        $newCount = $this->entityManager->getRepository(Plant::class)->count([]);
        $this->assertSame($initialCount + 2, $newCount);

        // Verify MediaObject description
        $mediaObject = $this->entityManager->getRepository(MediaObject::class)->findOneBy(
            ['description' => 'Raw data imported Plant'],
            ['id' => 'DESC']
        );
        $this->assertNotNull($mediaObject);
    }

    public function testValidationFailureRollbackAndErrorCsv(): void
    {
        $csvFile = $this->tempDir . '/invalid_animals.csv';
        $content = "location,language,animal,chronology_lower,chronology_upper,reference,notes\n" .
            sprintf("%s,%s,valid_wolf,1000,1100,\"Ref 1\",Note 1\n", $this->locationValue, $this->languageValue) .
            sprintf("NonExistentLocation,%s,invalid_bear,1000,1100,\"Ref 2\",Note 2\n", $this->languageValue) .
            sprintf("%s,non_existent_lang,invalid_lion,1000,1100,\"Ref 3\",Note 3\n", $this->locationValue) .
            sprintf("%s,%s,chronology_fail,1500,1200,\"Ref 4\",Note 4\n", $this->locationValue, $this->languageValue);
        file_put_contents($csvFile, $content);

        $initialCount = $this->entityManager->getRepository(Animal::class)->count([]);

        $exitCode = $this->commandTester->execute([
            'file' => $csvFile,
            '--type' => 'animal',
            '--user' => $this->userEmail,
        ], [
            'interactive' => false,
        ]);

        $output = $this->commandTester->getDisplay();

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('Import failed! The transaction has been rolled back', $output);
        $this->assertStringContainsString('An error CSV file has been generated at:', $output);

        // Verify 0 rows inserted
        $newCount = $this->entityManager->getRepository(Animal::class)->count([]);
        $this->assertSame($initialCount, $newCount);

        // Verify error CSV exists and contains 3 failed rows
        $compactOutput = (string) preg_replace('/\s+/', '', $output);
        preg_match('#generatedat:(.+?_errors\.csv)#', $compactOutput, $matches);
        $this->assertNotEmpty($matches, 'Error file path not found in output: ' . $output);
        $errorFilePath = $matches[1];
        $this->assertFileExists($errorFilePath);

        $handle = fopen($errorFilePath, 'r');
        $this->assertNotFalse($handle);

        $headers = fgetcsv($handle, escape: '');
        $this->assertContains('error', $headers);

        $errorRows = [];
        while (($row = fgetcsv($handle, escape: '')) !== false) {
            $errorRows[] = $row;
        }
        fclose($handle);

        // 3 invalid rows across the file
        $this->assertCount(3, $errorRows);
    }

    public function testInteractiveModePrompts(): void
    {
        $csvFile = $this->tempDir . '/interactive_animals.csv';
        $content = "location,language,animal,chronology_lower,chronology_upper,reference,notes\n" .
            sprintf("%s,%s,lynx,1250,1300,\"ARV, Real Cancilleria, fol. 5v\",Lynx skin trade\n", $this->locationValue, $this->languageValue);
        file_put_contents($csvFile, $content);

        // Provide interactive inputs: choice 0 ('animal') and choice user email
        $this->commandTester->setInputs([
            'animal',
            $this->userEmail,
        ]);

        $exitCode = $this->commandTester->execute([
            'file' => $csvFile,
        ], [
            'interactive' => true,
        ]);

        $output = $this->commandTester->getDisplay();

        $this->assertSame(0, $exitCode, $output);
        $this->assertStringContainsString('Successfully imported 1 animal record(s)', $output);
    }
}

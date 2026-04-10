<?php

namespace App\Tests\Functional\Data;

use App\Entity\Data\ArchaeologicalSite;
use App\Entity\Data\Context;
use App\Entity\Data\Join\ContextStratigraphicUnit;
use App\Entity\Data\Join\SampleStratigraphicUnit;
use App\Entity\Data\Sample;
use App\Entity\Data\StratigraphicUnit;
use App\Entity\Vocabulary\Region;
use App\Entity\Vocabulary\Sample\Type as SampleType;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class LastJoinEntryTriggerTest extends KernelTestCase
{
    use ApiDataTestProviderTrait;

    private EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()->get('doctrine')->getManager();
    }

    private function createSite(string $name, string $code): ArchaeologicalSite
    {
        /** @var Region $region */
        $region = $this->entityManager->getRepository(Region::class)->findOneBy([]);

        $site = new ArchaeologicalSite();
        $site->setName($name);
        $site->setCode($code);
        $site->setDescription("Description for $name");
        $site->setRegion($region);
        $this->entityManager->persist($site);

        return $site;
    }

    private function createSU(ArchaeologicalSite $site, int $number): StratigraphicUnit
    {
        $su = new StratigraphicUnit();
        $su->setSite($site);
        $su->setYear(2026);
        $su->setNumber($number);
        $su->setDescription("Description for SU $number");
        $su->setInterpretation("Interpretation for SU $number");
        $this->entityManager->persist($su);

        return $su;
    }

    private function createSample(ArchaeologicalSite $site, int $number): Sample
    {
        /** @var SampleType $sampleType */
        $sampleType = $this->getVocabulary(SampleType::class, ['code' => 'CO']);

        $sample = new Sample();
        $sample->setSite($site);
        $sample->setType($sampleType);
        $sample->setYear(2026);
        $sample->setNumber($number);
        $sample->setDescription("Test sample $number");
        $this->entityManager->persist($sample);

        return $sample;
    }

    private function createContext(ArchaeologicalSite $site, string $name): Context
    {
        $context = new Context();
        $context->setSite($site);
        $context->setType('fill');
        $context->setName($name);
        $context->setDescription("Description for $name");
        $this->entityManager->persist($context);

        return $context;
    }

    // --- Sample tests ---

    public function testDeleteLastSampleStratigraphicUnitThrowsException(): void
    {
        $site = $this->createSite('Test Site 1', 'TS1');
        $su = $this->createSU($site, 101);
        $sample = $this->createSample($site, 901);
        $this->entityManager->flush();

        $sampleSU = new SampleStratigraphicUnit();
        $sampleSU->setSample($sample);
        $sampleSU->setStratigraphicUnit($su);
        $this->entityManager->persist($sampleSU);
        $this->entityManager->flush();

        // Deleting the only join row should fail
        $this->entityManager->remove($sampleSU);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Cannot delete the last stratigraphic unit for sample');

        // Force deferred constraint triggers to fire immediately, so the exception
        // is raised during flush() instead of at transaction commit. This avoids
        // committing the transaction and breaking DAMA DoctrineTestBundle's rollback.
        $this->entityManager->getConnection()->executeStatement('SET CONSTRAINTS ALL IMMEDIATE');
        $this->entityManager->flush();
    }

    public function testDeleteNonLastSampleStratigraphicUnitSucceeds(): void
    {
        $site = $this->createSite('Test Site 1', 'TS1');
        $su1 = $this->createSU($site, 101);
        $su2 = $this->createSU($site, 102);
        $sample = $this->createSample($site, 902);
        $this->entityManager->flush();

        $sampleSU1 = new SampleStratigraphicUnit();
        $sampleSU1->setSample($sample);
        $sampleSU1->setStratigraphicUnit($su1);
        $this->entityManager->persist($sampleSU1);

        $sampleSU2 = new SampleStratigraphicUnit();
        $sampleSU2->setSample($sample);
        $sampleSU2->setStratigraphicUnit($su2);
        $this->entityManager->persist($sampleSU2);
        $this->entityManager->flush();

        // Deleting one of two join rows should succeed
        $this->entityManager->remove($sampleSU1);
        $this->entityManager->flush();

        $this->assertNotNull($sampleSU2->getId());
    }

    // --- Context tests ---

    public function testDeleteLastContextStratigraphicUnitThrowsException(): void
    {
        $site = $this->createSite('Test Site 1', 'TS1');
        $su = $this->createSU($site, 201);
        $context = $this->createContext($site, 'test context 1');
        $this->entityManager->flush();

        $contextSU = new ContextStratigraphicUnit();
        $contextSU->setContext($context);
        $contextSU->setStratigraphicUnit($su);
        $this->entityManager->persist($contextSU);
        $this->entityManager->flush();

        // Deleting the only join row should fail
        $this->entityManager->remove($contextSU);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Cannot delete the last stratigraphic unit for context');

        // Force deferred constraint triggers to fire immediately, so the exception
        // is raised during flush() instead of at transaction commit. This avoids
        // committing the transaction and breaking DAMA DoctrineTestBundle's rollback.
        $this->entityManager->getConnection()->executeStatement('SET CONSTRAINTS ALL IMMEDIATE');
        $this->entityManager->flush();
    }

    public function testDeleteNonLastContextStratigraphicUnitSucceeds(): void
    {
        $site = $this->createSite('Test Site 1', 'TS1');
        $su1 = $this->createSU($site, 201);
        $su2 = $this->createSU($site, 202);
        $context = $this->createContext($site, 'test context 2');
        $this->entityManager->flush();

        $contextSU1 = new ContextStratigraphicUnit();
        $contextSU1->setContext($context);
        $contextSU1->setStratigraphicUnit($su1);
        $this->entityManager->persist($contextSU1);

        $contextSU2 = new ContextStratigraphicUnit();
        $contextSU2->setContext($context);
        $contextSU2->setStratigraphicUnit($su2);
        $this->entityManager->persist($contextSU2);
        $this->entityManager->flush();

        // Deleting one of two join rows should succeed
        $this->entityManager->remove($contextSU1);
        $this->entityManager->flush();

        $this->assertNotNull($contextSU2->getId());
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->entityManager->close();
    }
}

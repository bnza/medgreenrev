<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceSampleStratigraphicUnitTest extends ApiTestCase
{
    use ApiTestRequestTrait;
    use ApiTestProviderTrait;

    private ?ParameterBagInterface $parameterBag = null;

    protected function setUp(): void
    {
        parent::setUp();
        static::$alwaysBootKernel = false;
        $this->parameterBag = self::getContainer()->get(ParameterBagInterface::class);
    }

    protected function tearDown(): void
    {
        $this->parameterBag = null;
        parent::tearDown();
    }

    public function testGetCollectionReturnsSampleStratigraphicUnits(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/sample_stratigraphic_units');
        $this->assertSame(200, $response->getStatusCode());

        $data = $response->toArray();
        $this->assertIsArray($data['member']);
        // Should have fixture data available
        $this->assertNotEmpty($data['member']);

        $firstItem = $data['member'][0];
        $this->assertArrayHasKey('id', $firstItem);
        $this->assertArrayHasKey('sample', $firstItem);
        $this->assertArrayHasKey('stratigraphicUnit', $firstItem);
    }

    public function testPostCreatesSampleStratigraphicUnit(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        // Use fixture data instead of creating new items
        $sample = $this->getFixtureSampleBySiteAndNumber('ME', 23);
        $stratigraphicUnit = $this->getFixtureStratigraphicUnit('ME', 103);

        $this->assertNotNull($sample, 'Fixture sample should exist');
        $this->assertNotNull($stratigraphicUnit, 'Fixture stratigraphic unit should exist');

        $payload = [
            'sample' => $sample['@id'],
            'stratigraphicUnit' => $stratigraphicUnit['@id'],
        ];

        $response = $this->apiRequest($client, 'POST', '/api/data/sample_stratigraphic_units', [
            'token' => $token,
            'json' => $payload,
        ]);

        $this->assertSame(201, $response->getStatusCode());
        $createdData = $response->toArray();
        $this->assertEquals($payload['sample'], $createdData['sample']['@id']);
        $this->assertEquals($payload['stratigraphicUnit'], $createdData['stratigraphicUnit']['@id']);
    }

    public function testPostValidationFailsWithMissingStratigraphicUnit(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        $sample = $this->getFixtureSampleBySiteAndNumber('ME', 23);

        $payload = [
            'sample' => $sample['@id'],
        ];

        $response = $this->apiRequest($client, 'POST', '/api/data/sample_stratigraphic_units', [
            'token' => $token,
            'json' => $payload,
        ]);

        $this->assertSame(422, $response->getStatusCode());
        $data = $response->toArray(false);
        $this->assertArrayHasKey('violations', $data);

        $stratigraphicUnitViolation = array_filter($data['violations'], fn ($violation) => 'stratigraphicUnit' === $violation['propertyPath']);
        $this->assertNotEmpty($stratigraphicUnitViolation);
    }

    public function testPostValidationFailsWithMissingSample(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        $stratigraphicUnit = $this->getFixtureStratigraphicUnit('ME', 101);

        $payload = [
            'stratigraphicUnit' => $stratigraphicUnit['@id'],
        ];

        $response = $this->apiRequest($client, 'POST', '/api/data/sample_stratigraphic_units', [
            'token' => $token,
            'json' => $payload,
        ]);

        $this->assertSame(422, $response->getStatusCode());
        $data = $response->toArray(false);
        $this->assertArrayHasKey('violations', $data);

        $sampleViolation = array_filter($data['violations'], fn ($violation) => 'sample' === $violation['propertyPath']);
        $this->assertNotEmpty($sampleViolation);
    }

    public function testPostValidationFailsIfRelatedEntitiesBelongToDifferentSites(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        $sites = $this->getFixtureSites();

        $sample = $this->getFixtureSampleBySiteAndNumber('ME', 23);
        $stratigraphicUnit = $this->getFixtureStratigraphicUnit('CA', 202);

        $this->assertNotNull($sample, 'Fixture sample should exist');
        $this->assertNotNull($stratigraphicUnit, 'Fixture stratigraphic unit should exist');

        $payload = [
            'sample' => $sample['@id'],
            'stratigraphicUnit' => $stratigraphicUnit['@id'],
        ];

        $response = $this->apiRequest($client, 'POST', '/api/data/sample_stratigraphic_units', [
            'token' => $token,
            'json' => $payload,
        ]);

        $this->assertSame(422, $response->getStatusCode());
        $data = $response->toArray(false);
        $this->assertArrayHasKey('violations', $data);

        $siteViolation = array_filter($data['violations'], fn ($violation) => str_contains(strtolower($violation['message']), 'same site'));
        $this->assertNotEmpty($siteViolation);
    }

    public function testPostUniqueConstraintViolation(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        $sampleSus = $this->getFixtureSampleStratigraphicUnits();

        $payload = [
            'sample' => $sampleSus[0]['sample']['@id'],
            'stratigraphicUnit' => $sampleSus[0]['stratigraphicUnit']['@id'],
        ];

        // Try to create the same relationship again - should fail with validation error
        $response = $this->apiRequest($client, 'POST', '/api/data/sample_stratigraphic_units', [
            'token' => $token,
            'json' => $payload,
        ]);

        // Should return 422 validation error, not 500 database error
        $this->assertSame(422, $response->getStatusCode());
        $data = $response->toArray(false);
        $this->assertArrayHasKey('violations', $data);
        $this->assertGreaterThan(0, count($data['violations']));

        // Check that the violation is about uniqueness
        $violations = $data['violations'];
        $uniqueViolation = array_filter($violations, function ($violation) {
            return str_contains(strtolower($violation['message']), 'duplicate');
        });
        $this->assertNotEmpty($uniqueViolation, 'Should have a uniqueness violation');
    }

    public function testDeleteLastJoinEntryReturnsValidationError(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        // Create a fresh sample — it will have exactly one join entry
        $site = $this->getFixtureSites(['code' => 'ME'])[0];
        $su = $this->getFixtureStratigraphicUnits(['site' => $site['@id']])[0];
        $type = $this->getFixtureSampleTypes()[0];

        $response = $this->apiRequest($client, 'POST', '/api/data/samples', [
            'token' => $token,
            'json' => [
                'site' => $site['@id'],
                'type' => $type['@id'],
                'year' => 2025,
                'number' => random_int(9000, 9999),
                'description' => 'Sample for delete validation test',
                'stratigraphicUnit' => $su['@id'],
            ],
        ]);
        $this->assertSame(201, $response->getStatusCode());
        $sample = $response->toArray();

        // Get the single join entry for this sample
        $sampleSus = $this->getFixtureSampleStratigraphicUnits(['sample' => $sample['@id']]);
        $this->assertCount(1, $sampleSus, 'Newly created sample should have exactly one join entry');

        // Try to delete the last (only) join entry — should fail with 422
        $response = $this->apiRequest($client, 'DELETE', $sampleSus[0]['@id'], [
            'token' => $token,
        ]);

        $this->assertSame(422, $response->getStatusCode());
        $data = $response->toArray(false);
        $this->assertArrayHasKey('violations', $data);
        $this->assertNotEmpty($data['violations']);
    }

    public function testDeleteNonLastJoinEntrySucceeds(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        // Find a sample that has more than one stratigraphic unit join entry
        $sampleSus = $this->getFixtureSampleStratigraphicUnits();
        $this->assertNotEmpty($sampleSus, 'Fixture sample stratigraphic units should exist');

        // Group by sample to find one with multiple join entries
        $bySample = [];
        foreach ($sampleSus as $su) {
            $sampleId = $su['sample']['@id'];
            $bySample[$sampleId][] = $su;
        }

        $entryToDelete = null;
        foreach ($bySample as $entries) {
            if (count($entries) > 1) {
                $entryToDelete = $entries[0];
                break;
            }
        }

        $this->assertNotNull($entryToDelete, 'Should have a sample with more than one stratigraphic unit join entry');

        $response = $this->apiRequest($client, 'DELETE', $entryToDelete['@id'], [
            'token' => $token,
        ]);

        $this->assertSame(204, $response->getStatusCode());
    }

    /**
     * Helper method to get fixture sample stratigraphic units.
     */
    protected function getFixtureSampleStratigraphicUnits(array $queryParams = []): array
    {
        $client = self::createClient();
        $url = '/api/data/sample_stratigraphic_units';
        if (!empty($queryParams)) {
            $url .= '?'.http_build_query($queryParams);
        }
        $response = $this->apiRequest($client, 'GET', $url);
        $this->assertSame(200, $response->getStatusCode());

        return $response->toArray()['member'];
    }

    /**
     * Helper method to get fixture samples.
     */
    protected function getFixtureSamples(array $queryParams = []): array
    {
        $client = self::createClient();
        $url = '/api/data/samples';
        if (!empty($queryParams)) {
            $url .= '?'.http_build_query($queryParams);
        }
        $response = $this->apiRequest($client, 'GET', $url);
        $this->assertSame(200, $response->getStatusCode());

        return $response->toArray()['member'];
    }

    /**
     * Helper method to get a specific sample by site and number.
     */
    protected function getFixtureSampleBySiteAndNumber(string $siteCode, int $number): ?array
    {
        $samples = $this->getFixtureSamples(['number' => $number]);

        foreach ($samples as $sample) {
            if (isset($sample['site']['code']) && $sample['site']['code'] === $siteCode) {
                return $sample;
            }
        }

        return null;
    }

    /**
     * Helper method to get fixture sample types.
     */
    protected function getFixtureSampleTypes(array $queryParams = []): array
    {
        $client = self::createClient();
        $response = $this->apiRequest($client, 'GET', '/api/vocabulary/sample/types', [
            'query' => $queryParams,
        ]);
        $this->assertSame(200, $response->getStatusCode());

        return $response->toArray()['member'];
    }
}

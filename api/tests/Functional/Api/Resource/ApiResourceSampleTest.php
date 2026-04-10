<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceSampleTest extends ApiTestCase
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

    public function testGetCollectionReturnsSamples(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/samples');
        $this->assertSame(200, $response->getStatusCode());
        $data = $response->toArray();
        $this->assertIsArray($data['member']);
        $this->assertNotEmpty($data['member']);

        // Check structure of first item
        $firstItem = $data['member'][0];
        $this->assertArrayHasKey('id', $firstItem);
        $this->assertArrayHasKey('site', $firstItem);
        $this->assertArrayHasKey('type', $firstItem);
        $this->assertArrayHasKey('number', $firstItem);
    }

    public function testPostCreatesSample(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        $site = $this->getFixtureSites(['code' => 'ME'])[0];
        $su = $this->getFixtureStratigraphicUnits(['site' => $site['@id']])[0];
        $type = $this->getFixtureSampleTypes()[0];

        // Prepare payload with valid data
        $payload = [
            'site' => $site['@id'],
            'type' => $type['@id'],
            'year' => 2025,
            'number' => random_int(9000, 9999),
            'description' => 'Test description',
            'stratigraphicUnit' => $su['@id'],
        ];

        $response = $this->apiRequest($client, 'POST', '/api/data/samples', [
            'token' => $token,
            'json' => $payload,
        ]);

        $this->assertSame(201, $response->getStatusCode());
        $createdData = $response->toArray();
        $this->assertArrayHasKey('id', $createdData);
        $this->assertEquals($payload['site'], $createdData['site']['@id']);
        $this->assertEquals($payload['type'], $createdData['type']['@id']);
        $this->assertEquals($payload['year'], $createdData['year']);
        $this->assertEquals($payload['number'], $createdData['number']);
    }

    public function testGetItemReturnsSample(): void
    {
        $client = self::createClient();

        $newSample = $this->createSample($client, 'user_admin');
        $createdId = $newSample['id'];

        $response = $this->apiRequest($client, 'GET', "/api/data/samples/$createdId");
        $this->assertSame(200, $response->getStatusCode());
        $data = $response->toArray();
        $this->assertEquals($createdId, $data['id']);
        foreach (['description'] as $field) {
            $this->assertEquals($newSample[$field], $data[$field]);
        }
    }

    public function testPatchUpdatesSample(): void
    {
        $client = self::createClient();

        $newSample = $this->createSample($client, 'user_admin');
        $createdId = $newSample['id'];
        $newDescription = 'Updated sample description '.uniqid();

        $token = $this->getUserToken($client, 'user_admin');

        // PATCH
        $responsePatch = $this->apiRequest($client, 'PATCH', "/api/data/samples/$createdId", [
            'token' => $token,
            'json' => ['description' => $newDescription],
        ]);
        $this->assertSame(200, $responsePatch->getStatusCode());
        $patchedData = $responsePatch->toArray();
        $this->assertEquals($newDescription, $patchedData['description']);
    }

    public function testDeleteRemovesSample(): void
    {
        $client = self::createClient();
        $newSample = $this->createSample($client, 'user_admin');

        $createdId = $newSample['id'];
        $token = $this->getUserToken($client, 'user_admin');

        // DELETE
        $responseDelete = $this->apiRequest($client, 'DELETE', "/api/data/samples/$createdId", [
            'token' => $token,
        ]);
        $this->assertSame(204, $responseDelete->getStatusCode());

        // Confirm deletion
        $responseGet = $this->apiRequest($client, 'GET', "/api/data/samples/$createdId");
        $this->assertSame(404, $responseGet->getStatusCode());
    }

    public function testPostValidationFailsWithMissingSite(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        $type = $this->getFixtureSampleTypes()[0];

        $payload = [
            'type' => $type['@id'],
            'year' => 2025,
            'number' => 1,
            'description' => 'Test description',
        ];

        $response = $this->apiRequest($client, 'POST', '/api/data/samples', [
            'token' => $token,
            'json' => $payload,
        ]);

        $this->assertSame(422, $response->getStatusCode());
        $data = $response->toArray(false);
        $this->assertArrayHasKey('violations', $data);
        $this->assertGreaterThan(0, count($data['violations']));

        // Check that site validation failed
        $siteViolation = array_filter($data['violations'], fn ($violation) => 'site' === $violation['propertyPath']);
        $this->assertNotEmpty($siteViolation);
    }

    public function testPostValidationFailsWithMissingType(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');
        $site = $this->getFixtureSites(['code' => 'ME'])[0];

        $payload = [
            'site' => $site['@id'],
            'year' => 2025,
            'number' => 1,
            'description' => 'Test description',
        ];

        $response = $this->apiRequest($client, 'POST', '/api/data/samples', [
            'token' => $token,
            'json' => $payload,
        ]);

        $this->assertSame(422, $response->getStatusCode());
        $data = $response->toArray(false);
        $this->assertArrayHasKey('violations', $data);
        $this->assertGreaterThan(0, count($data['violations']));

        // Check that type validation failed
        $typeViolation = array_filter($data['violations'], fn ($violation) => 'type' === $violation['propertyPath']);
        $this->assertNotEmpty($typeViolation);
    }

    public function testPostValidationFailsWithMissingNumber(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');
        $site = $this->getFixtureSites(['code' => 'ME'])[0];
        $type = $this->getFixtureSampleTypes()[0];

        $payload = [
            'site' => $site['@id'],
            'type' => $type['@id'],
            'year' => 2025,
            'description' => 'Test description',
        ];

        $response = $this->apiRequest($client, 'POST', '/api/data/samples', [
            'token' => $token,
            'json' => $payload,
        ]);

        $this->assertSame(422, $response->getStatusCode());
        $data = $response->toArray(false);
        $this->assertArrayHasKey('violations', $data);
        $this->assertGreaterThan(0, count($data['violations']));

        // Check that number validation failed
        $numberViolation = array_filter($data['violations'], fn ($violation) => 'number' === $violation['propertyPath']);
        $this->assertNotEmpty($numberViolation);
    }

    protected function getFixtureSampleTypes(array $queryParams = []): array
    {
        $client = self::createClient();
        $response = $this->apiRequest($client, 'GET', '/api/vocabulary/sample/types', [
            'query' => $queryParams,
        ]);
        $this->assertSame(200, $response->getStatusCode());

        return $response->toArray()['member'];
    }

    private function createSample(Client $client, string $username = 'user_admin', array $payload = [], bool $test = true): array
    {
        $token = $this->getUserToken($client, $username);
        $originalPayload = [...$payload];

        if (!array_key_exists('site', $payload)) {
            $payload['site'] = $this->getFixtureSites(['code' => 'ME'])[0]['@id'];
        }
        if (!array_key_exists('type', $payload)) {
            $payload['type'] = $this->getFixtureSampleTypes()[0]['@id'];
        }
        if (!array_key_exists('year', $payload)) {
            $payload['year'] = 2025;
        }
        if (!array_key_exists('number', $payload)) {
            $payload['number'] = random_int(9000, 9999);
        }
        if (!array_key_exists('description', $payload)) {
            $payload['description'] = 'Test description '.uniqid();
        }
        if (!array_key_exists('stratigraphicUnit', $payload)) {
            $payload['stratigraphicUnit'] = $this->getFixtureStratigraphicUnits(['site' => $payload['site']])[0]['@id'];
        }

        $response = $this->apiRequest($client, 'POST', '/api/data/samples', [
            'token' => $token,
            'json' => $payload,
        ]);
        $this->assertSame(201, $response->getStatusCode());
        $createdData = $response->toArray();

        if ($test) {
            $this->assertArrayHasKey('id', $createdData);
            if (array_key_exists('site', $originalPayload)) {
                $this->assertEquals($originalPayload['site'], $createdData['site']['@id']);
            }
            if (array_key_exists('type', $originalPayload)) {
                $this->assertEquals($originalPayload['type'], $createdData['type']['@id']);
            }
            foreach (['description'] as $field) {
                if (array_key_exists($field, $originalPayload)) {
                    $this->assertEquals($originalPayload[$field], $createdData[$field]);
                }
            }
        }

        return $createdData;
    }
}

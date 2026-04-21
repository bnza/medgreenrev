<?php

namespace App\Tests\Functional\Api\Resource\Filter;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class SearchSedimentCoreDepthFilterTest extends ApiTestCase
{
    use ApiTestRequestTrait;
    use ApiTestProviderTrait;

    private Client $client;
    private ?ParameterBagInterface $parameterBag = null;

    protected function setUp(): void
    {
        parent::setUp();
        static::$alwaysBootKernel = false;
        $this->parameterBag = self::getContainer()->get(ParameterBagInterface::class);
        $this->client = static::createClient();
    }

    protected function tearDown(): void
    {
        $this->parameterBag = null;
        parent::tearDown();
    }

    public function testSearchFilterWithOneChunkString(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => 'SC'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Verify that results contain sediment core depths from sites with codes starting with 'SC'
        foreach ($data['member'] as $item) {
            $this->assertStringStartsWith('SC', strtoupper($item['sedimentCore']['site']['code']));
        }
    }

    public function testSearchFilterWithOneChunkNumeric(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => '330'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Verify that results contain sediment core depths with depth code ending in '330'
        foreach ($data['member'] as $item) {
            $this->assertStringEndsWith('330', $item['code']);
        }
    }

    public function testSearchFilterWithTwoChunksStringAndNumeric(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => 'SC 25'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Verify that results match site code AND depth code criteria
        foreach ($data['member'] as $item) {
            $this->assertStringStartsWith('SC', strtoupper($item['sedimentCore']['site']['code']));
            $this->assertStringEndsWith('25', $item['code']);
        }
    }

    public function testSearchFilterWithTwoChunksNumericAndNumeric(): void
    {
        $client = self::createClient();

        // Two numeric chunks -> sc number AND depth
        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => '1 85'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Verify that results match sc number AND depth code criteria
        foreach ($data['member'] as $item) {
            $this->assertStringEndsWith('1', (string) $item['sedimentCore']['number']);
            $this->assertStringEndsWith('85', $item['code']);
        }
    }

    public function testSearchFilterWithThreeChunksStringNumericNumeric(): void
    {
        $client = self::createClient();

        // String + numeric + numeric -> site code AND sc number AND depth
        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => 'SC 1 85'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Verify that results match site code, sc number, and depth code criteria
        foreach ($data['member'] as $item) {
            $this->assertStringStartsWith('SC', strtoupper($item['sedimentCore']['site']['code']));
            $this->assertStringEndsWith('1', (string) $item['sedimentCore']['number']);
            $this->assertStringEndsWith('85', $item['code']);
        }
    }

    public function testSearchFilterWithThreeChunksAllNumeric(): void
    {
        $client = self::createClient();

        // Three numeric chunks -> year AND sc number AND depth
        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => '2025 1 85'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Verify that results match year, sc number, and depth code criteria
        foreach ($data['member'] as $item) {
            $this->assertStringEndsWith('2025', (string) $item['sedimentCore']['year']);
            $this->assertStringEndsWith('1', (string) $item['sedimentCore']['number']);
            $this->assertStringEndsWith('85', $item['code']);
        }
    }

    public function testSearchFilterWithFourChunks(): void
    {
        $client = self::createClient();

        // site code + year + sc number + depth
        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => 'SC 2025 1 85'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Verify that results match all four criteria
        foreach ($data['member'] as $item) {
            $this->assertStringStartsWith('SC', strtoupper($item['sedimentCore']['site']['code']));
            $this->assertStringEndsWith('2025', (string) $item['sedimentCore']['year']);
            $this->assertStringEndsWith('1', (string) $item['sedimentCore']['number']);
            $this->assertStringEndsWith('85', $item['code']);
        }
    }

    public function testSearchFilterWithInvalidCombinationReturnsEmptySet(): void
    {
        $client = self::createClient();

        // Test invalid two chunk combination (string + string)
        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => 'ABC DEF'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
        $this->assertEmpty($data['member'], 'Invalid combination should return empty results');
    }

    public function testSearchFilterWithVariousDelimiters(): void
    {
        $client = self::createClient();

        // Test with dot delimiter
        $response1 = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => 'SC.330'],
        ]);

        // Test with space delimiter
        $response2 = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => 'SC 330'],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseIsSuccessful();

        $data1 = $response1->toArray();
        $data2 = $response2->toArray();

        // Both should return the same results since they use the same chunks
        $this->assertEquals($data1['member'], $data2['member']);
    }

    public function testSearchFilterWithEmptyValueReturnsAllResults(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths', [
            'query' => ['search' => ''],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Empty search should not filter results (same as no search parameter)
        $responseNoSearch = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths');

        $dataNoSearch = $responseNoSearch->toArray();
        $this->assertEquals($dataNoSearch['member'], $data['member']);
    }

    public function testSearchFilterParameterIsOptional(): void
    {
        $client = self::createClient();

        // Request without search parameter should work
        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths');

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
    }
}

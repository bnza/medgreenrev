<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\ApiTestRequestTrait;

class ApiResourceHistoryPlantTermViewTest extends ApiTestCase
{
    use ApiTestRequestTrait;

    public function testGetCollectionReturnsPlantTerms(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/list/history/plant-terms');
        $this->assertSame(200, $response->getStatusCode());

        $data = $response->toArray();
        $this->assertIsArray($data['member'] ?? null, 'Expected collection "member" to be an array');
        $this->assertNotEmpty($data['member'], 'Expected collection to contain at least one item');

        $first = $data['member'][0];
        $this->assertArrayHasKey('value', $first);
        $this->assertArrayHasKey('@id', $first);
        $this->assertStringContainsString('/api/list/history/plant-terms/', $first['@id']);
    }

    public function testGetItemById(): void
    {
        $client = self::createClient();

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/list/history/plant-terms');
        $this->assertSame(200, $collectionResponse->getStatusCode());
        $collection = $collectionResponse->toArray();
        $this->assertNotEmpty($collection['member']);

        $first = $collection['member'][0];
        $iri = $first['@id'];

        $itemResponse = $this->apiRequest($client, 'GET', $iri);
        $this->assertSame(200, $itemResponse->getStatusCode());
        $item = $itemResponse->toArray();

        $this->assertSame($first['value'], $item['value']);
        $this->assertSame($first['@id'], $item['@id']);
    }

    public function testFilterByPartialValue(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/list/history/plant-terms?value=acanto');
        $this->assertSame(200, $response->getStatusCode());
        $data = $response->toArray();

        $this->assertNotEmpty($data['member']);
        $this->assertSame('acanto', $data['member'][0]['value']);
    }
}

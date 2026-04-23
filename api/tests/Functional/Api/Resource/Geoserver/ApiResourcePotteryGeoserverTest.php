<?php

namespace App\Tests\Functional\Api\Resource\Geoserver;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourcePotteryGeoserverTest extends ApiTestCase
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

    public function testGetCollectionJsonUnfiltered(): void
    {
        $client = self::createClient();

        $token = $this->getUserToken($client, 'user_editor');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/features/potteries', [
            'token' => $token,
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);
        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/json');
        $responseJson = json_decode($collectionResponse->getContent(), true);

        // Unfiltered should return a map {parentId: count}
        $this->assertIsArray($responseJson);
        $this->assertNotEmpty($responseJson);
        foreach ($responseJson as $count) {
            $this->assertGreaterThan(0, $count);
        }
    }

    public function testGetCollectionJsonFiltered(): void
    {
        $client = self::createClient();

        $token = $this->getUserToken($client, 'user_editor');

        // Get unfiltered counts first
        $unfilteredResponse = $this->apiRequest($client, 'GET', '/api/features/potteries', [
            'token' => $token,
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);
        $unfilteredJson = json_decode($unfilteredResponse->getContent(), true);
        $unfilteredTotal = array_sum($unfilteredJson);

        // Get filtered counts
        $collectionResponse = $this->apiRequest($client, 'GET', '/api/features/potteries?number=1', [
            'token' => $token,
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);
        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/json');
        $responseJson = json_decode($collectionResponse->getContent(), true);

        // Must always be an array map {parentId: count}
        $this->assertIsArray($responseJson);
        $filteredTotal = array_sum($responseJson);

        // Filtered total must be less than or equal to unfiltered total
        $this->assertLessThanOrEqual($unfilteredTotal, $filteredTotal);

        // Each count must be a positive integer
        foreach ($responseJson as $parentId => $count) {
            $this->assertIsInt($count);
            $this->assertGreaterThan(0, $count);
        }
    }

    public function testGetCollectionGeoJson(): void
    {
        $client = self::createClient();

        $token = $this->getUserToken($client, 'user_editor');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/features/potteries', [
            'token' => $token,
            'headers' => [
                'Accept' => 'application/geo+json',
            ],
        ]);

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/geo+json; charset=utf-8');

        $responseJson = json_decode($collectionResponse->getContent(), true);
        $this->assertSame('FeatureCollection', $responseJson['type']);

        $this->assertNotEmpty($responseJson['features']);
        $firstFeature = $responseJson['features'][0];
        $this->assertArrayHasKey('number_matched', $firstFeature['properties']);
        $this->assertGreaterThan(0, $firstFeature['properties']['number_matched']);

        // Check FID replacement
        $this->assertStringStartsWith('potteries:', $firstFeature['id']);
    }

    public function testGetNumberMatched(): void
    {
        $client = self::createClient();

        $token = $this->getUserToken($client, 'user_editor');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/features/number_matched/potteries', [
            'token' => $token,
        ]);
        $this->assertResponseStatusCodeSame(200);
        $responseArray = $collectionResponse->toArray();
        $this->assertArrayHasKey('numberMatched', $responseArray);
    }

    public function testGetExtentMatched(): void
    {
        $client = self::createClient();

        $token = $this->getUserToken($client, 'user_editor');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/features/extent_matched/potteries', [
            'token' => $token,
        ]);
        $this->assertResponseStatusCodeSame(200);
        $responseArray = $collectionResponse->toArray();
        $this->assertArrayHasKey('extent', $responseArray);
    }

    public function testAggregatedFeatureCollectionFilterConsistency(): void
    {
        $client = self::createClient();

        $filterParam = 'analyses.analysis.type[0]=/api/vocabulary/analysis/types/303';

        // Step 1: Fetch all potteries filtered by analysis type
        $filteredResponse = $this->apiRequest($client, 'GET', '/api/data/potteries?page=1&itemsPerPage=500&'.$filterParam);
        $this->assertResponseStatusCodeSame(200);
        $filteredData = json_decode($filteredResponse->getContent(), true);
        $filteredMembers = $filteredData['member'];
        $this->assertNotEmpty($filteredMembers, 'Need at least one pottery with analysis type 303 in fixtures');

        // Step 2: Build expected {siteId => count} from data endpoint
        $expectedCounts = [];
        $expectedSiteCodes = [];
        foreach ($filteredMembers as $member) {
            $siteIri = $member['stratigraphicUnit']['site']['@id'];
            $siteId = (int) basename($siteIri);
            $expectedCounts[$siteId] = ($expectedCounts[$siteId] ?? 0) + 1;
            $expectedSiteCodes[$siteId] = $member['stratigraphicUnit']['site']['code'];
        }

        // Step 3: Verify sites exist via the sites endpoint
        $codeParams = array_map(fn ($c) => 'code[]='.$c, array_unique($expectedSiteCodes));
        $sitesResponse = $this->apiRequest($client, 'GET', '/api/data/archaeological_sites?page=1&itemsPerPage=100&'.implode('&', $codeParams));
        $this->assertResponseStatusCodeSame(200);
        $sites = json_decode($sitesResponse->getContent(), true)['member'];
        $returnedSiteCodes = array_map(fn ($s) => $s['code'], $sites);
        foreach (array_unique($expectedSiteCodes) as $code) {
            $this->assertContains($code, $returnedSiteCodes, "Site code '$code' not found in archaeological_sites endpoint");
        }

        // Step 4: Call aggregated endpoint with same filter
        $aggResponse = $this->apiRequest($client, 'GET', '/api/features/potteries?'.$filterParam, [
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);
        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/json');
        $aggCounts = json_decode($aggResponse->getContent(), true);
        $this->assertIsArray($aggCounts);

        // Step 5: Compare — aggregated site IDs and counts must match data endpoint grouping
        ksort($expectedCounts);
        ksort($aggCounts);
        $this->assertSame($expectedCounts, $aggCounts, 'Aggregated site counts must match data endpoint grouping by site');
    }

    public function testGetExport(): void
    {
        $client = self::createClient();

        $token = $this->getUserToken($client, 'user_editor');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/features/export/potteries', [
            'token' => $token,
        ]);
        $this->assertResponseStatusCodeSame(200);
    }
}

<?php

namespace App\Tests\Functional\Api\Resource\Filter;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class SearchPotteryFilterTest extends ApiTestCase
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

    public function testSearchFilterWithExistingInventory(): void
    {
        $client = self::createClient();

        $potteries = $this->getPotteries();
        $this->assertNotEmpty($potteries, 'Should have at least one pottery for testing');

        $firstPottery = $potteries[0];
        $inventory = $firstPottery['inventory'];

        // Use dot-prefix format to search only by inventory and avoid dot-split logic
        $response = $this->apiRequest($client, 'GET', '/api/data/potteries', [
            'query' => ['search' => '.'.$inventory],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
        $this->assertNotEmpty($data['member']);

        // Verify that results contain potteries with inventory containing the search term
        foreach ($data['member'] as $item) {
            $this->assertStringContainsString(
                strtolower($inventory),
                strtolower($item['inventory']),
                sprintf('Expected inventory "%s" to contain "%s"', $item['inventory'], $inventory)
            );
        }
    }

    public function testSearchFilterWithSiteCode(): void
    {
        $client = self::createClient();

        $potteries = $this->getPotteries();
        $this->assertNotEmpty($potteries, 'Should have at least one pottery for testing');

        // Extract site code from the first pottery's code (format: SITE.INVENTORY)
        $firstPottery = $potteries[0];
        $code = $firstPottery['code'];
        $siteCode = explode('.', $code)[0];

        $response = $this->apiRequest($client, 'GET', '/api/data/potteries', [
            'query' => ['search' => $siteCode],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
        $this->assertNotEmpty($data['member']);

        // All results should have the site code in their code
        foreach ($data['member'] as $item) {
            $matchesInventory = str_contains(strtolower($item['inventory']), strtolower($siteCode));
            $matchesSiteCode = str_contains(strtolower($item['code']), strtolower($siteCode));
            $this->assertTrue($matchesInventory || $matchesSiteCode);
        }
    }

    public function testSearchFilterWithDotSeparatedSiteCodeAndInventory(): void
    {
        $client = self::createClient();

        $potteries = $this->getPotteries();
        $this->assertNotEmpty($potteries, 'Should have at least one pottery for testing');

        $firstPottery = $potteries[0];
        $code = $firstPottery['code'];
        $parts = explode('.', $code, 2);

        if (2 === count($parts)) {
            $siteCode = $parts[0];
            $inventory = $parts[1];

            // Search with "siteCode.inventory" format
            $response = $this->apiRequest($client, 'GET', '/api/data/potteries', [
                'query' => ['search' => $siteCode.'.'.$inventory],
            ]);

            $this->assertResponseIsSuccessful();
            $data = $response->toArray();
            $this->assertArrayHasKey('member', $data);
            $this->assertNotEmpty($data['member']);

            // All results should match both site code AND inventory
            foreach ($data['member'] as $item) {
                $this->assertStringContainsString(strtolower($siteCode), strtolower($item['code']));
                $this->assertStringContainsString(strtolower($inventory), strtolower($item['inventory']));
            }
        }
    }

    public function testSearchFilterWithDotPrefixSearchesOnlyInventory(): void
    {
        $client = self::createClient();

        $potteries = $this->getPotteries();
        $this->assertNotEmpty($potteries, 'Should have at least one pottery for testing');

        $firstPottery = $potteries[0];
        $inventory = $firstPottery['inventory'];

        // Search with ".inventory" format (empty site code)
        $response = $this->apiRequest($client, 'GET', '/api/data/potteries', [
            'query' => ['search' => '.'.$inventory],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // All results should match inventory
        foreach ($data['member'] as $item) {
            $this->assertStringContainsString(
                strtolower($inventory),
                strtolower($item['inventory']),
                sprintf('Expected inventory "%s" to contain "%s"', $item['inventory'], $inventory)
            );
        }
    }

    public function testSearchFilterWithDotSuffixSearchesOnlySiteCode(): void
    {
        $client = self::createClient();

        $potteries = $this->getPotteries();
        $this->assertNotEmpty($potteries, 'Should have at least one pottery for testing');

        $firstPottery = $potteries[0];
        $code = $firstPottery['code'];
        $siteCode = explode('.', $code)[0];

        // Search with "siteCode." format (empty inventory)
        $response = $this->apiRequest($client, 'GET', '/api/data/potteries', [
            'query' => ['search' => $siteCode.'.'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
        $this->assertNotEmpty($data['member']);

        // All results should match site code
        foreach ($data['member'] as $item) {
            $this->assertStringContainsString(strtolower($siteCode), strtolower($item['code']));
        }
    }

    public function testSearchFilterWithNonExistingTerm(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/potteries', [
            'query' => ['search' => 'NONEXISTENT_TERM'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
        $this->assertEmpty($data['member'], 'Should return no results for non-existing term');
    }

    public function testSearchFilterWithEmptyValue(): void
    {
        $client = self::createClient();

        $responseWithoutSearch = $this->apiRequest($client, 'GET', '/api/data/potteries');

        $responseWithEmptySearch = $this->apiRequest($client, 'GET', '/api/data/potteries', [
            'query' => ['search' => ''],
        ]);

        $this->assertResponseIsSuccessful();

        $dataWithoutSearch = $responseWithoutSearch->toArray();
        $dataWithEmptySearch = $responseWithEmptySearch->toArray();

        // Both should return the same results
        $this->assertEquals($dataWithoutSearch['totalItems'], $dataWithEmptySearch['totalItems']);
    }

    public function testSearchFilterCaseInsensitive(): void
    {
        $client = self::createClient();

        $potteries = $this->getPotteries();
        $this->assertNotEmpty($potteries, 'Should have at least one pottery for testing');

        $firstPottery = $potteries[0];
        $code = $firstPottery['code'];
        $siteCode = explode('.', $code)[0];

        // Test with lowercase
        $responseLower = $this->apiRequest($client, 'GET', '/api/data/potteries', [
            'query' => ['search' => strtolower($siteCode)],
        ]);

        // Test with uppercase
        $responseUpper = $this->apiRequest($client, 'GET', '/api/data/potteries', [
            'query' => ['search' => strtoupper($siteCode)],
        ]);

        $this->assertResponseIsSuccessful();

        $dataLower = $responseLower->toArray();
        $dataUpper = $responseUpper->toArray();

        // Both should return the same results (case insensitive)
        $this->assertEquals($dataLower['totalItems'], $dataUpper['totalItems']);
    }

    public function testSearchFilterCanBeCombinedWithOtherFilters(): void
    {
        $client = self::createClient();

        $potteries = $this->getPotteries();
        $this->assertNotEmpty($potteries, 'Should have at least one pottery for testing');

        $firstPottery = $potteries[0];
        $inventory = $firstPottery['inventory'];
        $stratigraphicUnitId = basename($firstPottery['stratigraphicUnit']['@id']);

        // Use dot-prefix format to search only by inventory and avoid dot-split logic
        $searchTerm = '.'.$inventory;

        // Combine search filter with stratigraphic unit filter
        $response = $this->apiRequest($client, 'GET', '/api/data/potteries', [
            'query' => [
                'search' => $searchTerm,
                'stratigraphicUnit' => $stratigraphicUnitId,
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Verify that results match both inventory AND stratigraphic unit
        foreach ($data['member'] as $item) {
            $this->assertStringContainsString(strtolower($inventory), strtolower($item['inventory']));
            $this->assertEquals($stratigraphicUnitId, basename($item['stratigraphicUnit']['@id']));
        }
    }
}

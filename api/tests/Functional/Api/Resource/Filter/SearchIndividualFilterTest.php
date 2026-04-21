<?php

namespace App\Tests\Functional\Api\Resource\Filter;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class SearchIndividualFilterTest extends ApiTestCase
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

    public function testSearchFilterWithExistingIdentifier(): void
    {
        $client = self::createClient();

        $individuals = $this->getIndividuals();
        $this->assertNotEmpty($individuals, 'Should have at least one individual for testing');

        $firstIndividual = $individuals[0];
        $identifier = $firstIndividual['identifier'];

        // Extract a portion of the identifier to search for
        $searchTerm = substr($identifier, 0, 3);

        $response = $this->apiRequest($client, 'GET', '/api/data/individuals', [
            'query' => ['search' => $searchTerm],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
        $this->assertNotEmpty($data['member']);

        // Verify that results contain individuals with identifier or site code containing the search term
        foreach ($data['member'] as $item) {
            $matchesIdentifier = str_contains(strtolower($item['identifier']), strtolower($searchTerm));
            $matchesSiteCode = str_contains(strtolower($item['code']), strtolower($searchTerm));
            $this->assertTrue(
                $matchesIdentifier || $matchesSiteCode,
                sprintf('Expected identifier "%s" or code "%s" to contain "%s"', $item['identifier'], $item['code'], $searchTerm)
            );
        }
    }

    public function testSearchFilterWithSiteCode(): void
    {
        $client = self::createClient();

        $individuals = $this->getIndividuals();
        $this->assertNotEmpty($individuals, 'Should have at least one individual for testing');

        // Extract site code from the first individual's code (format: SITE.IDENTIFIER)
        $firstIndividual = $individuals[0];
        $code = $firstIndividual['code'];
        $siteCode = explode('.', $code)[0];

        $response = $this->apiRequest($client, 'GET', '/api/data/individuals', [
            'query' => ['search' => $siteCode],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
        $this->assertNotEmpty($data['member']);

        // All results should have the site code in their code
        foreach ($data['member'] as $item) {
            $this->assertStringContainsString($siteCode, $item['code']);
        }
    }

    public function testSearchFilterWithDotSeparatedSiteCodeAndIdentifier(): void
    {
        $client = self::createClient();

        $individuals = $this->getIndividuals();
        $this->assertNotEmpty($individuals, 'Should have at least one individual for testing');

        $firstIndividual = $individuals[0];
        $code = $firstIndividual['code'];
        $parts = explode('.', $code, 2);

        if (2 === count($parts)) {
            $siteCode = $parts[0];
            $identifier = $parts[1];

            // Search with "siteCode.identifier" format
            $response = $this->apiRequest($client, 'GET', '/api/data/individuals', [
                'query' => ['search' => $siteCode.'.'.$identifier],
            ]);

            $this->assertResponseIsSuccessful();
            $data = $response->toArray();
            $this->assertArrayHasKey('member', $data);
            $this->assertNotEmpty($data['member']);

            // All results should match both site code AND identifier
            foreach ($data['member'] as $item) {
                $this->assertStringContainsString($siteCode, $item['code']);
                $this->assertStringContainsString($identifier, $item['identifier']);
            }
        }
    }

    public function testSearchFilterWithDotPrefixSearchesOnlyIdentifier(): void
    {
        $client = self::createClient();

        $individuals = $this->getIndividuals();
        $this->assertNotEmpty($individuals, 'Should have at least one individual for testing');

        $firstIndividual = $individuals[0];
        $identifier = $firstIndividual['identifier'];
        $searchTerm = substr($identifier, 0, 3);

        // Search with ".identifier" format (empty site code)
        $response = $this->apiRequest($client, 'GET', '/api/data/individuals', [
            'query' => ['search' => '.'.$searchTerm],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // All results should match identifier
        foreach ($data['member'] as $item) {
            $this->assertStringContainsString(
                strtolower($searchTerm),
                strtolower($item['identifier']),
                sprintf('Expected identifier "%s" to contain "%s"', $item['identifier'], $searchTerm)
            );
        }
    }

    public function testSearchFilterWithDotSuffixSearchesOnlySiteCode(): void
    {
        $client = self::createClient();

        $individuals = $this->getIndividuals();
        $this->assertNotEmpty($individuals, 'Should have at least one individual for testing');

        $firstIndividual = $individuals[0];
        $code = $firstIndividual['code'];
        $siteCode = explode('.', $code)[0];

        // Search with "siteCode." format (empty identifier)
        $response = $this->apiRequest($client, 'GET', '/api/data/individuals', [
            'query' => ['search' => $siteCode.'.'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
        $this->assertNotEmpty($data['member']);

        // All results should match site code
        foreach ($data['member'] as $item) {
            $this->assertStringContainsString($siteCode, $item['code']);
        }
    }

    public function testSearchFilterWithNonExistingTerm(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/individuals', [
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

        $responseWithoutSearch = $this->apiRequest($client, 'GET', '/api/data/individuals');

        $responseWithEmptySearch = $this->apiRequest($client, 'GET', '/api/data/individuals', [
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

        $individuals = $this->getIndividuals();
        $this->assertNotEmpty($individuals, 'Should have at least one individual for testing');

        $firstIndividual = $individuals[0];
        $code = $firstIndividual['code'];
        $siteCode = explode('.', $code)[0];

        // Test with lowercase
        $responseLower = $this->apiRequest($client, 'GET', '/api/data/individuals', [
            'query' => ['search' => strtolower($siteCode)],
        ]);

        // Test with uppercase
        $responseUpper = $this->apiRequest($client, 'GET', '/api/data/individuals', [
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

        $individuals = $this->getIndividuals();
        $this->assertNotEmpty($individuals, 'Should have at least one individual for testing');

        $firstIndividual = $individuals[0];
        $identifier = $firstIndividual['identifier'];
        $stratigraphicUnitId = basename($firstIndividual['stratigraphicUnit']['@id']);

        $searchTerm = substr($identifier, 0, 3);

        // Combine search filter with stratigraphic unit filter
        $response = $this->apiRequest($client, 'GET', '/api/data/individuals', [
            'query' => [
                'search' => $searchTerm,
                'stratigraphicUnit' => $stratigraphicUnitId,
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);

        // Verify that results match both search term AND stratigraphic unit
        foreach ($data['member'] as $item) {
            $matchesIdentifier = str_contains(strtolower($item['identifier']), strtolower($searchTerm));
            $matchesSiteCode = str_contains(strtolower($item['code']), strtolower($searchTerm));
            $this->assertTrue($matchesIdentifier || $matchesSiteCode);
            $this->assertEquals($stratigraphicUnitId, basename($item['stratigraphicUnit']['@id']));
        }
    }
}

<?php

declare(strict_types=1);

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceSedimentCoreDepthFromSamplingSiteTest extends ApiTestCase
{
    use ApiTestRequestTrait;

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

    public function testGetSedimentCoreDepthsBySamplingSite(): void
    {
        $client = self::createClient();

        // 1. Get all sampling sites
        $response = $this->apiRequest($client, 'GET', '/api/data/sampling_sites');
        $this->assertResponseIsSuccessful();
        $sites = $response->toArray()['member'];
        $this->assertNotEmpty($sites);

        // 2. For each sampling site, fetch its sediment core depths and assert site consistency
        foreach ($sites as $site) {
            $siteIri = $site['@id'];
            $siteId = $site['id'];

            $response = $this->apiRequest($client, 'GET', "/api/data/sampling_sites/{$siteId}/sediment_cores/depths?itemsPerPage=100");
            $this->assertResponseIsSuccessful();
            $data = $response->toArray();

            foreach ($data['member'] as $member) {
                $this->assertArrayHasKey('sedimentCore', $member, 'Each depth must have a sedimentCore');
                $this->assertArrayHasKey('site', $member['sedimentCore'], 'Each sedimentCore must have a site');
                $this->assertSame(
                    $siteIri,
                    $member['sedimentCore']['site']['@id'],
                    sprintf(
                        'Depth %s should belong to site %s but belongs to %s',
                        $member['@id'],
                        $siteIri,
                        $member['sedimentCore']['site']['@id']
                    )
                );
            }
        }
    }

    public function testGetSedimentCoreDepthsBySamplingSiteReturnsNonEmptyForKnownSite(): void
    {
        $client = self::createClient();

        // Find a sampling site that has sediment cores
        $response = $this->apiRequest($client, 'GET', '/api/data/sediment_cores');
        $this->assertResponseIsSuccessful();
        $cores = $response->toArray()['member'];
        $this->assertNotEmpty($cores);

        $siteIri = $cores[0]['site']['@id'];
        // Extract numeric ID from IRI
        $siteId = (int) basename($siteIri);

        $response = $this->apiRequest($client, 'GET', "/api/data/sampling_sites/{$siteId}/sediment_cores/depths?itemsPerPage=100");
        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertGreaterThan(0, $data['totalItems'], 'A site with sediment cores should have sediment core depths');
    }

    public function testGetSedimentCoreDepthsByNonExistentSamplingSiteReturnsEmpty(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/sampling_sites/999999/sediment_cores/depths');
        // Non-existent site should return 404 or empty collection
        $statusCode = $response->getStatusCode();
        $this->assertTrue(
            in_array($statusCode, [200, 404], true),
            "Expected 200 or 404, got {$statusCode}"
        );

        if (200 === $statusCode) {
            $data = $response->toArray();
            $this->assertSame(0, $data['totalItems']);
        }
    }
}

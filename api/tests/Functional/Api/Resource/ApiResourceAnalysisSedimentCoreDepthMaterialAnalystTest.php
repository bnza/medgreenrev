<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceAnalysisSedimentCoreDepthMaterialAnalystTest extends ApiTestCase
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

    public function testPostGetCollectionParentSubjectAclReturnsTrueForMaterialAnalystUser(): void
    {
        $client = self::createClient();
        $adminToken = $this->getUserToken($client, 'user_admin');

        // 1. Get a subject (limit 1)
        $subjectResponse = $this->apiRequest($client, 'GET', '/api/data/sediment_core_depths?itemsPerPage=1', ['token' => $adminToken]);
        $subject = $subjectResponse->toArray()['member'][0];
        $this->assertNotNull($subject, 'Fixture subject should exist');
        $subjectId = basename($subject['@id']);

        // 2-3. Use the user_mat credentials (no site privilege needed for sediment core depth)
        $matToken = $this->getUserToken($client, 'user_mat');

        // 4. Fetch subcollection as material analyst and check canCreate
        $collectionResponse = $this->apiRequest($client, 'GET', "/api/data/sediment_core_depths/$subjectId/analyses", ['token' => $matToken]);
        $collection = $collectionResponse->toArray();

        $this->assertArrayHasKey('_acl', $collection);
        $this->assertTrue($collection['_acl']['canCreate']);
    }
}

<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceAnalysisTest extends ApiTestCase
{
    use ApiTestRequestTrait;
    use ApiTestProviderTrait;
    use AnalysisJoinDeleteTestTrait;

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

    public function testPostGetCollectionWholeAclReturnsFalseForUnauthenticatedUser(): void
    {
        $client = self::createClient();

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/analyses');
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertFalse($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsTrueForAdminUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/analyses', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertTrue($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsTrueForMaterialAnalystUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_mat');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/analyses', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertTrue($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsTrueForSpecialistUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_pot');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/analyses', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertTrue($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsFalseForNonSpecialistUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_base');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/analyses', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertFalse($collection['_acl']['canCreate']);
    }

    public function testDeleteAnalysisIsBlockedWhenReferencedByAnalysisJoin(): void
    {
        $this->assertDeleteIsBlockedByAnalysisJoin(
            joinCollectionPaths: [
                '/api/data/analyses/botany/charcoals',
                '/api/data/analyses/botany/seeds',
                '/api/data/analyses/context/botanies',
                '/api/data/analyses/context/zoos',
                '/api/data/analyses/individuals',
                '/api/data/analyses/potteries',
                '/api/data/analyses/samples',
                '/api/data/analyses/sample/botanies',
                '/api/data/analyses/sample/microstratigraphies',
                '/api/data/analyses/sediment_core/depths',
                '/api/data/analyses/sediment_core/depth_botanies',
                '/api/data/analyses/site/anthropologies',
                '/api/data/analyses/zoo/bones',
                '/api/data/analyses/zoo/tooths',
            ],
            expectedShortClassNames: [
                'AnalysisBotanyCharcoal',
                'AnalysisBotanySeed',
                'AnalysisContextBotany',
                'AnalysisContextZoo',
                'AnalysisIndividual',
                'AnalysisPottery',
                'AnalysisSample',
                'AnalysisSampleBotany',
                'AnalysisSampleMicrostratigraphy',
                'AnalysisSedimentCoreDepth',
                'AnalysisSedimentCoreDepthBotany',
                'AnalysisSiteAnthropology',
                'AnalysisZooBone',
                'AnalysisZooTooth',
            ],
            targetSide: 'analysis'
        );
    }
}

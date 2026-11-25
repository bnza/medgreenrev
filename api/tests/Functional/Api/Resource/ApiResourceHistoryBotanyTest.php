<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceHistoryBotanyTest extends ApiTestCase
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

    public function testPostGetCollectionWholeAclReturnsFalseForUnauthenticatedUser(): void
    {
        $client = self::createClient();

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/plants');
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertFalse($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsTrueForAdminUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/plants', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertTrue($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsTrueForHistorianUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_his');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/plants', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertTrue($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsFalseForSpecialistUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_pot');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/plants', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertFalse($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsFalseForNonSpecialistUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_base');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/plants', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertFalse($collection['_acl']['canCreate']);
    }

    public function testPlantWithMatchingEnglishNameResolvesTaxonomy(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/plants?plant=acanto');
        $this->assertSame(200, $response->getStatusCode());

        $plant = $response->toArray()['member'][0];
        $this->assertSame('acanto', $plant['plant']);
        $this->assertSame("bear's breeches", $plant['englishName']);
        $this->assertNotNull($plant['flat'], 'Matching englishName should resolve to taxonomy');
        $this->assertSame('species', $plant['flat']['level']);
        $this->assertSame('Acanthus mollis', $plant['flat']['value']);
        $this->assertSame("bear's breeches", $plant['flat']['englishName']);
        $this->assertSame('acanto', $plant['flat']['spanishName']);
        $this->assertSame('Acanthaceae', $plant['flat']['family']);
        $this->assertSame('Magnoliopsida', $plant['flat']['class']);
    }

    public function testPlantWithUncataloguedEnglishNamePreservesValuesWithNullTaxonomy(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_his');

        $locationIri = $this->getVocabulary('history/locations')[0]['@id'];
        $languageIri = $this->getVocabulary('history/languages')[0]['@id'];

        $payload = [
            'plant' => 'planta misteriosa',
            'englishName' => 'mysterious uncatalogued plant',
            'location' => $locationIri,
            'language' => $languageIri,
            'chronologyLower' => 1200,
            'chronologyUpper' => 1300,
            'reference' => 'Historical text reference',
        ];

        $postResponse = $this->apiRequest($client, 'POST', '/api/data/history/plants', [
            'token' => $token,
            'json' => $payload,
        ]);
        $this->assertSame(201, $postResponse->getStatusCode());
        $created = $postResponse->toArray();

        $this->assertSame('planta misteriosa', $created['plant']);
        $this->assertSame('mysterious uncatalogued plant', $created['englishName']);

        // Check flat view
        $getResponse = $this->apiRequest($client, 'GET', $created['@id'], ['token' => $token]);
        $this->assertSame(200, $getResponse->getStatusCode());
        $item = $getResponse->toArray();
        $this->assertNull($item['flat']['taxonomyId'] ?? null);
        $this->assertNull($item['flat']['value'] ?? null);
    }

    public function testPostPlantRequiresEnglishName(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_his');

        $locationIri = $this->getVocabulary('history/locations')[0]['@id'];
        $languageIri = $this->getVocabulary('history/languages')[0]['@id'];

        $payload = [
            'plant' => 'planta sin ingles',
            'location' => $locationIri,
            'language' => $languageIri,
            'chronologyLower' => 1200,
            'chronologyUpper' => 1300,
            'reference' => 'Historical text reference',
        ];

        $postResponse = $this->apiRequest($client, 'POST', '/api/data/history/plants', [
            'token' => $token,
            'json' => $payload,
        ]);
        $this->assertSame(422, $postResponse->getStatusCode());
    }

    public function testPicklistReturnsTaxonomyAndDataEnglishNames(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/list/history/plants?value=bear');
        $this->assertSame(200, $response->getStatusCode());

        $members = $response->toArray()['member'];
        $this->assertNotEmpty($members);
        $this->assertSame("bear's breeches", $members[0]['value']);
        $this->assertNotNull($members[0]['taxonomyId']);
        $this->assertSame('Acanthus mollis', $members[0]['taxonomy']);
    }
}

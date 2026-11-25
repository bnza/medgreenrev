<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceHistoryAnimalTest extends ApiTestCase
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

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/animals');
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertFalse($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsTrueForAdminUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/animals', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertTrue($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsTrueForHistorianUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_his');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/animals', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertTrue($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsFalseForSpecialistUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_pot');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/animals', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertFalse($collection['_acl']['canCreate']);
    }

    public function testPostGetCollectionWholeAclReturnsFalseForNonSpecialistUser(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_base');

        $collectionResponse = $this->apiRequest($client, 'GET', '/api/data/history/animals', ['token' => $token]);
        $collection = $collectionResponse->toArray();
        $this->arrayHasKey('_acl', $collection);
        $this->assertFalse($collection['_acl']['canCreate']);
    }

    public function testAnimalWithMatchingEnglishNameResolvesTaxonomy(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/animals?animal=perdiz');
        $this->assertSame(200, $response->getStatusCode());

        $animal = $response->toArray()['member'][0];
        $this->assertSame('perdiz', $animal['animal']);
        $this->assertSame('partridge', $animal['englishName']);
        $this->assertNotNull($animal['flat'], 'Matching englishName should resolve to taxonomy');
        $this->assertSame('species', $animal['flat']['level']);
        $this->assertSame('Alectoris rufa', $animal['flat']['value']);
        $this->assertSame('Phasianidae', $animal['flat']['family']);
        $this->assertSame('partridge', $animal['flat']['englishName']);
        $this->assertSame('perdiz', $animal['flat']['spanishName']);
    }

    public function testAnimalWithUncataloguedEnglishNamePreservesValuesWithNullTaxonomy(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_his');

        $locationIri = $this->getVocabulary('history/locations')[0]['@id'];
        $languageIri = $this->getVocabulary('history/languages')[0]['@id'];

        $payload = [
            'animal' => 'animal misterioso',
            'englishName' => 'mysterious uncatalogued animal',
            'location' => $locationIri,
            'language' => $languageIri,
            'chronologyLower' => 1200,
            'chronologyUpper' => 1300,
            'reference' => 'Historical text reference',
        ];

        $postResponse = $this->apiRequest($client, 'POST', '/api/data/history/animals', [
            'token' => $token,
            'json' => $payload,
        ]);
        $this->assertSame(201, $postResponse->getStatusCode());
        $created = $postResponse->toArray();

        $this->assertSame('animal misterioso', $created['animal']);
        $this->assertSame('mysterious uncatalogued animal', $created['englishName']);

        // Check flat view
        $getResponse = $this->apiRequest($client, 'GET', $created['@id'], ['token' => $token]);
        $this->assertSame(200, $getResponse->getStatusCode());
        $item = $getResponse->toArray();
        $this->assertNull($item['flat']['taxonomyId'] ?? null);
        $this->assertNull($item['flat']['value'] ?? null);
    }

    public function testPostAnimalRequiresEnglishName(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_his');

        $locationIri = $this->getVocabulary('history/locations')[0]['@id'];
        $languageIri = $this->getVocabulary('history/languages')[0]['@id'];

        $payload = [
            'animal' => 'animal sin ingles',
            'location' => $locationIri,
            'language' => $languageIri,
            'chronologyLower' => 1200,
            'chronologyUpper' => 1300,
            'reference' => 'Historical text reference',
        ];

        $postResponse = $this->apiRequest($client, 'POST', '/api/data/history/animals', [
            'token' => $token,
            'json' => $payload,
        ]);
        $this->assertSame(422, $postResponse->getStatusCode());
    }

    public function testPicklistReturnsTaxonomyAndDataEnglishNames(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/list/history/animals?value=partridge');
        $this->assertSame(200, $response->getStatusCode());

        $members = $response->toArray()['member'];
        $this->assertNotEmpty($members);
        $this->assertSame('partridge', $members[0]['value']);
        $this->assertNotNull($members[0]['taxonomyId']);
        $this->assertSame('Alectoris rufa', $members[0]['taxonomy']);
    }
}

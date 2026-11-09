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

    public function testAnimalWithUniqueSpanishNameResolvesToSpeciesLevel(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/animals?animal=perdiz');
        $this->assertSame(200, $response->getStatusCode());

        $animal = $response->toArray()['member'][0];
        $this->assertNotNull($animal['flat'], 'A unique Spanish name should resolve to a taxonomy match');
        $this->assertSame('species', $animal['flat']['level']);
        $this->assertSame('spanish', $animal['flat']['language']);
        $this->assertSame('Alectoris rufa', $animal['flat']['value']);
        $this->assertSame('Phasianidae', $animal['flat']['family']);
        $this->assertSame('perdiz', $animal['flat']['matchedSpanishName']);
        $this->assertSame('partridge', $animal['flat']['matchedEnglishName']);
    }

    public function testAnimalWithAmbiguousSpanishNameSharedByOneFamilyResolvesToFamilyLevel(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/animals?animal=paloma');
        $this->assertSame(200, $response->getStatusCode());

        $animal = $response->toArray()['member'][0];
        $this->assertNotNull($animal['flat'], 'An ambiguous Spanish name sharing a family should still resolve');
        $this->assertSame('family', $animal['flat']['level']);
        $this->assertSame('spanish', $animal['flat']['language']);
        $this->assertSame('Columbidae', $animal['flat']['family']);
        $this->assertNull($animal['flat']['taxonomyId'] ?? null);
    }

    public function testAnimalWithEnglishNameResolvesViaEnglishBranch(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/animals?animal=partridge');
        $this->assertSame(200, $response->getStatusCode());

        $animal = $response->toArray()['member'][0];
        $this->assertNotNull($animal['flat']);
        $this->assertSame('species', $animal['flat']['level']);
        $this->assertSame('english', $animal['flat']['language']);
        $this->assertSame('partridge', $animal['flat']['matchedEnglishName']);
        $this->assertSame('perdiz', $animal['flat']['matchedSpanishName']);
    }

    public function testPicklistSurfacesAmbiguousSpanishNameResolvedToFamilyLevel(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/list/history/animals?value=paloma');
        $this->assertSame(200, $response->getStatusCode());

        $members = $response->toArray()['member'];
        $taxonomyMember = $this->findListMemberByValueAndLanguage($members, 'paloma', 'spanish');
        $this->assertNotNull($taxonomyMember, 'The ambiguous Spanish name should still surface a resolved picklist entry');
        $this->assertSame('family', $taxonomyMember['level']);
    }

    private function findListMemberByValueAndLanguage(array $members, string $value, ?string $language): ?array
    {
        foreach ($members as $member) {
            if ($member['value'] === $value && $member['language'] === $language) {
                return $member;
            }
        }

        return null;
    }
}

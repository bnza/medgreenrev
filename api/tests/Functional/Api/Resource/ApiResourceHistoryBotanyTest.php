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

    public function testPlantWithUniqueSpanishNameResolvesToSpeciesLevel(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/plants?plant=acanto');
        $this->assertSame(200, $response->getStatusCode());

        $plant = $response->toArray()['member'][0];
        $this->assertNotNull($plant['flat'], 'A unique Spanish name should resolve to a taxonomy match');
        $this->assertSame('species', $plant['flat']['level']);
        $this->assertSame('spanish', $plant['flat']['language']);
        $this->assertSame('acanto', $plant['flat']['matchedSpanishName']);
        $this->assertSame("bear's breeches", $plant['flat']['matchedEnglishName']);
    }

    public function testPlantWithAmbiguousSpanishNameSharedByOneGenusResolvesToGenusLevel(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/plants?plant=ver%C3%B3nica');
        $this->assertSame(200, $response->getStatusCode());

        $plant = $response->toArray()['member'][0];
        $this->assertNotNull($plant['flat'], 'An ambiguous Spanish name sharing a genus should still resolve');
        $this->assertSame('genus', $plant['flat']['level']);
        $this->assertSame('spanish', $plant['flat']['language']);
        $this->assertSame('Veronica', $plant['flat']['value']);
    }

    public function testPlantWithAmbiguousSpanishNameSharedByOneFamilyResolvesToFamilyLevel(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/plants?plant=lengua+de+buey');
        $this->assertSame(200, $response->getStatusCode());

        $plant = $response->toArray()['member'][0];
        $this->assertNotNull($plant['flat'], 'An ambiguous Spanish name sharing a family should still resolve');
        $this->assertSame('family', $plant['flat']['level']);
        $this->assertSame('spanish', $plant['flat']['language']);
        $this->assertSame('Boraginaceae', $plant['flat']['value']);
    }

    public function testPlantWithCrossClassAmbiguousSpanishNameResolvesToNoMatch(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/plants?plant=flor+errante');
        $this->assertSame(200, $response->getStatusCode());

        $plant = $response->toArray()['member'][0];
        $this->assertNotNull($plant['flat'], 'The view row must still exist even without a taxonomy match');
        $this->assertNull($plant['flat']['level'] ?? null);
        $this->assertNull($plant['flat']['taxonomyId'] ?? null);
        $this->assertNull($plant['flat']['value'] ?? null);
    }

    public function testPlantWithUniqueSpanishNameHavingAnEnglishCounterpartExposesBothMatchedNames(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/plants?plant=trigo');
        $this->assertSame(200, $response->getStatusCode());

        $plant = $response->toArray()['member'][0];
        $this->assertNotNull($plant['flat']);
        $this->assertSame('species', $plant['flat']['level']);
        $this->assertSame('spanish', $plant['flat']['language']);
        $this->assertSame('trigo', $plant['flat']['matchedSpanishName']);
        $this->assertSame('wheat', $plant['flat']['matchedEnglishName']);
    }

    public function testPlantWithEnglishNameResolvesViaEnglishBranch(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/data/history/plants?plant=wheat');
        $this->assertSame(200, $response->getStatusCode());

        $plant = $response->toArray()['member'][0];
        $this->assertNotNull($plant['flat']);
        $this->assertSame('species', $plant['flat']['level']);
        $this->assertSame('english', $plant['flat']['language']);
        $this->assertSame('wheat', $plant['flat']['matchedEnglishName']);
        $this->assertSame('trigo', $plant['flat']['matchedSpanishName']);
    }

    public function testPicklistSurfacesBothSpanishAndEnglishCandidatesForAmbiguousName(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/list/history/plants?value=ver%C3%B3nica');
        $this->assertSame(200, $response->getStatusCode());

        $members = $response->toArray()['member'];
        $taxonomyMember = $this->findListMemberByValueAndLanguage($members, 'verónica', 'spanish');
        $this->assertNotNull($taxonomyMember, 'The ambiguous Spanish name should still surface a resolved picklist entry');
        $this->assertSame('genus', $taxonomyMember['level']);
    }

    public function testPicklistSurfacesUnresolvedCrossClassSpanishNameWithoutTaxonomy(): void
    {
        $client = self::createClient();

        $response = $this->apiRequest($client, 'GET', '/api/list/history/plants?value=flor+errante');
        $this->assertSame(200, $response->getStatusCode());

        $members = $response->toArray()['member'];
        $taxonomyMember = $this->findListMemberByValueAndLanguage($members, 'flor errante', 'spanish');
        $this->assertNotNull($taxonomyMember, 'An unresolved Spanish name should still appear as a candidate value');
        $this->assertNull($taxonomyMember['level'] ?? null);
        $this->assertNull($taxonomyMember['taxonomyId'] ?? null);
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

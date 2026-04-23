<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceAnalysisBotanySeedMaterialAnalystTest extends ApiTestCase
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
        $subjectResponse = $this->apiRequest($client, 'GET', '/api/data/botany/seeds?itemsPerPage=1', ['token' => $adminToken]);
        $subject = $subjectResponse->toArray()['member'][0];
        $this->assertNotNull($subject, 'Fixture subject should exist');
        $subjectId = basename($subject['@id']);

        // 2. Find the site the subject belongs to
        $siteIri = $subject['stratigraphicUnit']['site']['@id'];

        // 3. Create a material analyst user and grant site privilege
        $email = 'mat_analyst_seed_test@example.com';
        $password = 'StrongPass123!';

        $createUserResponse = $this->apiRequest($client, 'POST', '/api/admin/users', [
            'token' => $adminToken,
            'json' => [
                'email' => $email,
                'plainPassword' => $password,
                'roles' => ['ROLE_MATERIAL_ANALYST'],
            ],
        ]);
        $this->assertSame(201, $createUserResponse->getStatusCode());
        $userId = $createUserResponse->toArray()['@id'];

        $createPrivilegeResponse = $this->apiRequest($client, 'POST', '/api/admin/site_user_privileges', [
            'token' => $adminToken,
            'json' => [
                'user' => $userId,
                'site' => $siteIri,
                'privilege' => 0,
            ],
        ]);
        $this->assertSame(201, $createPrivilegeResponse->getStatusCode());

        // 4. Fetch subcollection as material analyst and check canCreate
        $matToken = $this->getUserToken($client, $email, $password);
        $collectionResponse = $this->apiRequest($client, 'GET', "/api/data/botany/seeds/$subjectId/analyses", ['token' => $matToken]);
        $collection = $collectionResponse->toArray();

        $this->assertArrayHasKey('_acl', $collection);
        $this->assertTrue($collection['_acl']['canCreate']);
    }
}

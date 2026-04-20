<?php

declare(strict_types=1);

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceVocZooTaxonomyTest extends ApiTestCase
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

    public function testDeleteTaxonomyIsBlockedWhenReferencedByOtherEntities(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        // 1. Find a taxonomy referenced by a zoo bone
        $response = $this->apiRequest($client, 'GET', '/api/data/zoo/bones', ['token' => $token]);
        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertNotEmpty($data['member']);
        $bone = $data['member'][0];
        $taxonomyIri = is_array($bone['taxonomy']) ? $bone['taxonomy']['@id'] : $bone['taxonomy'];

        // 2. Try to delete it
        $this->apiRequest($client, 'DELETE', $taxonomyIri, ['token' => $token]);

        // 3. Expect 422 Unprocessable Entity due to NotReferenced constraint
        $this->assertResponseStatusCodeSame(422);
        $this->assertJsonContains([
            'violations' => [
                [
                    'propertyPath' => '',
                ],
            ],
        ]);
    }
}

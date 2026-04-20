<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceZooBoneTest extends ApiTestCase
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

    public function testBitmapFilterDistalMatchesDistalAndBoth(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        // Get total bones count
        $totalCount = $this->getTotalItemsCount($client, '/api/data/zoo/bones');

        // Filter with BitmapFilter any strategy for distal (id=1)
        // This should match bones with endsPreserved = distal (1) AND both (3)
        // because BIT_AND(1, 1) > 0 and BIT_AND(3, 1) > 0
        $response = $this->apiRequest($client, 'GET', '/api/data/zoo/bones', [
            'token' => $token,
            'query' => [
                'endsPreserved[and]' => '/api/vocabulary/zoo/bone_end_preserved/1',
            ],
        ]);

        $this->assertSame(200, $response->getStatusCode());
        $data = $response->toArray();
        $filteredCount = $data['totalItems'];

        // Must return results
        $this->assertGreaterThan(0, $filteredCount);
        // Must be less than total (proximal-only and null bones are excluded)
        $this->assertLessThan($totalCount, $filteredCount);

        // Verify each returned bone has endsPreserved with id 1 (distal) or 3 (both)
        foreach ($data['member'] as $bone) {
            $this->assertNotNull($bone['endsPreserved'], 'Filtered bone must have endsPreserved set');
            $iri = is_array($bone['endsPreserved']) ? $bone['endsPreserved']['@id'] : $bone['endsPreserved'];
            $this->assertMatchesRegularExpression(
                '#/api/vocabulary/zoo/bone_end_preserved/(1|3)$#',
                $iri,
                sprintf('endsPreserved IRI must end with /1 or /3, got %s', $iri)
            );
        }
    }

    public function testBitmapFilterBothMatchesOnlyBoth(): void
    {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        // Filter with BitmapFilter any strategy for both (id=3)
        // BIT_AND(1, 3) = 1 > 0, BIT_AND(2, 3) = 2 > 0, BIT_AND(3, 3) = 3 > 0
        // So "any=3" would match all three. Use "and" strategy instead:
        // BIT_AND(1, 3) = 1 != 3, BIT_AND(2, 3) = 2 != 3, BIT_AND(3, 3) = 3 == 3
        $response = $this->apiRequest($client, 'GET', '/api/data/zoo/bones', [
            'token' => $token,
            'query' => [
                'endsPreserved[and]' => '/api/vocabulary/zoo/bone_end_preserved/3',
            ],
        ]);

        $this->assertSame(200, $response->getStatusCode());
        $data = $response->toArray();
        $filteredCount = $data['totalItems'];

        $this->assertGreaterThan(0, $filteredCount);

        // Verify each returned bone has endsPreserved with id 3 (both) only
        foreach ($data['member'] as $bone) {
            $this->assertNotNull($bone['endsPreserved'], 'Filtered bone must have endsPreserved set');
            $iri = is_array($bone['endsPreserved']) ? $bone['endsPreserved']['@id'] : $bone['endsPreserved'];
            $this->assertMatchesRegularExpression(
                '#/api/vocabulary/zoo/bone_end_preserved/3$#',
                $iri,
                sprintf('endsPreserved IRI must end with /3, got %s', $iri)
            );
        }
    }
}

<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceAbsDatingAnalysisTest extends ApiTestCase
{
    use ApiTestRequestTrait;
    use ApiTestProviderTrait;

    private ?ParameterBagInterface $parameterBag = null;

    private const ABS_DATING_DATA = [
        'datingLower' => 1200,
        'datingUpper' => 1300,
        'uncalibratedDating' => 1256,
        'error' => 25,
        'calibrationCurve' => 'IntCal20',
        'notes' => 'Test abs dating notes',
    ];

    private const ANALYSIS_TYPE_C14_IRI = '/api/vocabulary/analysis/types/101';

    /**
     * Maps each resource key to its analysis join endpoint and subject collection endpoint.
     */
    private static function resourceConfigs(): array
    {
        return [
            'sediment_cores' => [
                'joinEndpoint' => '/api/data/analyses/sediment_cores',
                'subjectEndpoint' => '/api/data/sediment_cores',
            ],
            'potteries' => [
                'joinEndpoint' => '/api/data/analyses/potteries',
                'subjectEndpoint' => '/api/data/potteries',
            ],
            'individuals' => [
                'joinEndpoint' => '/api/data/analyses/individuals',
                'subjectEndpoint' => '/api/data/individuals',
            ],
            'samples' => [
                'joinEndpoint' => '/api/data/analyses/samples',
                'subjectEndpoint' => '/api/data/samples',
            ],
            'zoo_bones' => [
                'joinEndpoint' => '/api/data/analyses/zoo/bones',
                'subjectEndpoint' => '/api/data/zoo/bones',
            ],
            'zoo_teeth' => [
                'joinEndpoint' => '/api/data/analyses/zoo/teeth',
                'subjectEndpoint' => '/api/data/zoo/teeth',
            ],
            'botany_charcoals' => [
                'joinEndpoint' => '/api/data/analyses/botany/charcoals',
                'subjectEndpoint' => '/api/data/botany/charcoals',
            ],
            'botany_seeds' => [
                'joinEndpoint' => '/api/data/analyses/botany/seeds',
                'subjectEndpoint' => '/api/data/botany/seeds',
            ],
        ];
    }

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

    /**
     * Helper: create an Analysis entity via API.
     */
    private function createAnalysis(mixed $client, string $token, string $identifier): array
    {
        $response = $this->apiRequest($client, 'POST', '/api/data/analyses', [
            'token' => $token,
            'json' => [
                'identifier' => $identifier,
                'type' => self::ANALYSIS_TYPE_C14_IRI,
                'year' => 2025,
            ],
        ]);
        $this->assertSame(201, $response->getStatusCode(), 'Failed to create Analysis: '.$response->getContent(false));

        return $response->toArray();
    }

    /**
     * Helper: get the first subject IRI from a collection endpoint.
     */
    private function getFirstSubjectIri(mixed $client, string $token, string $subjectEndpoint): string
    {
        $response = $this->apiRequest($client, 'GET', $subjectEndpoint, [
            'token' => $token,
        ]);
        $this->assertSame(200, $response->getStatusCode());
        $members = $response->toArray()['member'];
        $this->assertNotEmpty($members, "No fixture subjects found at $subjectEndpoint");

        return $members[0]['@id'];
    }

    /**
     * Helper: delete an analysis join.
     */
    private function deleteAnalysisJoin(mixed $client, string $token, string $joinIri): void
    {
        $response = $this->apiRequest($client, 'DELETE', $joinIri, [
            'token' => $token,
        ]);
        $this->assertSame(204, $response->getStatusCode(), 'Failed to delete analysis join: '.$response->getContent(false));
    }

    /**
     * Helper: delete an Analysis entity.
     */
    private function deleteAnalysis(mixed $client, string $token, string $analysisIri): void
    {
        $response = $this->apiRequest($client, 'DELETE', $analysisIri, [
            'token' => $token,
        ]);
        $this->assertSame(204, $response->getStatusCode(), 'Failed to delete analysis: '.$response->getContent(false));
    }

    public static function resourceProvider(): array
    {
        $configs = self::resourceConfigs();
        $data = [];
        foreach ($configs as $key => $config) {
            $data[$key] = [$key, $config['joinEndpoint'], $config['subjectEndpoint']];
        }

        return $data;
    }

    /**
     * Test 1: Create analysis without absDating, patch to add absDating,
     * patch to remove absDating (null), then delete the analysis join and analysis.
     */
    #[DataProvider('resourceProvider')]
    public function testCreateWithoutAbsDatingThenPatchAddAndRemoveThenDelete(
        string $resourceKey,
        string $joinEndpoint,
        string $subjectEndpoint,
    ): void {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        // Get a fixture subject
        $subjectIri = $this->getFirstSubjectIri($client, $token, $subjectEndpoint);

        // Create an Analysis
        $analysis = $this->createAnalysis($client, $token, 'TEST.ABSD.'.$resourceKey.'.1');
        $analysisIri = $analysis['@id'];

        // Step 1: Create analysis join WITHOUT absDating
        $postResponse = $this->apiRequest($client, 'POST', $joinEndpoint, [
            'token' => $token,
            'json' => [
                'subject' => $subjectIri,
                'analysis' => $analysisIri,
                'summary' => 'Test without abs dating',
            ],
        ]);
        $this->assertSame(201, $postResponse->getStatusCode(), 'Failed to create analysis join for '.$resourceKey.': '.$postResponse->getContent(false));
        $joinData = $postResponse->toArray();
        $joinIri = $joinData['@id'];
        $this->assertTrue(
            !array_key_exists('absDatingAnalysis', $joinData) || null === $joinData['absDatingAnalysis'],
            'absDatingAnalysis should be null or absent after creation without it'
        );

        // Step 2: PATCH to add absDating
        $patchResponse = $this->apiRequest($client, 'PATCH', $joinIri, [
            'token' => $token,
            'json' => [
                'absDatingAnalysis' => self::ABS_DATING_DATA,
            ],
        ]);
        $this->assertSame(200, $patchResponse->getStatusCode(), 'Failed to patch absDating for '.$resourceKey.': '.$patchResponse->getContent(false));
        $patchData = $patchResponse->toArray();
        $this->assertNotNull($patchData['absDatingAnalysis'], 'absDatingAnalysis should not be null after patching');
        $this->assertSame(self::ABS_DATING_DATA['datingLower'], $patchData['absDatingAnalysis']['datingLower']);
        $this->assertSame(self::ABS_DATING_DATA['datingUpper'], $patchData['absDatingAnalysis']['datingUpper']);

        // Step 3: PATCH to remove absDating (set to null)
        $removeResponse = $this->apiRequest($client, 'PATCH', $joinIri, [
            'token' => $token,
            'json' => [
                'absDatingAnalysis' => null,
            ],
        ]);
        $this->assertSame(200, $removeResponse->getStatusCode(), 'Failed to remove absDating for '.$resourceKey.': '.$removeResponse->getContent(false));
        $removeData = $removeResponse->toArray();
        $this->assertTrue(
            !array_key_exists('absDatingAnalysis', $removeData) || null === $removeData['absDatingAnalysis'],
            'absDatingAnalysis should be null or absent after setting to null'
        );

        // Step 4: Verify via GET that absDating is really gone
        $getResponse = $this->apiRequest($client, 'GET', $joinIri, [
            'token' => $token,
        ]);
        $this->assertSame(200, $getResponse->getStatusCode());
        $getData = $getResponse->toArray();
        $this->assertTrue(
            !array_key_exists('absDatingAnalysis', $getData) || null === $getData['absDatingAnalysis'],
            'absDatingAnalysis should remain null or absent on re-fetch'
        );

        // Step 5: Delete the analysis join and the analysis
        $this->deleteAnalysisJoin($client, $token, $joinIri);
        $this->deleteAnalysis($client, $token, $analysisIri);
    }

    /**
     * Test 2: Create analysis WITH absDating, then delete the whole analysis join and analysis.
     */
    #[DataProvider('resourceProvider')]
    public function testCreateWithAbsDatingThenDelete(
        string $resourceKey,
        string $joinEndpoint,
        string $subjectEndpoint,
    ): void {
        $client = self::createClient();
        $token = $this->getUserToken($client, 'user_admin');

        // Get a fixture subject
        $subjectIri = $this->getFirstSubjectIri($client, $token, $subjectEndpoint);

        // Create an Analysis
        $analysis = $this->createAnalysis($client, $token, 'TEST.ABSD.'.$resourceKey.'.2');
        $analysisIri = $analysis['@id'];

        // Step 1: Create analysis join WITH absDating
        $postResponse = $this->apiRequest($client, 'POST', $joinEndpoint, [
            'token' => $token,
            'json' => [
                'subject' => $subjectIri,
                'analysis' => $analysisIri,
                'summary' => 'Test with abs dating',
                'absDatingAnalysis' => self::ABS_DATING_DATA,
            ],
        ]);
        $this->assertSame(201, $postResponse->getStatusCode(), 'Failed to create analysis join with absDating for '.$resourceKey.': '.$postResponse->getContent(false));
        $joinData = $postResponse->toArray();
        $joinIri = $joinData['@id'];
        $this->assertNotNull($joinData['absDatingAnalysis'], 'absDatingAnalysis should not be null after creation with it');
        $this->assertSame(self::ABS_DATING_DATA['datingLower'], $joinData['absDatingAnalysis']['datingLower']);
        $this->assertSame(self::ABS_DATING_DATA['calibrationCurve'], $joinData['absDatingAnalysis']['calibrationCurve']);

        // Step 2: Delete the analysis join (should cascade-delete the absDating)
        $this->deleteAnalysisJoin($client, $token, $joinIri);

        // Step 3: Delete the analysis
        $this->deleteAnalysis($client, $token, $analysisIri);
    }
}

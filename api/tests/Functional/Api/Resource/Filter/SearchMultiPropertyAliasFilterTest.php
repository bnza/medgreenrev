<?php

namespace App\Tests\Functional\Api\Resource\Filter;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Functional tests for {@see \App\Doctrine\Filter\SearchMultiPropertyAliasFilter}
 * wired on Botany and Zoo Taxonomy endpoints.
 *
 * Botany taxonomies: search => ['flat.value', 'englishName'].
 * Zoo taxonomies:    search => ['value',      'englishName'].
 */
class SearchMultiPropertyAliasFilterTest extends ApiTestCase
{
    use ApiTestRequestTrait;
    use ApiTestProviderTrait;

    private Client $client;

    protected function setUp(): void
    {
        parent::setUp();
        static::$alwaysBootKernel = false;
        $this->client = static::createClient();
    }

    /**
     * For each endpoint and each configured target path, the alias `?search=<token>` must
     * return at least one item that contains the token at the targeted path
     * (case-insensitive). This proves that the OR-combined LIKE clauses really hit
     * each declared target column.
     *
     * @param array<int, string> $targetPaths e.g. ['flat.value', 'englishName']
     */
    #[DataProvider('provideEndpoints')]
    public function testSearchAliasMatchesEachTarget(string $collectionUrl, array $targetPaths): void
    {
        $client = static::createClient();

        $response = $this->apiRequest($client, 'GET', $collectionUrl);
        $this->assertResponseIsSuccessful();
        $all = $response->toArray();
        $this->assertArrayHasKey('totalItems', $all);
        $this->assertGreaterThan(0, $all['totalItems'], 'Fixtures should provide at least one item');

        foreach ($targetPaths as $targetPath) {
            // Find the first item that exposes a non-empty value for this target path.
            $sourceItem = null;
            foreach ($all['member'] as $item) {
                $value = self::readPath($item, $targetPath);
                if (null !== $value && '' !== $value) {
                    $sourceItem = ['value' => $value, 'item' => $item];
                    break;
                }
            }
            $this->assertNotNull(
                $sourceItem,
                sprintf('Could not find any item exposing path "%s" on %s', $targetPath, $collectionUrl),
            );

            $value = $sourceItem['value'];
            // Pick a stable mid substring (case-insensitive contains).
            $start = (int) max(0, floor(mb_strlen($value) / 3) - 1);
            $len = max(2, min(5, mb_strlen($value) - $start));
            $token = mb_substr($value, $start, $len);

            $searched = $this->apiRequest($client, 'GET', $collectionUrl, [
                'query' => ['search' => $token],
            ]);
            $this->assertResponseIsSuccessful();
            $data = $searched->toArray();
            $this->assertArrayHasKey('totalItems', $data);

            $count = $data['totalItems'];
            $this->assertGreaterThanOrEqual(
                1,
                $count,
                sprintf('Search "%s" (from path "%s") should return at least one match on %s', $token, $targetPath, $collectionUrl),
            );
            $this->assertLessThanOrEqual($all['totalItems'], $count, 'Search must be a subset of the full collection');

            // Every returned item must match the token on AT LEAST ONE of the configured target paths
            // (we cannot assert the specific path because the OR can match any of them).
            foreach ($data['member'] as $item) {
                $matched = false;
                foreach ($targetPaths as $candidatePath) {
                    $candidateValue = self::readPath($item, $candidatePath);
                    if (null !== $candidateValue && false !== stripos($candidateValue, $token)) {
                        $matched = true;
                        break;
                    }
                }
                $this->assertTrue(
                    $matched,
                    sprintf(
                        'Returned item should contain "%s" on at least one of [%s] but matched none. Item: %s',
                        $token,
                        implode(', ', $targetPaths),
                        json_encode($item),
                    ),
                );
            }
        }
    }

    /**
     * The alias must really OR-combine targets: a token taken from `englishName`
     * (which is NOT the value/flat.value column) must still produce a match.
     */
    #[DataProvider('provideEndpoints')]
    public function testSearchMatchesEnglishNameTarget(string $collectionUrl, array $targetPaths): void
    {
        if (!\in_array('englishName', $targetPaths, true)) {
            $this->markTestSkipped('Endpoint does not declare englishName as a target.');
        }

        $client = static::createClient();

        // Fetch enough items to find one with a non-empty englishName.
        $response = $this->apiRequest($client, 'GET', $collectionUrl, [
            'query' => ['itemsPerPage' => 100],
        ]);
        $this->assertResponseIsSuccessful();
        $all = $response->toArray();

        $token = null;
        $sourceId = null;
        foreach ($all['member'] as $item) {
            $english = self::readPath($item, 'englishName');
            if (null !== $english && '' !== $english && mb_strlen($english) >= 3) {
                $token = mb_substr($english, 0, min(4, mb_strlen($english)));
                $sourceId = $item['id'] ?? null;
                break;
            }
        }
        $this->assertNotNull($token, sprintf('No fixture item with a usable englishName on %s', $collectionUrl));

        $searched = $this->apiRequest($client, 'GET', $collectionUrl, [
            'query' => ['search' => $token, 'itemsPerPage' => 100],
        ]);
        $this->assertResponseIsSuccessful();
        $data = $searched->toArray();

        $this->assertGreaterThanOrEqual(1, $data['totalItems']);

        // The source item must be in the result set (it matched englishName).
        if (null !== $sourceId) {
            $returnedIds = array_map(static fn (array $i) => $i['id'] ?? null, $data['member']);
            $this->assertContains(
                $sourceId,
                $returnedIds,
                sprintf('Item #%s should appear when searching by its own englishName token "%s"', $sourceId, $token),
            );
        }
    }

    #[DataProvider('provideEndpoints')]
    public function testGibberishQueryReturnsEmptySet(string $collectionUrl, array $targetPaths): void
    {
        $client = static::createClient();
        $response = $this->apiRequest($client, 'GET', $collectionUrl, [
            'query' => ['search' => '___NO_MATCH_EXPECTED___ZZZ12345'],
        ]);
        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertArrayHasKey('member', $data);
        $this->assertCount(0, $data['member']);
        $this->assertSame(0, $data['totalItems']);
    }

    #[DataProvider('provideEndpoints')]
    public function testEmptySearchIsNoOp(string $collectionUrl, array $targetPaths): void
    {
        $client = static::createClient();

        $full = $this->apiRequest($client, 'GET', $collectionUrl);
        $this->assertResponseIsSuccessful();
        $fullTotal = $full->toArray()['totalItems'];

        $empty = $this->apiRequest($client, 'GET', $collectionUrl, [
            'query' => ['search' => '   '],
        ]);
        $this->assertResponseIsSuccessful();
        $emptyTotal = $empty->toArray()['totalItems'];

        $this->assertSame($fullTotal, $emptyTotal, 'Whitespace-only search must behave as no filter.');
    }

    public static function provideEndpoints(): array
    {
        return [
            'botany taxonomies (flat.value + englishName)' => [
                '/api/vocabulary/botany/taxonomies',
                ['flat.value', 'englishName'],
            ],
            'zoo taxonomies (value + englishName)' => [
                '/api/vocabulary/zoo/taxonomies',
                ['value', 'englishName'],
            ],
        ];
    }

    /**
     * Read a (possibly dotted) path from a response item.
     */
    private static function readPath(array $item, string $path): ?string
    {
        $current = $item;
        foreach (explode('.', $path) as $segment) {
            if (!is_array($current) || !array_key_exists($segment, $current)) {
                return null;
            }
            $current = $current[$segment];
        }

        return is_scalar($current) ? (string) $current : null;
    }
}

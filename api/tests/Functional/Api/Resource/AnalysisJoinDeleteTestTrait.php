<?php

namespace App\Tests\Functional\Api\Resource;

trait AnalysisJoinDeleteTestTrait
{
    /**
     * Generic assertion used by every testDelete<Subject>IsBlockedWhenReferencedByAnalysisJoin() test.
     *
     * Flow:
     *  1. GET each join collection in $joinCollectionPaths until one returns at least one row.
     *  2. Extract the IRI of the side under test (default 'subject', or 'analysis' for the Analysis test).
     *  3. DELETE that IRI as admin.
     *  4. Assert HTTP 422 + at least one violation message containing one of $expectedShortClassNames.
     *
     * Skips the test (markTestSkipped) when no fixture row is available — same defensive behaviour as
     * ApiResourceArchaeologicalSiteTest::testDeleteSiteIsBlockedWhenReferencedByOtherEntities().
     *
     * @param array<string>        $joinCollectionPaths     e.g. ['/api/data/analysis_zoo_bones']
     * @param array<string>        $expectedShortClassNames e.g. ['AnalysisZooBone']
     * @param 'subject'|'analysis' $targetSide              which IRI on the join row to delete
     */
    protected function assertDeleteIsBlockedByAnalysisJoin(
        array $joinCollectionPaths,
        array $expectedShortClassNames,
        string $targetSide = 'subject',
    ): void {
        $client = self::createClient();
        $adminToken = $this->getUserToken($client, 'user_admin');

        $targetIri = null;
        $foundVia = null;

        foreach ($joinCollectionPaths as $path) {
            $resp = $this->apiRequest($client, 'GET', $path, ['token' => $adminToken]);
            if (200 !== $resp->getStatusCode()) {
                continue;
            }
            foreach ($resp->toArray()['member'] ?? [] as $row) {
                $iri = $this->extractIri($row[$targetSide] ?? null);
                if (null !== $iri) {
                    $targetIri = $iri;
                    $foundVia = $path;
                    break 2;
                }
            }
        }

        if (null === $targetIri) {
            $this->markTestSkipped(sprintf(
                'No join row found in fixtures across [%s] to test the %s-side delete validator.',
                implode(', ', $joinCollectionPaths),
                $targetSide,
            ));
        }

        $deleteResp = $this->apiRequest($client, 'DELETE', $targetIri, ['token' => $adminToken]);

        $this->assertSame(422, $deleteResp->getStatusCode(), sprintf(
            'Deleting %s (picked via %s) should be blocked with 422.',
            $targetIri,
            $foundVia,
        ));

        $payload = $deleteResp->toArray(false);
        $this->assertArrayHasKey('violations', $payload);
        $this->assertGreaterThan(0, count($payload['violations']));

        $blob = implode(" \n ", array_map(static fn ($v) => $v['message'] ?? '', $payload['violations']));
        $matched = false;
        foreach ($expectedShortClassNames as $short) {
            if (str_contains($blob, $short)) {
                $matched = true;
                break;
            }
        }
        $this->assertTrue($matched, sprintf(
            'Violation messages should mention one of [%s]. Got: %s',
            implode(', ', $expectedShortClassNames),
            $blob,
        ));
    }

    /**
     * Normalises a JSON-LD reference, which may be either {"@id":"/api/..."} or a bare IRI string.
     */
    private function extractIri(mixed $value): ?string
    {
        if (is_string($value) && '' !== $value) {
            return $value;
        }
        if (is_array($value) && !empty($value['@id'])) {
            return $value['@id'];
        }

        return null;
    }
}

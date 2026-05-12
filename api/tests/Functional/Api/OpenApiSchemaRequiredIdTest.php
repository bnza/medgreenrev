<?php

namespace App\Tests\Functional\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\ApiTestRequestTrait;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Asserts that every API resource exposed by the Hydra entrypoint
 * (/api/index.jsonld) declares `id` (and `@id`) as `required` in
 * the OpenAPI response schemas for both the collection (member item)
 * and the item operations.
 *
 * Rationale: the client SPA derives its row/item types from the generated
 * OpenAPI spec. If `id` is not marked as `required`, the generated
 * TypeScript types make it optional, table rows can be rendered with
 * `item.id === undefined`, and update/delete dialogs silently fail
 * (see useGetItemQuery.ts:24 "Invalid get item operation params").
 *
 * This test enforces the contract: every resource must declare
 * `id` and `@id` as required in its JSON-LD read schemas.
 */
final class OpenApiSchemaRequiredIdTest extends ApiTestCase
{
    use ApiTestRequestTrait;

    /**
     * Opt out of the legacy auto-boot behaviour of `ApiTestCase::createClient()`.
     *
     * This test only issues plain HTTP calls (`/api/index.jsonld`,
     * `/api/docs.jsonopenapi`) and never touches the Symfony container
     * (`self::getContainer()`, fixtures, security tokens, etc.), so the
     * kernel does not need to be booted in the test process.
     *
     * Setting this to `false` aligns with the future API Platform 5.0 default
     * and silences the deprecation:
     *   "Since api-platform/symfony 4.1.0: Currently, the kernel will always
     *    be booted when a new client is created, but in API Platform 5.0,
     *    it will not be booted unless you set `static::$alwaysBootKernel`
     *    to `true`."
     */
    protected static ?bool $alwaysBootKernel = false;

    /** @var array<string, array<string, mixed>>|null */
    private static ?array $openApiSpec = null;
    /** @var array<string, string>|null */
    private static ?array $entrypoint = null;

    /**
     * Data provider: pulls the list of resources from /api/index.jsonld
     * and yields one row per resource: [resourceKey, collectionPath].
     *
     * Filters out non-resource keys (`@context`, `@id`, `@var`) and any
     * value that does not look like an API path.
     *
     * @return iterable<string, array{0: string, 1: string}>
     */
    public static function resourceProvider(): iterable
    {
        $entrypoint = self::loadEntrypoint();
        foreach ($entrypoint as $key => $path) {
            if (str_starts_with($key, '@')) {
                continue;
            }
            if (!is_string($path) || !str_starts_with($path, '/api/')) {
                continue;
            }
            yield $key => [$key, $path];
        }
    }

    #[DataProvider('resourceProvider')]
    public function testCollectionMemberSchemaRequiresId(string $resourceKey, string $collectionPath): void
    {
        $spec = self::loadOpenApiSpec();
        $this->assertArrayHasKey(
            'paths',
            $spec,
            'OpenAPI spec is missing "paths".',
        );
        $this->assertArrayHasKey(
            $collectionPath,
            $spec['paths'],
            sprintf('OpenAPI spec does not declare the collection path "%s".', $collectionPath),
        );
        $getOperation = $spec['paths'][$collectionPath]['get'] ?? null;
        $this->assertIsArray(
            $getOperation,
            sprintf('Collection path "%s" has no GET operation in the OpenAPI spec.', $collectionPath),
        );
        $responseSchema = $this->resolveJsonLdResponseSchema($spec, $getOperation);
        if (null === $responseSchema) {
            // Some collection endpoints (CSV exports, GeoJSON, etc.) have no JSON-LD response.
            // Skip them - the SPA does not use those for tabular dialogs.
            $this->markTestSkipped(
                sprintf('Resource "%s" (%s) has no application/ld+json GET 200 response.', $resourceKey, $collectionPath),
            );
        }
        // The collection response is a Hydra collection: { member: [ <item>, ... ], ... }.
        // Locate the schema of a single member.
        $memberSchema = $this->resolveCollectionMemberSchema($spec, $responseSchema);
        $this->assertNotNull(
            $memberSchema,
            sprintf(
                'Resource "%s" (%s): cannot locate the collection member schema in the OpenAPI spec.',
                $resourceKey,
                $collectionPath,
            ),
        );
        $this->assertSchemaRequiresKeys(
            $spec,
            $memberSchema,
            ['id', '@id'],
            sprintf('Resource "%s" (collection member schema for %s)', $resourceKey, $collectionPath),
        );
    }

    /**
     * Smoking-gun runtime test: complements the static schema-side assertions
     * (testCollectionMemberSchemaRequiresId / testItemSchemaRequiresId) by
     * actually issuing HTTP GETs and verifying the JSON payload really
     * contains `id` and `@id` on both collection members and the resolved
     * item.
     *
     * Why this is necessary even with the schema tests:
     * `#[ApiProperty(required: true)]` only flips the schema's `required`
     * array; it does NOT force the property to be serialized. If the read
     * `Groups` are misaligned (or a custom normalizer/DTO drops `id`), the
     * schema will declare `id` as required while the response omits it -
     * a silent contract drift that this test catches at runtime.
     *
     * Skips:
     *  - Resources whose collection GET is not exposed (4xx/5xx).
     *  - Empty collections (no member to assert on).
     *  - Resources whose item GET is not exposed (no `@id` to follow, or 4xx).
     */
    #[DataProvider('resourceProvider')]
    public function testResponseActuallyContainsId(string $resourceKey, string $collectionPath): void
    {
        $client = self::createClient();

        // 1) Fetch one collection member.
        $separator = str_contains($collectionPath, '?') ? '&' : '?';
        $collectionResponse = $client->request(
            'GET',
            $collectionPath.$separator.'itemsPerPage=1',
            ['headers' => ['Accept' => 'application/ld+json']],
        );
        $collectionStatus = $collectionResponse->getStatusCode();
        if ($collectionStatus < 200 || $collectionStatus >= 300) {
            $this->markTestSkipped(sprintf(
                'Resource "%s" collection %s returned HTTP %d - not exposed for tabular consumption.',
                $resourceKey,
                $collectionPath,
                $collectionStatus,
            ));
        }

        $collectionPayload = $collectionResponse->toArray(false);
        $this->assertIsArray(
            $collectionPayload,
            sprintf('Resource "%s" collection %s did not return a JSON object.', $resourceKey, $collectionPath),
        );

        $members = $collectionPayload['member']
            ?? $collectionPayload['hydra:member']
            ?? null;
        $this->assertIsArray(
            $members,
            sprintf('Resource "%s" collection %s has no Hydra member array.', $resourceKey, $collectionPath),
        );
        if ([] === $members) {
            $this->markTestSkipped(sprintf(
                'Resource "%s" collection %s is empty - no member to assert on.',
                $resourceKey,
                $collectionPath,
            ));
        }

        $member = $members[0];
        $this->assertIsArray(
            $member,
            sprintf('Resource "%s" collection %s first member is not an object.', $resourceKey, $collectionPath),
        );
        $this->assertArrayHasKey(
            'id',
            $member,
            sprintf(
                'Resource "%s" collection %s: member[0] is missing "id" in the JSON-LD payload. '
                .'Check that $id is in the read Groups for this operation.',
                $resourceKey,
                $collectionPath,
            ),
        );
        $this->assertArrayHasKey(
            '@id',
            $member,
            sprintf(
                'Resource "%s" collection %s: member[0] is missing "@id" in the JSON-LD payload.',
                $resourceKey,
                $collectionPath,
            ),
        );

        // 2) Follow @id to the item endpoint and verify the item payload too.
        $iri = $member['@id'];
        $this->assertIsString(
            $iri,
            sprintf('Resource "%s" collection %s: member[0]["@id"] is not a string.', $resourceKey, $collectionPath),
        );

        $itemResponse = $client->request('GET', $iri, [
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        $itemStatus = $itemResponse->getStatusCode();
        if (200 !== $itemStatus) {
            $this->markTestSkipped(sprintf(
                'Resource "%s" item %s returned HTTP %d - no item-level GET to assert on.',
                $resourceKey,
                $iri,
                $itemStatus,
            ));
        }

        $itemPayload = $itemResponse->toArray(false);
        $this->assertIsArray(
            $itemPayload,
            sprintf('Resource "%s" item %s did not return a JSON object.', $resourceKey, $iri),
        );
        $this->assertArrayHasKey(
            'id',
            $itemPayload,
            sprintf(
                'Resource "%s" item %s: payload is missing "id". '
                .'Check that $id is in the read Groups for the item operation.',
                $resourceKey,
                $iri,
            ),
        );
        $this->assertArrayHasKey(
            '@id',
            $itemPayload,
            sprintf('Resource "%s" item %s: payload is missing "@id".', $resourceKey, $iri),
        );
    }

    #[DataProvider('resourceProvider')]
    public function testItemSchemaRequiresId(string $resourceKey, string $collectionPath): void
    {
        $spec = self::loadOpenApiSpec();
        $itemPath = $collectionPath.'/{id}';
        if (!isset($spec['paths'][$itemPath])) {
            // Some resources expose only a collection (no per-item GET).
            $this->markTestSkipped(
                sprintf('Resource "%s" has no item path "%s" in the OpenAPI spec.', $resourceKey, $itemPath),
            );
        }
        $getOperation = $spec['paths'][$itemPath]['get'] ?? null;
        if (null === $getOperation) {
            $this->markTestSkipped(
                sprintf('Resource "%s" item path "%s" has no GET operation.', $resourceKey, $itemPath),
            );
        }
        $responseSchema = $this->resolveJsonLdResponseSchema($spec, $getOperation);
        $this->assertNotNull(
            $responseSchema,
            sprintf(
                'Resource "%s" (%s): item GET has no application/ld+json response schema.',
                $resourceKey,
                $itemPath,
            ),
        );
        $itemSchema = $this->resolveSchemaRef($spec, $responseSchema);
        $this->assertNotNull(
            $itemSchema,
            sprintf(
                'Resource "%s" (%s): cannot resolve the item JSON-LD schema.',
                $resourceKey,
                $itemPath,
            ),
        );
        $this->assertSchemaRequiresKeys(
            $spec,
            $itemSchema,
            ['id', '@id'],
            sprintf('Resource "%s" (item schema for %s)', $resourceKey, $itemPath),
        );
    }

    /**
     * Loads the live OpenAPI spec via the API Platform test client (single shot, cached).
     *
     * Uses the in-sync endpoint `/api/docs.jsonopenapi` (per project docs:
     * `/docs.jsonopenapi.json` is the cached/at-startup variant, `/api/docs.jsonopenapi`
     * is always current).
     */
    private static function loadOpenApiSpec(): array
    {
        if (null !== self::$openApiSpec) {
            return self::$openApiSpec;
        }
        $client = self::createClient();
        $response = $client->request('GET', '/api/docs.jsonopenapi', [
            'headers' => ['Accept' => 'application/vnd.openapi+json'],
        ]);
        self::assertSame(
            200,
            $response->getStatusCode(),
            'Unable to fetch /api/docs.jsonopenapi for schema assertions.',
        );
        $spec = json_decode($response->getContent(), true, flags: JSON_THROW_ON_ERROR);
        self::assertIsArray($spec, 'OpenAPI spec is not a JSON object.');

        return self::$openApiSpec = $spec;
    }

    /**
     * Loads the Hydra entrypoint at /api/index.jsonld (single shot, cached).
     *
     * @return array<string, mixed>
     */
    private static function loadEntrypoint(): array
    {
        if (null !== self::$entrypoint) {
            return self::$entrypoint;
        }
        $client = self::createClient();
        $response = $client->request('GET', '/api/index.jsonld', [
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertSame(
            200,
            $response->getStatusCode(),
            'Unable to fetch /api/index.jsonld for the resource list.',
        );
        $entrypoint = json_decode($response->getContent(), true, flags: JSON_THROW_ON_ERROR);
        self::assertIsArray($entrypoint, 'Entrypoint payload is not a JSON object.');

        return self::$entrypoint = $entrypoint;
    }

    /**
     * Returns the application/ld+json schema object for the GET 200 response,
     * or null if none is declared.
     *
     * @param array<string, mixed> $spec
     * @param array<string, mixed> $operation
     *
     * @return array<string, mixed>|null
     */
    private function resolveJsonLdResponseSchema(array $spec, array $operation): ?array
    {
        $schema = $operation['responses']['200']['content']['application/ld+json']['schema'] ?? null;
        if (!is_array($schema)) {
            return null;
        }

        return $schema;
    }

    /**
     * Given a (possibly `$ref`-ed) schema, returns the resolved inline schema object,
     * walking `allOf` / `oneOf` / `anyOf` once if necessary.
     *
     * @param array<string, mixed> $spec
     * @param array<string, mixed> $schema
     *
     * @return array<string, mixed>|null
     */
    private function resolveSchemaRef(array $spec, array $schema): ?array
    {
        if (isset($schema['$ref']) && is_string($schema['$ref'])) {
            $ref = $schema['$ref'];
            // Only local refs of the form "#/components/schemas/<Name>" are supported here.
            if (!str_starts_with($ref, '#/')) {
                return null;
            }
            $segments = explode('/', substr($ref, 2));
            $node = $spec;
            foreach ($segments as $segment) {
                if (!is_array($node) || !array_key_exists($segment, $node)) {
                    return null;
                }
                $node = $node[$segment];
            }

            if (!is_array($node)) {
                return null;
            }

            // Recursively resolve in case the referenced schema is itself an allOf/$ref.
            return $this->resolveSchemaRef($spec, $node);
        }
        // Recursively flatten allOf into a merged schema (preserving other keys).
        if (isset($schema['allOf']) && is_array($schema['allOf'])) {
            $merged = $schema;
            unset($merged['allOf']);
            $merged['properties'] = isset($merged['properties']) && is_array($merged['properties']) ? $merged['properties'] : [];
            $merged['required'] = isset($merged['required']) && is_array($merged['required']) ? array_values($merged['required']) : [];
            foreach ($schema['allOf'] as $part) {
                if (!is_array($part)) {
                    continue;
                }
                $resolved = $this->resolveSchemaRef($spec, $part) ?? [];
                if (isset($resolved['properties']) && is_array($resolved['properties'])) {
                    $merged['properties'] = array_merge($merged['properties'], $resolved['properties']);
                }
                if (isset($resolved['required']) && is_array($resolved['required'])) {
                    $merged['required'] = array_values(array_unique(array_merge($merged['required'], $resolved['required'])));
                }
            }

            return $merged;
        }

        return $schema;
    }

    /**
     * Hydra collection responses are objects with a `member` array.
     * Returns the resolved schema of one member.
     *
     * @param array<string, mixed> $spec
     * @param array<string, mixed> $collectionSchema
     *
     * @return array<string, mixed>|null
     */
    private function resolveCollectionMemberSchema(array $spec, array $collectionSchema): ?array
    {
        $resolved = $this->resolveSchemaRef($spec, $collectionSchema);
        if (null === $resolved) {
            return null;
        }
        $memberSchema = $resolved['properties']['member']['items']
            ?? $resolved['properties']['hydra:member']['items']
            ?? null;
        if (!is_array($memberSchema)) {
            return null;
        }

        return $this->resolveSchemaRef($spec, $memberSchema);
    }

    /**
     * Asserts that the given JSON Schema object declares every key in $required
     * inside its `required` array.
     *
     * @param array<string, mixed> $schema
     * @param list<string>         $required
     */
    private function assertSchemaRequiresKeys(array $spec, array $schema, array $required, string $context): void
    {
        $resolved = $this->resolveSchemaRef($spec, $schema) ?? $schema;
        $declared = isset($resolved['required']) && is_array($resolved['required'])
            ? array_values($resolved['required'])
            : [];
        foreach ($required as $key) {
            $this->assertContains(
                $key,
                $declared,
                sprintf(
                    '%s: expected the schema to mark "%s" as required, got [%s]. '
                    .'Add #[ApiProperty(required: true)] to the property (and ensure it is in the read Groups), '
                    .'or use the project-wide OpenApiFactory decorator.',
                    $context,
                    $key,
                    implode(', ', $declared),
                ),
            );
        }
    }
}

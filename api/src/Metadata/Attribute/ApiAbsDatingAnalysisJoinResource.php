<?php

namespace App\Metadata\Attribute;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\State\OneToOneAssociationItemProvider;

#[\Attribute(\Attribute::TARGET_CLASS)]
class ApiAbsDatingAnalysisJoinResource extends ApiResource
{
    public function __construct(
        string $subjectClass,
        string $templateParentResourceName,
        string $templateParentCategoryName = '', // category name in plural form e.g. "contexts" or "sites"
    ) {
        // $templateParentCategoryName is used to create the URI template which pertains to a category (such as "context/zoo" or "site/anthropology")
        // if $templateParentCategoryName is not provided, $templateParentResourceName will be used directly, otherwise $templateParentCategoryName
        // will be prepended
        $templateParentResourcePath = implode('/', array_filter([$templateParentCategoryName, $templateParentResourceName]));

        // Variant B: derive a *slim* per-subject serialization group name from the URI slug, instead of
        // accepting the heavy `analysis_<subject>:acl:read` group from callers.
        //
        // Why: API Platform's EagerLoadingExtension adds a LEFT JOIN for every relation property in the
        // active normalization groups (recursively). The heavy `analysis_<subject>:acl:read` groups
        // transitively reach `StratigraphicUnit:acl:read` and friends for some subjects (notably
        // Individual and SedimentCoreDepth), blowing past `api_platform.eager_loading.max_joins=30`
        // and surfacing as a 500 on `/api/data/analyses/absolute_dating/<subject>`.
        //
        // By forcing every abs-dating endpoint through a dedicated group named
        // `abs_dating_analysis_<slug>:acl:read`, the eager-loading walk only follows properties that
        // are explicitly tagged with that slim group on the subject entity — which by convention
        // remain scalar (id + a label field). The cap stops being a concern, the SQL stays small,
        // and the generated OpenAPI schema accurately reflects what the abs-dating tab consumes.
        $slimSubjectGroup = sprintf(
            'abs_dating_analysis_%s:acl:read',
            str_replace('/', '_', $templateParentResourceName),
        );

        // when $templateParentCategoryName is not provided, the URI template will be "/$templateParentResourceName/{parentId}/absolute_dating"
        // otherwise, the URI template will be "/$templateParentCategoryName/{parentId}/analyses/$templateParentResourceName"
        //        $chunks = [
        //            (bool)$templateParentCategoryName
        //                ? $templateParentCategoryName
        //                : $templateParentResourceName,
        //            '{parentId}/analyses/absolute_dating',
        //            $templateParentCategoryName
        //                ? $templateParentResourceName
        //                : null,
        //        ];
        //        $subjectTemplateParentResourcePath = '/' . implode('/', array_filter($chunks));

        parent::__construct(
            operations: [
                new Get(
                    uriTemplate: "/analyses/absolute_dating/$templateParentResourcePath/{id}",
                    provider: OneToOneAssociationItemProvider::class
                ),
                new GetCollection(
                    uriTemplate: "/analyses/absolute_dating/$templateParentResourcePath",
                ),
                //                new GetCollection(
                //                    uriTemplate: $subjectTemplateParentResourcePath,
                //                    uriVariables: [
                //                        'parentId' => new Link(
                //                            toProperty: 'subject',
                //                            fromClass: $subjectClass,
                //                        ),
                //                    ],
                //                    requirements: ['parentId' => '\d+'],
                //                ),
                new GetCollection(
                    uriTemplate: "/analyses/absolute_dating/{parentId}/$templateParentResourcePath",
                    uriVariables: [
                        'parentId' => new Link(
                            toProperty: 'analysis',
                            fromClass: $subjectClass
                        ),
                    ],
                    requirements: ['parentId' => '\d+'],
                ),
                new Post(
                    uriTemplate: "/analyses/absolute_dating/$templateParentResourcePath",
                    denormalizationContext: [
                        'groups' => ['abs_dating_analysis_join:create'],
                    ],
                    securityPostDenormalize: "is_granted('create', object)"
                ),
                new Patch(
                    uriTemplate: "/analyses/absolute_dating/$templateParentResourcePath/{id}",
                    denormalizationContext: [
                        'groups' => ['abs_dating_analysis_join:update'],
                    ],
                    security: "is_granted('update', object)",
                ),
                new Delete(
                    uriTemplate: "/analyses/absolute_dating/$templateParentResourcePath/{id}",
                    security: "is_granted('delete', object)",
                    output: false
                ),
            ],
            routePrefix: 'data',
            normalizationContext: [
                'groups' => [
                    'abs_dating_join:acl:read',
                    'analysis:acl:read',
                    'abs_dating_analysis_join:acl:read',
                    $slimSubjectGroup,
                ],
            ],
            //            order: ['analysis.id' => 'DESC'],
        );
    }
}

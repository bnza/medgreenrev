<?php

namespace App\Tests\Functional\Api\Resource;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Tests\Functional\Api\ApiTestProviderTrait;
use App\Tests\Functional\ApiTestRequestTrait;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ApiResourceBotanySeedTest extends ApiTestCase
{
    use ApiTestRequestTrait;
    use ApiTestProviderTrait;
    use AnalysisJoinDeleteTestTrait;

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

    public function testDeleteBotanySeedIsBlockedWhenReferencedByAnalysisJoin(): void
    {
        $this->assertDeleteIsBlockedByAnalysisJoin(
            joinCollectionPaths: ['/api/data/analyses/botany/seeds'],
            expectedShortClassNames: ['AnalysisBotanySeed'],
        );
    }
}

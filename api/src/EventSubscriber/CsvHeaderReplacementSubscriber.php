<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class CsvHeaderReplacementSubscriber implements EventSubscriberInterface
{
    /** @var array<string, array<string, string>>|null lazily loaded from config/csv_headers.php */
    private ?array $headerMappings = null;

    public function __construct(
        private readonly string $projectDir,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => ['onKernelResponse', EventPriorities::POST_RESPOND],
        ];
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        $request = $event->getRequest();

        if ('csv' !== $request->getRequestFormat()) {
            return;
        }

        $resourceClass = $request->attributes->get('_api_resource_class');
        if (null === $resourceClass) {
            return;
        }

        $mapping = $this->getMappingForClass($resourceClass);
        if (empty($mapping)) {
            return;
        }

        $response = $event->getResponse();
        $content = $response->getContent();

        if (false === $content || '' === $content) {
            return;
        }

        // Locate the end of the first line, handling both \n and \r\n
        $eolPos = strpos($content, "\n");
        if (false === $eolPos) {
            return;
        }

        // Everything before the \n; if line ending is \r\n it will end with \r
        $rawHeaderLine = substr($content, 0, $eolPos);
        $eolChar = str_ends_with($rawHeaderLine, "\r") ? "\r\n" : "\n";
        $trimmedHeaderLine = rtrim($rawHeaderLine, "\r");
        if ('' === $trimmedHeaderLine) {
            return;
        }
        $headers = str_getcsv($trimmedHeaderLine, separator: ',', enclosure: '"', escape: '');
        if ([] === $headers || in_array(null, $headers, true)) {
            return;
        }

        $replaced = array_map(
            static fn (string $h): string => $mapping[$h] ?? $h,
            $headers
        );

        // Rebuild the header line using fputcsv for correct quoting
        $stream = fopen('php://temp', 'r+');
        fputcsv($stream, $replaced, escape: '');
        rewind($stream);
        $newHeaderLine = rtrim((string) stream_get_contents($stream), "\r\n");
        fclose($stream);

        $response->setContent($newHeaderLine.$eolChar.substr($content, $eolPos + 1));
    }

    /**
     * @return array<string, string>
     */
    private function getMappingForClass(string $resourceClass): array
    {
        if (null === $this->headerMappings) {
            $configFile = $this->projectDir.'/config/csv_headers.php';
            $loaded = file_exists($configFile) ? require $configFile : [];
            $this->headerMappings = is_array($loaded) ? $loaded : [];
        }

        return $this->headerMappings[$resourceClass] ?? [];
    }
}

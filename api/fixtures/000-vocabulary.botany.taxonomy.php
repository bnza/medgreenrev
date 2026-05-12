<?php

use App\Entity\Vocabulary\Botany\Taxonomy;

$csvPath = __DIR__.'/vocabulary.botany.taxonomy.csv';
$csv = array_map('str_getcsv', file($csvPath));
array_shift($csv); // remove header

$fixtures = [];
$seenClasses = [];
$seenFamilies = [];
$seenGenera = [];

$toRefKey = static function (string $value): string {
    return 'botany_taxonomy_'.strtoupper(
        str_replace([' ', '.', '/'], ['_', '', '_'], trim($value))
    );
};

foreach ($csv as $row) {
    [$class, $family, $genus, $species, $spanish, $english] = array_pad($row, 6, '');

    // Class level
    $classRef = $toRefKey($class);
    if (!isset($seenClasses[$class])) {
        $seenClasses[$class] = true;
        $fixtures[$classRef] = [
            'value' => $class,
            'level' => 'class',
        ];
    }

    // Family level
    $fk = "$class|$family";
    $familyRef = $toRefKey($family);
    if (!isset($seenFamilies[$fk])) {
        $seenFamilies[$fk] = true;
        $fixtures[$familyRef] = [
            'value' => $family,
            'level' => 'family',
            'parent' => "@$classRef",
        ];
    }

    // Genus level
    $gk = "$fk|$genus";
    $genusRef = $toRefKey($genus);
    if (!isset($seenGenera[$gk])) {
        $seenGenera[$gk] = true;
        $fixtures[$genusRef] = [
            'value' => $genus,
            'level' => 'genus',
            'parent' => "@$familyRef",
        ];
    }

    // Species level
    $speciesRef = $toRefKey($genus.' '.$species);
    $speciesData = [
        'value' => $species,
        'level' => 'species',
        'parent' => "@$genusRef",
    ];
    if ($spanish) {
        $speciesData['spanishName'] = $spanish;
    }
    if ($english) {
        $speciesData['englishName'] = $english;
    }
    $fixtures[$speciesRef] = $speciesData;
}

return [
    Taxonomy::class => $fixtures,
];

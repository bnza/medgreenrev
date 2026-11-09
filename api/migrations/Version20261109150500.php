<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261109150500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Resolve history plant/animal spanish_name ambiguity';
    }

    public function up(Schema $schema): void
    {
        // ---------------------------------------------------------------
        // Botany (plants)
        // ---------------------------------------------------------------

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW vocabulary.vw_botany_taxonomy_name_lookup AS
                WITH english_branch AS (
                    SELECT
                        english_name AS value,
                        'english'::text AS language,
                        id AS resolved_taxonomy_id,
                        level,
                        english_name AS matched_english_name,
                        spanish_name AS matched_spanish_name
                    FROM vocabulary.vw_botany_taxonomy
                    WHERE english_name IS NOT NULL
                ),
                spanish_candidates AS (
                    SELECT *
                    FROM vocabulary.vw_botany_taxonomy
                    WHERE spanish_name IS NOT NULL
                ),
                spanish_grouped AS (
                    SELECT
                        spanish_name,
                        COUNT(*) AS match_count,
                        COUNT(DISTINCT genus_id) AS genus_count,
                        COUNT(DISTINCT family_id) AS family_count,
                        COUNT(DISTINCT class_id) AS class_count,
                        MIN(id) AS species_id,
                        MIN(genus_id) AS genus_id,
                        MIN(family_id) AS family_id,
                        MIN(class_id) AS class_id
                    FROM spanish_candidates
                    GROUP BY spanish_name
                ),
                spanish_branch AS (
                    SELECT
                        g.spanish_name AS value,
                        'spanish'::text AS language,
                        resolved.id AS resolved_taxonomy_id,
                        CASE
                            WHEN g.match_count = 1 THEN 'species'
                            WHEN g.genus_count = 1 THEN 'genus'
                            WHEN g.family_count = 1 THEN 'family'
                            WHEN g.class_count = 1 THEN 'class'
                            ELSE NULL
                        END AS level,
                        resolved.english_name AS matched_english_name,
                        g.spanish_name AS matched_spanish_name
                    FROM spanish_grouped g
                    LEFT JOIN vocabulary.vw_botany_taxonomy resolved ON resolved.id = CASE
                        WHEN g.match_count = 1 THEN g.species_id
                        WHEN g.genus_count = 1 THEN g.genus_id
                        WHEN g.family_count = 1 THEN g.family_id
                        WHEN g.class_count = 1 THEN g.class_id
                        ELSE NULL
                    END
                )
                SELECT value, language, resolved_taxonomy_id, level, matched_english_name, matched_spanish_name FROM english_branch
                UNION ALL
                SELECT value, language, resolved_taxonomy_id, level, matched_english_name, matched_spanish_name FROM spanish_branch
                SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW vocabulary.vw_botany_taxonomy_spanish_resolution AS
                SELECT DISTINCT ON (value)
                    value, language, resolved_taxonomy_id, level, matched_english_name, matched_spanish_name
                FROM vocabulary.vw_botany_taxonomy_name_lookup
                ORDER BY value, (language = 'english') DESC
                SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_history_plant_taxonomies AS
                SELECT
                    hp.id,
                    hp.id AS history_plant_id,
                    vt.id AS taxonomy_id,
                    vt.value,
                    vt.rank,
                    vt.species,
                    vt.genus,
                    vt.family,
                    vt.class,
                    vt.spanish_name,
                    vt.english_name,
                    vt.genus_id,
                    vt.family_id,
                    vt.class_id,
                    r.level,
                    r.language,
                    r.matched_english_name,
                    r.matched_spanish_name
                FROM history_plants hp
                -- plant (data) is matched against the unified english/spanish name resolver,
                -- which guarantees `value` is unique across both languages, keeping this join 1:1.
                LEFT JOIN vocabulary.vw_botany_taxonomy_spanish_resolution r ON r.value = hp.plant
                LEFT JOIN vocabulary.vw_botany_taxonomy vt ON vt.id = r.resolved_taxonomy_id
                SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_history_plants AS
                SELECT
                    p.id,
                    p.chronology_lower,
                    p.chronology_upper,
                    p.reference,
                    p.notes,
                    p.plant AS name,
                    p.location_id,
                    fp.value AS taxon,
                    fp.family AS family,
                    fp.class AS class,
                    fp.genus AS genus,
                    fp.species AS species,
                    l.value AS location_value,
                    r.value AS region,
                    l.the_geom
                FROM history_plants p
                JOIN vocabulary.history_locations l ON p.location_id = l.id
                JOIN vocabulary.regions r ON l.region_id = r.id
                LEFT JOIN vw_history_plant_taxonomies fp ON fp.id = p.id
                SQL
        );

        // Old geoserver view no longer depends on vw_history_plant, so it can now be dropped.
        $this->addSql('DROP VIEW IF EXISTS vw_history_plant;');

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW vw_history_plants AS
                WITH u AS (
                    SELECT value, language, resolved_taxonomy_id, level, matched_english_name, matched_spanish_name
                    FROM vocabulary.vw_botany_taxonomy_name_lookup
                    UNION ALL
                    -- Data values (already lowercased on write); no taxonomy match.
                    -- Skipped when the same text already resolves via the taxonomy name lookup above,
                    -- so a resolved value doesn't also appear as a bare, taxonomy-less duplicate.
                    SELECT hp.plant AS value, NULL::text AS language, NULL::integer AS resolved_taxonomy_id, NULL::text AS level, NULL::text AS matched_english_name, NULL::text AS matched_spanish_name
                    FROM history_plants hp
                    WHERE hp.plant IS NOT NULL
                      AND NOT EXISTS (
                          SELECT 1 FROM vocabulary.vw_botany_taxonomy_name_lookup nl WHERE nl.value = hp.plant
                      )
                )
                SELECT
                    MD5(u.value || '|' || COALESCE(u.language, '')) AS id,
                    u.value,
                    u.resolved_taxonomy_id AS taxonomy_id,
                    vt.value AS taxonomy,
                    u.level,
                    u.language,
                    u.matched_english_name,
                    u.matched_spanish_name
                FROM u
                LEFT JOIN vocabulary.vw_botany_taxonomy vt ON vt.id = u.resolved_taxonomy_id
                SQL
        );

        // ---------------------------------------------------------------
        // Zoo (animals)
        // ---------------------------------------------------------------

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW vocabulary.vw_zoo_taxonomy_name_lookup AS
                WITH english_branch AS (
                    SELECT
                        english_name AS value,
                        'english'::text AS language,
                        id AS resolved_taxonomy_id,
                        NULL::varchar(255) AS resolved_family,
                        NULL::varchar(255) AS resolved_class,
                        'species'::text AS level,
                        english_name AS matched_english_name,
                        spanish_name AS matched_spanish_name
                    FROM vocabulary.zoo_taxonomy
                    WHERE english_name IS NOT NULL
                ),
                spanish_candidates AS (
                    SELECT *
                    FROM vocabulary.zoo_taxonomy
                    WHERE spanish_name IS NOT NULL
                ),
                spanish_grouped AS (
                    SELECT
                        spanish_name,
                        COUNT(*) AS match_count,
                        COUNT(DISTINCT family) AS family_count,
                        COUNT(DISTINCT class) AS class_count,
                        MIN(id) AS species_id,
                        MIN(family) AS family_value,
                        MIN(class) AS class_value
                    FROM spanish_candidates
                    GROUP BY spanish_name
                ),
                spanish_branch AS (
                    SELECT
                        g.spanish_name AS value,
                        'spanish'::text AS language,
                        CASE WHEN g.match_count = 1 THEN resolved.id ELSE NULL END AS resolved_taxonomy_id,
                        CASE WHEN g.match_count > 1 AND g.family_count = 1 THEN g.family_value ELSE NULL END::varchar(255) AS resolved_family,
                        CASE WHEN g.match_count > 1 AND g.family_count > 1 AND g.class_count = 1 THEN g.class_value ELSE NULL END::varchar(255) AS resolved_class,
                        CASE
                            WHEN g.match_count = 1 THEN 'species'
                            WHEN g.family_count = 1 THEN 'family'
                            WHEN g.class_count = 1 THEN 'class'
                            ELSE NULL
                        END AS level,
                        resolved.english_name AS matched_english_name,
                        g.spanish_name AS matched_spanish_name
                    FROM spanish_grouped g
                    LEFT JOIN vocabulary.zoo_taxonomy resolved ON g.match_count = 1 AND resolved.id = g.species_id
                )
                SELECT value, language, resolved_taxonomy_id, resolved_family, resolved_class, level, matched_english_name, matched_spanish_name FROM english_branch
                UNION ALL
                SELECT value, language, resolved_taxonomy_id, resolved_family, resolved_class, level, matched_english_name, matched_spanish_name FROM spanish_branch
                SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW vocabulary.vw_zoo_taxonomy_spanish_resolution AS
                SELECT DISTINCT ON (value)
                    value, language, resolved_taxonomy_id, resolved_family, resolved_class, level, matched_english_name, matched_spanish_name
                FROM vocabulary.vw_zoo_taxonomy_name_lookup
                ORDER BY value, (language = 'english') DESC
                SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_history_animal_taxonomies AS
                SELECT
                    ha.id,
                    ha.id AS history_animal_id,
                    r.resolved_taxonomy_id AS taxonomy_id,
                    zt.value,
                    zt.english_name,
                    zt.spanish_name,
                    COALESCE(zt.class, r.resolved_class) AS class,
                    COALESCE(zt.family, r.resolved_family) AS family,
                    r.level,
                    r.language,
                    r.matched_english_name,
                    r.matched_spanish_name
                FROM history_animals ha
                -- animal (data) is matched against the unified english/spanish name resolver,
                -- which guarantees `value` is unique across both languages, keeping this join 1:1.
                LEFT JOIN vocabulary.vw_zoo_taxonomy_spanish_resolution r ON r.value = ha.animal
                LEFT JOIN vocabulary.zoo_taxonomy zt ON zt.id = r.resolved_taxonomy_id
                SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_history_animals AS
                SELECT
                    a.id,
                    a.chronology_lower,
                    a.chronology_upper,
                    a.reference,
                    a.notes,
                    a.animal AS name,
                    a.location_id,
                    fa.value AS value,
                    fa.family AS family,
                    fa.class AS class,
                    fa.english_name AS english_name,
                    fa.spanish_name AS spanish_name,
                    l.value AS location_value,
                    r.value AS region,
                    l.the_geom
                FROM history_animals a
                JOIN vocabulary.history_locations l ON a.location_id = l.id
                JOIN vocabulary.regions r ON l.region_id = r.id
                LEFT JOIN vw_history_animal_taxonomies fa ON fa.id = a.id
                SQL
        );

        // Old geoserver view no longer depends on vw_history_animal, so it can now be dropped.
        $this->addSql('DROP VIEW IF EXISTS vw_history_animal;');

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW vw_history_animals AS
                WITH u AS (
                    SELECT value, language, resolved_taxonomy_id, level, matched_english_name, matched_spanish_name
                    FROM vocabulary.vw_zoo_taxonomy_name_lookup
                    UNION ALL
                    -- Data values (already lowercased on write); no taxonomy match.
                    -- Skipped when the same text already resolves via the taxonomy name lookup above,
                    -- so a resolved value doesn't also appear as a bare, taxonomy-less duplicate.
                    SELECT ha.animal AS value, NULL::text AS language, NULL::smallint AS resolved_taxonomy_id, NULL::text AS level, NULL::text AS matched_english_name, NULL::text AS matched_spanish_name
                    FROM history_animals ha
                    WHERE ha.animal IS NOT NULL
                      AND NOT EXISTS (
                          SELECT 1 FROM vocabulary.vw_zoo_taxonomy_name_lookup nl WHERE nl.value = ha.animal
                      )
                )
                SELECT
                    MD5(u.value || '|' || COALESCE(u.language, '')) AS id,
                    u.value,
                    u.resolved_taxonomy_id AS taxonomy_id,
                    zt.value as taxonomy,
                    u.level,
                    u.language,
                    u.matched_english_name,
                    u.matched_spanish_name
                FROM u
                LEFT JOIN vocabulary.zoo_taxonomy zt ON u.resolved_taxonomy_id = zt.id
                SQL
        );
    }

    public function down(Schema $schema): void
    {
        // Recreate the original vw_history_plant/vw_history_animal first, since the geoserver
        // views below must reference an existing view, and the picklist views are dropped
        // (not replaced) further down because Postgres forbids removing columns via REPLACE.
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_history_plant AS
                SELECT
                    hp.id,
                    hp.id AS history_plant_id,
                    vt.id AS taxonomy_id,
                    vt.value,
                    vt.level,
                    vt.rank,
                    vt.species,
                    vt.genus,
                    vt.family,
                    vt.class,
                    vt.spanish_name,
                    vt.english_name,
                    vt.genus_id,
                    vt.family_id,
                    vt.class_id
                FROM history_plants hp
                -- english_name (taxonomy) and plant (data) are both lowercased on write
                -- and english_name is unique, so a plain equality keeps the view 1:1.
                LEFT JOIN vocabulary.vw_botany_taxonomy vt
                    ON vt.english_name = hp.plant
                SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_history_animal AS
                SELECT
                    ha.id,
                    ha.id AS history_animal_id,
                    zt.id AS taxonomy_id,
                    zt.value,
                    zt.english_name,
                    zt.spanish_name,
                    zt.class,
                    zt.family
                FROM history_animals ha
                -- english_name (taxonomy) and animal (data) are both lowercased on write
                -- and english_name is unique, so a plain equality keeps the view 1:1.
                LEFT JOIN vocabulary.zoo_taxonomy zt
                    ON zt.english_name = ha.animal
                SQL
        );

        // Repoint the geoserver views back to vw_history_plant/vw_history_animal before the
        // renamed vw_history_plant_taxonomies/vw_history_animal_taxonomies views are dropped.
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_history_plants AS
                SELECT
                    p.id,
                    p.chronology_lower,
                    p.chronology_upper,
                    p.reference,
                    p.notes,
                    p.plant AS name,
                    p.location_id,
                    fp.value AS taxon,
                    fp.family AS family,
                    fp.class AS class,
                    fp.genus AS genus,
                    fp.species AS species,
                    l.value AS location_value,
                    r.value AS region,
                    l.the_geom
                FROM history_plants p
                JOIN vocabulary.history_locations l ON p.location_id = l.id
                JOIN vocabulary.regions r ON l.region_id = r.id
                LEFT JOIN vw_history_plant fp ON fp.id = p.id
                SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_history_animals AS
                SELECT
                    a.id,
                    a.chronology_lower,
                    a.chronology_upper,
                    a.reference,
                    a.notes,
                    a.animal AS name,
                    a.location_id,
                    fa.value AS value,
                    fa.family AS family,
                    fa.class AS class,
                    fa.english_name AS english_name,
                    fa.spanish_name AS spanish_name,
                    l.value AS location_value,
                    r.value AS region,
                    l.the_geom
                FROM history_animals a
                JOIN vocabulary.history_locations l ON a.location_id = l.id
                JOIN vocabulary.regions r ON l.region_id = r.id
                LEFT JOIN vw_history_animal fa ON fa.id = a.id
                SQL
        );

        $this->addSql('DROP VIEW IF EXISTS vw_history_plant_taxonomies;');
        $this->addSql('DROP VIEW IF EXISTS vw_history_animal_taxonomies;');

        // CREATE OR REPLACE cannot drop columns, so the picklist views are dropped and
        // recreated with their original (smaller) column list instead of being replaced.
        $this->addSql('DROP VIEW IF EXISTS vw_history_plants;');
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_history_plants AS
                WITH u AS (
                    -- Taxonomy english names (already lowercased on write); match.
                    SELECT english_name AS value
                    FROM vocabulary.botany_taxonomy
                    WHERE english_name IS NOT NULL
                    UNION
                    -- Data values (already lowercased on write); no taxonomy match.
                    SELECT plant AS value
                    FROM history_plants
                )
                SELECT
                    MD5(u.value) AS id,
                    u.value,
                    vt.id AS taxonomy_id,
                    vt.value as taxonomy
                FROM u
                LEFT JOIN vocabulary.vw_botany_taxonomy vt ON u.value = vt.english_name
                SQL
        );

        $this->addSql('DROP VIEW IF EXISTS vw_history_animals;');
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_history_animals AS
                WITH u AS (
                    -- Taxonomy english names (already lowercased on write); match.
                    SELECT english_name AS value
                    FROM vocabulary.zoo_taxonomy
                    WHERE english_name IS NOT NULL
                    UNION
                    -- Data values (already lowercased on write); no taxonomy match.
                    SELECT animal AS value
                    FROM history_animals
                )
                SELECT
                    MD5(u.value) AS id,
                    u.value,
                    vt.id AS taxonomy_id,
                    vt.value as taxonomy
                FROM u
                LEFT JOIN vocabulary.zoo_taxonomy vt ON u.value = vt.english_name
                SQL
        );

        // Drop the new resolver/lookup views in dependency order
        // (spanish_resolution depends on name_lookup, so it must be dropped first).
        $this->addSql('DROP VIEW IF EXISTS vocabulary.vw_botany_taxonomy_spanish_resolution;');
        $this->addSql('DROP VIEW IF EXISTS vocabulary.vw_botany_taxonomy_name_lookup;');
        $this->addSql('DROP VIEW IF EXISTS vocabulary.vw_zoo_taxonomy_spanish_resolution;');
        $this->addSql('DROP VIEW IF EXISTS vocabulary.vw_zoo_taxonomy_name_lookup;');
    }
}

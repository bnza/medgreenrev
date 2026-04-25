<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250628091340 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create API views';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(
            <<<'SQL'
                            CREATE OR REPLACE VIEW vocabulary.vw_botany_taxonomy_classes AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT DISTINCT class AS original_value
                                FROM vocabulary.botany_taxonomy
                                WHERE class IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE OR REPLACE VIEW vocabulary.vw_botany_taxonomy_families AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT DISTINCT family AS original_value
                                FROM vocabulary.botany_taxonomy
                                WHERE family IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE OR REPLACE VIEW vocabulary.vw_zoo_taxonomy_classes AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT DISTINCT class AS original_value
                                FROM vocabulary.zoo_taxonomy
                                WHERE class IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE OR REPLACE VIEW vocabulary.vw_zoo_taxonomy_families AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT DISTINCT family AS original_value
                                FROM vocabulary.zoo_taxonomy
                                WHERE family IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE OR REPLACE VIEW vw_areas AS
                            WITH DistinctValues AS (
                                SELECT DISTINCT sus.site_id AS site_id, sus.area AS original_value
                                FROM sus
                                WHERE sus.area IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(DistinctValues.site_id || original_value) AS id,
                                site_id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE OR REPLACE VIEW vw_buildings AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT DISTINCT sus.site_id, sus.area, sus.building
                                FROM sus
                                WHERE sus.building IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(DistinctValues.site_id ||DistinctValues.area || DistinctValues.building) AS id,
                                site_id,
                                area,
                                building AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE OR REPLACE VIEW vw_context_types AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT DISTINCT LOWER(type) AS original_value
                                FROM contexts
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE VIEW vw_analysis_laboratories AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT
                                DISTINCT laboratory AS original_value FROM analyses
                                WHERE laboratory IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE VIEW vw_history_references AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT
                                DISTINCT reference AS original_value FROM history_plants
                                WHERE reference IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE VIEW vw_persons AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT
                                    DISTINCT field_director as original_value FROM archaeological_sites
                                    WHERE field_director IS NOT NULL
                                UNION
                                SELECT
                                    DISTINCT responsible as original_value FROM analyses
                                    WHERE responsible IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE VIEW vw_calibration_curves AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT
                                    DISTINCT calibration_curve as original_value FROM vw_abs_dating_analyses
                                    WHERE calibration_curve IS NOT NULL
                                UNION
                                    SELECT 'N/D'::varchar as original_value
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE VIEW vw_stratigraphic_units_relationships AS
                            SELECT
                            id, lft_su_id, relationship_id, rgt_su_id FROM stratigraphic_units_relationships
                            UNION
                            SELECT sr.id*-1, sr.rgt_su_id as lft_su_id, r.inverted_by_id, sr.lft_su_id as rgt_su_id FROM stratigraphic_units_relationships sr
                            LEFT JOIN vocabulary.su_relationships r ON sr.relationship_id::char = r.id::char;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    CREATE RULE vw_stratigraphic_units_relationships_insert_rule AS ON INSERT TO vw_stratigraphic_units_relationships DO INSTEAD
                    INSERT INTO stratigraphic_units_relationships
                    (
                        id,
                        lft_su_id,
                        rgt_su_id,
                        relationship_id
                    )
                    VALUES
                    (
                        nextval('stratigraphic_units_relationships_id_seq'),
                        NEW.lft_su_id,
                        NEW.rgt_su_id,
                        NEW.relationship_id
                    )
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    CREATE RULE vw_stratigraphic_units_relationships_delete_rule AS ON DELETE TO vw_stratigraphic_units_relationships DO INSTEAD
                    DELETE FROM stratigraphic_units_relationships WHERE id = ABS(OLD.id)
                SQL
        );

        $this->addSql(
            <<<'SQL'
                            CREATE OR REPLACE VIEW vw_pottery_colors AS
                            WITH DistinctValues AS (
                                -- Step 1: Find the unique, input values.
                                SELECT
                                    DISTINCT inner_color AS original_value FROM potteries
                                    WHERE inner_color IS NOT NULL
                                UNION
                                SELECT
                                    DISTINCT outer_color AS original_value FROM potteries
                                    WHERE outer_color IS NOT NULL
                            )
                            -- Step 2: Calculate the MD5 hash once for each unique type.
                            SELECT
                                MD5(original_value) AS id,
                                original_value AS value
                            FROM
                                DistinctValues
                SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_su_code AS
                SELECT
                    su.id,
                    su.id AS su_id,
                    generate_code_su(s.code, su.year, su.number) AS code
                FROM sus su
                JOIN archaeological_sites s ON s.id = su.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_individual_code AS
                SELECT
                    i.id,
                    i.id AS individual_id,
                    generate_code_individual(s.code, i.identifier) AS code
                FROM individuals i
                JOIN sus su ON su.id = i.stratigraphic_unit_id
                JOIN archaeological_sites s ON s.id = su.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_mu_code AS
                SELECT
                    m.id,
                    m.id AS mu_id,
                    generate_code_mu(s.code, su.year, su.number, m.identifier) AS code
                FROM mus m
                JOIN sus su ON su.id = m.stratigraphic_unit_id
                JOIN archaeological_sites s ON s.id = su.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_sample_code AS
                SELECT
                    sa.id,
                    sa.id AS sample_id,
                    generate_code_sample(s.code, vt.code, sa.year, sa.number) AS code
                FROM samples sa
                JOIN archaeological_sites s ON s.id = sa.site_id
                JOIN vocabulary.sample_types vt ON vt.id = sa.type_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_sampling_su_code AS
                SELECT
                    ssu.id,
                    ssu.id AS sampling_su_id,
                    generate_code_sampling_su(ss.code, ssu.number) AS code
                FROM sampling_sus ssu
                JOIN sampling_sites ss ON ss.id = ssu.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_sediment_core_code AS
                SELECT
                    sc.id,
                    sc.id AS sediment_core_id,
                    generate_code_sediment_core(s.code, sc.year, sc.number) AS code
                FROM sediment_cores sc
                JOIN archaeological_sites s ON s.id = sc.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_sediment_core_depth_code AS
                SELECT
                    scd.id,
                    scd.id AS sediment_core_depth_id,
                    generate_code_sediment_core_depth(s.code, sc.year, sc.number, scd.depth_min) AS code
                FROM sediment_core_depths scd
                JOIN sediment_cores sc ON sc.id = scd.sediment_core_id
                JOIN archaeological_sites s ON s.id = sc.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_paleoclimate_sample_code AS
                SELECT
                    ps.id,
                    ps.id AS paleoclimate_sample_id,
                    generate_code_paleoclimate_sample(pss.code, ps.number) AS code
                FROM paleoclimate_sample ps
                JOIN paleoclimate_sampling_sites pss ON pss.id = ps.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_pottery_code AS
                SELECT
                    p.id,
                    p.id AS pottery_id,
                    generate_code_pottery(s.code, p.inventory) AS code
                FROM potteries p
                JOIN sus su ON su.id = p.stratigraphic_unit_id
                JOIN archaeological_sites s ON s.id = su.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_botany_charcoal_code AS
                SELECT
                    bc.id,
                    bc.id AS botany_charcoal_id,
                    generate_code_botany_charcoal(s.code, bc.id) AS code
                FROM botany_charcoals bc
                JOIN sus su ON su.id = bc.stratigraphic_unit_id
                JOIN archaeological_sites s ON s.id = su.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_botany_seed_code AS
                SELECT
                    bs.id,
                    bs.id AS botany_seed_id,
                    generate_code_botany_seed(s.code, bs.id) AS code
                FROM botany_seeds bs
                JOIN sus su ON su.id = bs.stratigraphic_unit_id
                JOIN archaeological_sites s ON s.id = su.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_zoo_bone_code AS
                SELECT
                    zb.id,
                    zb.id AS zoo_bone_id,
                    generate_code_zoo_bone(s.code, zb.id) AS code
                FROM zoo_bones zb
                JOIN sus su ON su.id = zb.stratigraphic_unit_id
                JOIN archaeological_sites s ON s.id = su.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_zoo_tooth_code AS
                SELECT
                    zt.id,
                    zt.id AS zoo_tooth_id,
                    generate_code_zoo_tooth(s.code, zt.id) AS code
                FROM zoo_teeth zt
                JOIN sus su ON su.id = zt.stratigraphic_unit_id
                JOIN archaeological_sites s ON s.id = su.site_id;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE VIEW vw_analysis_code AS
                SELECT
                    a.id,
                    a.id AS analysis_id,
                    generate_code_analysis(vt.code, a.year, a.identifier) AS code
                FROM analyses a
                JOIN vocabulary.analysis_types vt ON vt.id = a.analysis_type_id;
            SQL
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP VIEW vocabulary.vw_botany_taxonomy_classes;');
        $this->addSql('DROP VIEW vocabulary.vw_botany_taxonomy_families;');
        $this->addSql('DROP VIEW vocabulary.vw_zoo_taxonomy_classes;');
        $this->addSql('DROP VIEW vocabulary.vw_zoo_taxonomy_families;');
        $this->addSql('DROP VIEW vw_analysis_laboratories;');
        $this->addSql('DROP VIEW vw_areas;');
        $this->addSql('DROP VIEW IF EXISTS vw_analysis_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_zoo_tooth_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_zoo_bone_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_botany_seed_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_botany_charcoal_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_pottery_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_paleoclimate_sample_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_sediment_core_depth_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_sediment_core_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_sampling_su_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_sample_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_mu_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_individual_code;');
        $this->addSql('DROP VIEW IF EXISTS vw_su_code;');
        $this->addSql('DROP VIEW vw_buildings;');
        $this->addSql('DROP VIEW vw_calibration_curves;');
        $this->addSql('DROP VIEW vw_context_types;');
        $this->addSql('DROP VIEW vw_history_references;');
        $this->addSql('DROP VIEW vw_persons;');
        $this->addSql('DROP VIEW vw_pottery_colors;');
        $this->addSql('DROP VIEW vw_stratigraphic_units_relationships;');
    }
}

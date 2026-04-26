<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260323152247 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create `geoserver` views';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA IF NOT EXISTS geoserver;');
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_archaeological_sites AS
                SELECT
                    s.id,
                    s.code,
                    s.name,
                    s.description,
                    s.chronology_lower,
                    s.chronology_upper,
                    s.field_director,
                    r.value AS region,
                    s.the_geom
                FROM archaeological_sites s
                JOIN vocabulary.regions r ON s.region_id = r.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_sampling_sites AS
                SELECT
                    s.id,
                    s.code,
                    s.name,
                    s.description,
                    r.value AS region,
                    s.the_geom
                FROM sampling_sites s
                JOIN vocabulary.regions r ON s.region_id = r.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_history_locations AS
                SELECT
                    l.id,
                    l.value,
                    r.value AS region,
                    l.the_geom
                FROM vocabulary.history_locations l
                JOIN vocabulary.regions r ON l.region_id = r.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_potteries AS
                SELECT
                    p.id,
                    p.inventory,
                    p.inner_color,
                    p.outer_color,
                    p.decoration_motif,
                    p.chronology_lower,
                    p.chronology_upper,
                    p.notes,
                    st.value AS surface_treatment,
                    cc.value AS cultural_context,
                    sh.value AS shape,
                    fg.value AS functional_group,
                    ff.value AS functional_form,
                    su.site_id,
                    s.code AS site_code,
                    s.name AS site_name,
                    s.the_geom,
                    generate_code_su(s.code, su.year, su.number) AS su_code
                FROM potteries p
                JOIN sus su ON p.stratigraphic_unit_id = su.id
                JOIN archaeological_sites s ON su.site_id = s.id
                LEFT JOIN vocabulary.surface_treatment st ON p.surface_treatment_id = st.id
                LEFT JOIN vocabulary.cultural_contexts cc ON p.cultural_context_id = cc.id
                LEFT JOIN vocabulary.pottery_shapes sh ON p.part_id = sh.id
                LEFT JOIN vocabulary.pottery_functional_forms ff ON p.functional_form_id = ff.id
                LEFT JOIN vocabulary.pottery_functional_groups fg ON ff.functional_group_id = fg.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_individuals AS
                SELECT
                    i.id, i.identifier, sex.value AS sex, age.value AS age, i.notes,
                    su.site_id, s.code AS site_code, s.name AS site_name, s.the_geom,
                    generate_code_su(s.code, su.year, su.number) AS su_code
                FROM individuals i
                JOIN sus su ON i.stratigraphic_unit_id = su.id
                JOIN archaeological_sites s ON su.site_id = s.id
                LEFT JOIN vocabulary.individual_sexes sex ON i.sex_id = sex.id
                LEFT JOIN vocabulary.individual_ages age ON i.age_id = age.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_mus AS
                SELECT
                    m.id, m.identifier, m.notes,
                    su.site_id, s.code AS site_code, s.name AS site_name, s.the_geom,
                    generate_code_su(s.code, su.year, su.number) AS su_code
                FROM mus m
                JOIN sus su ON m.stratigraphic_unit_id = su.id
                JOIN archaeological_sites s ON su.site_id = s.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_zoo_bones AS
                SELECT
                    b.id, vep.code AS ends_preserved, vbs.code AS side, b.notes,
                    vt.code AS taxonomy, vbe.code AS element, vbp.code AS part,
                    su.site_id, s.code AS site_code, s.name AS site_name, s.the_geom,
                    generate_code_su(s.code, su.year, su.number) AS su_code
                FROM zoo_bones b
                JOIN sus su ON b.stratigraphic_unit_id = su.id
                JOIN archaeological_sites s ON su.site_id = s.id
                LEFT JOIN vocabulary.zoo_bone_end_preserved vep ON b.voc_bone_end_preserved_id = vep.id
                LEFT JOIN vocabulary.zoo_bone_sides vbs ON b.voc_bone_side_id = vbs.id
                LEFT JOIN vocabulary.zoo_taxonomy vt ON b.voc_taxonomy_id = vt.id
                LEFT JOIN vocabulary.zoo_bones vbe ON b.voc_bone_id = vbe.id
                LEFT JOIN vocabulary.zoo_bone_parts vbp ON b.voc_bone_part_id = vbp.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_zoo_teeth AS
                SELECT
                    t.id, t.connected, vbs.code AS side, t.notes,
                    vt.code AS taxonomy, vte.code AS element,
                    su.site_id, s.code AS site_code, s.name AS site_name, s.the_geom,
                    generate_code_su(s.code, su.year, su.number) AS su_code
                FROM zoo_teeth t
                JOIN sus su ON t.stratigraphic_unit_id = su.id
                JOIN archaeological_sites s ON su.site_id = s.id
                LEFT JOIN vocabulary.zoo_bone_sides vbs ON t.voc_bone_side_id = vbs.id
                LEFT JOIN vocabulary.zoo_taxonomy vt ON t.voc_taxonomy_id = vt.id
                LEFT JOIN vocabulary.zoo_bones vte ON t.voc_tooth_id = vte.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_botany_charcoals AS
                SELECT
                    c.id, c.notes,
                    c.voc_taxonomy_id AS taxonomy_id, c.voc_element_id AS element_id, c.voc_element_part_id AS part_id,
                    su.site_id, s.code AS site_code, s.name AS site_name, s.the_geom,
                    generate_code_su(s.code, su.year, su.number) AS su_code
                FROM botany_charcoals c
                JOIN sus su ON c.stratigraphic_unit_id = su.id
                JOIN archaeological_sites s ON su.site_id = s.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_botany_seeds AS
                SELECT
                    s_seed.id, s_seed.notes,
                    s_seed.voc_taxonomy_id AS taxonomy_id, s_seed.voc_element_id AS element_id, s_seed.voc_element_part_id AS part_id,
                    su.site_id, s.code AS site_code, s.name AS site_name, s.the_geom,
                    generate_code_su(s.code, su.year, su.number) AS su_code
                FROM botany_seeds s_seed
                JOIN sus su ON s_seed.stratigraphic_unit_id = su.id
                JOIN archaeological_sites s ON su.site_id = s.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_paleoclimate_sampling_sites AS
                SELECT
                    s.id,
                    s.code,
                    s.name,
                    s.description,
                    r.value AS region,
                    s.the_geom
                FROM paleoclimate_sampling_sites s
                JOIN vocabulary.regions r ON s.region_id = r.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_paleoclimate_samples AS
                SELECT
                    p.id, s.code || '.' || p.number AS code, p.number, p.description,
                    p.chronology_lower, p.chronology_upper, p.length,
                    p.temperature_record, p.precipitation_record,
                    p.stable_isotopes, p.trace_elements,
                    p.petrographic_descriptions, p.fluid_inclusions,
                    p.site_id, s.code AS site_code, s.name AS site_name, s.the_geom
                FROM paleoclimate_sample p
                JOIN paleoclimate_sampling_sites s ON p.site_id = s.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_sediment_cores AS
                SELECT
                    sc.id, s.code || '.SC.' || RIGHT(sc.year::text, 2) || '.' || sc.number AS code,
                    sc.year, sc.number, sc.description,
                    sc.site_id, s.code AS site_code, s.name AS site_name, s.the_geom
                FROM sediment_cores sc
                JOIN sampling_sites s ON sc.site_id = s.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_sediment_core_depths AS
                SELECT
                    d.id, d.sediment_core_id, d.su_id,
                    d.depth_min, d.depth_max, d.notes,
                    d.pollen, d.sedimentary_dna, d.phytoliths,
                    d.geochemistry, d.organic_chemistry, d.plant_macro_remains,
                    d.osl_dating, d.micro_charcoal,
                    sc.site_id, s.code AS site_code, s.name AS site_name, s.the_geom
                FROM sediment_core_depths d
                JOIN sediment_cores sc ON d.sediment_core_id = sc.id
                JOIN sampling_sites s ON sc.site_id = s.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_history_animals AS
                SELECT
                    a.id, a.chronology_lower, a.chronology_upper, a.reference, a.notes,
                    a.animal_id, a.location_id,
                    l.value AS location_value, r.value AS region, l.the_geom
                FROM history_animals a
                JOIN vocabulary.history_locations l ON a.location_id = l.id
                JOIN vocabulary.regions r ON l.region_id = r.id;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_history_plants AS
                SELECT
                    p.id, p.chronology_lower, p.chronology_upper, p.reference, p.notes,
                    p.plant_id, p.location_id,
                    l.value AS location_value, r.value AS region, l.the_geom
                FROM history_plants p
                JOIN vocabulary.history_locations l ON p.location_id = l.id
                JOIN vocabulary.regions r ON l.region_id = r.id;
            SQL
        );

        // Stratigraphic Units (from archaeological sites)
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_stratigraphic_units AS
                SELECT
                    su.id,
                    generate_code_su(s.code, su.year, su.number) AS code,
                    su.site_id,
                    su.year,
                    su.number,
                    su.chronology_lower,
                    su.chronology_upper,
                    su.description,
                    su.interpretation,
                    su.area,
                    su.building,
                    s.code AS site_code,
                    s.name AS site_name,
                    s.the_geom
                FROM sus su
                JOIN archaeological_sites s ON su.site_id = s.id;
            SQL
        );

        // Sampling Stratigraphic Units (from sampling sites)
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE VIEW geoserver.vw_sampling_stratigraphic_units AS
                SELECT
                    ssu.id,
                    generate_code_sampling_su(ss.code, ssu.number) AS code,
                    ssu.site_id,
                    ssu.number,
                    ssu.chronology_lower,
                    ssu.chronology_upper,
                    ssu.description,
                    ssu.interpretation,
                    ss.code AS site_code,
                    ss.name AS site_name,
                    ss.the_geom
                FROM sampling_sus ssu
                JOIN sampling_sites ss ON ssu.site_id = ss.id;
            SQL
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP SCHEMA IF EXISTS geoserver CASCADE;');
    }
}

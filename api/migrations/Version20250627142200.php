<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250627142200 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Set tables checks, triggers, functions';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(
            <<<'SQL'
                     ALTER TABLE archaeological_sites ADD CONSTRAINT chk_chronology CHECK (chronology_upper IS NULL OR chronology_lower IS NULL OR chronology_upper >= chronology_lower);
                SQL
        );

        $this->addSql(
            <<<'SQL'
                     ALTER TABLE sediment_core_depths ADD CONSTRAINT chk_chronology CHECK (depth_min IS NULL OR depth_max IS NULL OR depth_max > depth_min);
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    CREATE OR REPLACE FUNCTION validate_context_stratigraphic_units_site()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        IF (SELECT site_id FROM sus WHERE id = NEW.su_id) !=
                           (SELECT site_id FROM contexts WHERE id = NEW.context_id) THEN
                            RAISE EXCEPTION 'Stratigraphic unit and context must belong to the same site';
                        END IF;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;

                SQL
        );

        $this->addSql(
            <<<'SQL'
                    CREATE TRIGGER trg_enforce_context_stratigraphic_unit_site_consistency
                    BEFORE INSERT OR UPDATE ON context_stratigraphic_units
                    FOR EACH ROW EXECUTE FUNCTION validate_context_stratigraphic_units_site();
                SQL
        );

        // Enforce: sample_stratigraphic_units.sample_id site == sus.site_id
        $this->addSql(
            <<<'SQL'
                    CREATE OR REPLACE FUNCTION validate_sample_stratigraphic_units_site()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        IF (SELECT site_id FROM samples WHERE id = NEW.sample_id) !=
                           (SELECT site_id FROM sus     WHERE id = NEW.su_id) THEN
                            RAISE EXCEPTION 'Sample and stratigraphic unit must belong to the same site';
                        END IF;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    CREATE TRIGGER trg_enforce_sample_stratigraphic_unit_site_consistency
                    BEFORE INSERT OR UPDATE ON sample_stratigraphic_units
                    FOR EACH ROW EXECUTE FUNCTION validate_sample_stratigraphic_units_site();
                SQL
        );

        // Enforce: sediment_core_stratigraphic_units.sample_id site == sus.site_id
        $this->addSql(
            <<<'SQL'
                    CREATE OR REPLACE FUNCTION validate_sediment_core_stratigraphic_units_site()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        IF (SELECT site_id FROM sediment_cores WHERE id = NEW.sediment_core_id) !=
                           (SELECT site_id FROM sus     WHERE id = NEW.su_id) THEN
                            RAISE EXCEPTION 'Sediment core and stratigraphic unit must belong to the same site';
                        END IF;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    CREATE TRIGGER validate_sediment_core_stratigraphic_units_site
                    BEFORE INSERT OR UPDATE ON sample_stratigraphic_units
                    FOR EACH ROW EXECUTE FUNCTION validate_sample_stratigraphic_units_site();
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    CREATE OR REPLACE FUNCTION unaccent_immutable(text)
                    RETURNS text
                    AS $$
                      SELECT public.unaccent('public.unaccent', $1);
                    $$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;
                SQL
        );

        // Enforce: when type_group = 'absolute dating', id must be between 100 and 199 (inclusive)
        $this->addSql(
            <<<'SQL'
                    ALTER TABLE vocabulary.analysis_types
                    ADD CONSTRAINT chk_analysis_types_absdating_id_range
                    CHECK (type_group <> 'absolute dating' OR (id >= 100 AND id <= 199));
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    COMMENT ON CONSTRAINT chk_analysis_types_absdating_id_range ON vocabulary.analysis_types
                    IS 'If type_group = ''absolute dating'', then id must be between 100 and 199 inclusive';
                SQL
        );

        // Enforce: pottery.inventory must be unique within the same site
        $this->addSql(
            <<<'SQL'
                    CREATE OR REPLACE FUNCTION validate_pottery_inventory_site_uniqueness()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        IF EXISTS (
                            SELECT 1
                            FROM potteries p
                            JOIN sus s ON p.stratigraphic_unit_id = s.id
                            WHERE p.inventory = NEW.inventory
                              AND p.id != NEW.id
                              AND s.site_id = (SELECT site_id FROM sus WHERE id = NEW.stratigraphic_unit_id)
                        ) THEN
                            RAISE EXCEPTION 'Pottery inventory % must be unique within the same site', NEW.inventory;
                        END IF;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    CREATE TRIGGER trg_enforce_pottery_inventory_site_uniqueness
                    BEFORE INSERT OR UPDATE ON potteries
                    FOR EACH ROW EXECUTE FUNCTION validate_pottery_inventory_site_uniqueness();
                SQL
        );

        // Enforce: individual.identifier must be unique within the same site
        $this->addSql(
            <<<'SQL'
                    CREATE OR REPLACE FUNCTION validate_individual_identifier_site_uniqueness()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        IF EXISTS (
                            SELECT 1
                            FROM individuals i
                            JOIN sus s ON i.stratigraphic_unit_id = s.id
                            WHERE i.identifier = NEW.identifier
                              AND i.id != NEW.id
                              AND s.site_id = (SELECT site_id FROM sus WHERE id = NEW.stratigraphic_unit_id)
                        ) THEN
                            RAISE EXCEPTION 'Individual identifier % must be unique within the same site', NEW.identifier;
                        END IF;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    CREATE TRIGGER trg_enforce_individual_identifier_site_uniqueness
                    BEFORE INSERT OR UPDATE ON individuals
                    FOR EACH ROW EXECUTE FUNCTION validate_individual_identifier_site_uniqueness();
                SQL
        );

        // Enforce: at least one join row on sample_stratigraphic_units
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION check_last_sample_stratigraphic_unit()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM samples WHERE id = OLD.sample_id) THEN
                        RETURN OLD;  -- parent is gone, cascade is fine
                    END IF;
                    IF NOT EXISTS (
                        SELECT 1 FROM sample_stratigraphic_units
                        WHERE sample_id = OLD.sample_id AND id != OLD.id
                    ) THEN
                        RAISE EXCEPTION 'Cannot delete the last stratigraphic unit for sample %', OLD.sample_id;
                    END IF;
                    RETURN OLD;
                END;
                $$ LANGUAGE plpgsql;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE CONSTRAINT TRIGGER trg_check_last_sample_stratigraphic_unit
                AFTER DELETE ON sample_stratigraphic_units
                DEFERRABLE INITIALLY DEFERRED
                FOR EACH ROW
                EXECUTE FUNCTION check_last_sample_stratigraphic_unit();
            SQL
        );

        // Enforce: at least one join row on context_stratigraphic_units
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION check_last_context_stratigraphic_unit()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM contexts WHERE id = OLD.context_id) THEN
                        RETURN OLD;  -- parent is gone, cascade is fine
                    END IF;
                    IF NOT EXISTS (
                        SELECT 1 FROM context_stratigraphic_units
                        WHERE context_id = OLD.context_id AND id != OLD.id
                    ) THEN
                        RAISE EXCEPTION 'Cannot delete the last stratigraphic unit for context %', OLD.context_id;
                    END IF;
                    RETURN OLD;
                END;
                $$ LANGUAGE plpgsql;
            SQL
        );

        $this->addSql(
            <<<'SQL'
                CREATE CONSTRAINT TRIGGER trg_check_last_context_stratigraphic_unit
                AFTER DELETE ON context_stratigraphic_units
                DEFERRABLE INITIALLY DEFERRED
                FOR EACH ROW
                EXECUTE FUNCTION check_last_context_stratigraphic_unit();
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_su(site_code text, su_year integer, su_number integer)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(
                        site_code,
                        '.',
                        RIGHT(CASE WHEN su_year = 0 THEN '__' ELSE su_year::text END, 2),
                        '.',
                        su_number
                    );
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_individual(site_code text, identifier text)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.', identifier);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_mu(site_code text, su_year integer, su_number integer, mu_identifier text)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(generate_code_su(site_code, su_year, su_number), '.', mu_identifier);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_sample(site_code text, type_code text, sample_year integer, sample_number integer)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.', type_code, '.', RIGHT(CASE WHEN sample_year = 0 THEN '____' ELSE sample_year::text END, 2), '.', sample_number);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_sampling_su(site_code text, su_number integer)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.', su_number);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_sediment_core(site_code text, sc_year integer, sc_number integer)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.SC.', RIGHT(sc_year::text, 2), '.', sc_number);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_sediment_core_depth(site_code text, sc_year integer, sc_number integer, depth_min numeric)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(generate_code_sediment_core(site_code, sc_year, sc_number), '.', ROUND(depth_min * 10)::integer);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_paleoclimate_sample(site_code text, sample_number integer)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.', sample_number);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_pottery(site_code text, inventory text)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.', inventory);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_botany_charcoal(site_code text, charcoal_id bigint)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.', charcoal_id);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_botany_seed(site_code text, seed_id bigint)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.', seed_id);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_zoo_bone(site_code text, bone_id bigint)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.', bone_id);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_zoo_tooth(site_code text, tooth_id bigint)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(site_code, '.', tooth_id);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
        $this->addSql(
            <<<'SQL'
                CREATE OR REPLACE FUNCTION generate_code_analysis(type_code text, analysis_year integer, identifier text)
                RETURNS text AS $$
                BEGIN
                    RETURN CONCAT(type_code, '.', RIGHT(analysis_year::text, 2), '.', identifier);
                END;
                $$ LANGUAGE plpgsql IMMUTABLE;
            SQL
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql(
            <<<'SQL'
                     ALTER TABLE archaeological_sites DROP CONSTRAINT IF EXISTS chk_chronology ;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                DROP TRIGGER IF EXISTS trg_enforce_context_stratigraphic_unit_site_consistency ON context_stratigraphic_units;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                DROP FUNCTION IF EXISTS validate_context_stratigraphic_units_site;
                SQL
        );

        // Drop triggers and functions for sample_stratigraphic_units
        $this->addSql(
            <<<'SQL'
                DROP TRIGGER IF EXISTS trg_enforce_sample_stratigraphic_unit_site_consistency ON sample_stratigraphic_units;
                SQL
        );
        $this->addSql(
            <<<'SQL'
                DROP FUNCTION IF EXISTS validate_sample_stratigraphic_units_site;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                DROP TRIGGER IF EXISTS trg_sample_reference_exclusivity ON samples;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                DROP FUNCTION IF EXISTS enforce_samples_reference_exclusivity;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                DROP TRIGGER IF EXISTS trg_set_sample_site_id ON samples;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                ALTER TABLE vocabulary.analysis_types DROP CONSTRAINT IF EXISTS chk_analysis_types_absdating_id_range;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    DROP FUNCTION IF EXISTS unaccent_immutable;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    DROP TRIGGER IF EXISTS trg_enforce_pottery_inventory_site_uniqueness ON potteries;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    DROP FUNCTION IF EXISTS validate_pottery_inventory_site_uniqueness;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    DROP TRIGGER IF EXISTS trg_enforce_individual_identifier_site_uniqueness ON potteries;
                SQL
        );

        $this->addSql(
            <<<'SQL'
                    DROP FUNCTION IF EXISTS validate_individual_identifier_site_uniqueness;
                SQL
        );

        $this->addSql('DROP TRIGGER IF EXISTS trg_check_last_sample_stratigraphic_unit ON sample_stratigraphic_units');
        $this->addSql('DROP FUNCTION IF EXISTS check_last_sample_stratigraphic_unit()');
        $this->addSql('DROP TRIGGER IF EXISTS trg_check_last_context_stratigraphic_unit ON context_stratigraphic_units');
        $this->addSql('DROP FUNCTION IF EXISTS check_last_context_stratigraphic_unit()');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_analysis(text, integer, text)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_zoo_tooth(text, bigint)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_zoo_bone(text, bigint)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_botany_seed(text, bigint)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_botany_charcoal(text, bigint)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_pottery(text, text)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_paleoclimate_sample(text, integer)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_sediment_core_depth(text, integer, integer, numeric)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_sediment_core(text, integer, integer)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_sampling_su(text, integer)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_sample(text, text, integer, integer)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_mu(text, integer, integer, text)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_individual(text, text)');
        $this->addSql('DROP FUNCTION IF EXISTS generate_code_su(text, integer, integer)');
    }
}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261126084216 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add media_object_id foreign key to history_animals and history_plants';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE history_animals ADD media_object_id BIGINT DEFAULT NULL');
        $this->addSql('ALTER TABLE history_animals ADD CONSTRAINT FK_B20B453764DE5A5 FOREIGN KEY (media_object_id) REFERENCES media_objects (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_B20B453764DE5A5 ON history_animals (media_object_id)');
        $this->addSql('ALTER TABLE history_plants ADD media_object_id BIGINT DEFAULT NULL');
        $this->addSql('ALTER TABLE history_plants ADD CONSTRAINT FK_762190E564DE5A5 FOREIGN KEY (media_object_id) REFERENCES media_objects (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_762190E564DE5A5 ON history_plants (media_object_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE history_animals DROP CONSTRAINT FK_B20B453764DE5A5');
        $this->addSql('DROP INDEX IDX_B20B453764DE5A5');
        $this->addSql('ALTER TABLE history_animals DROP media_object_id');
        $this->addSql('ALTER TABLE history_plants DROP CONSTRAINT FK_762190E564DE5A5');
        $this->addSql('DROP INDEX IDX_762190E564DE5A5');
        $this->addSql('ALTER TABLE history_plants DROP media_object_id');
    }
}

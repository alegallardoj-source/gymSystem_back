import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePlansTable1743800000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'plans',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'days_per_week',
            type: 'smallint',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'plans',
      new TableIndex({
        name: 'idx_plans_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'plans',
      new TableIndex({
        name: 'idx_plans_is_active',
        columnNames: ['is_active'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('plans', 'idx_plans_is_active');
    await queryRunner.dropIndex('plans', 'idx_plans_name');
    await queryRunner.dropTable('plans');
  }
}

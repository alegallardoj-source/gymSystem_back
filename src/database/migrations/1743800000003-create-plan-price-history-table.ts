import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePlanPriceHistoryTable1743800000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'plan_price_history',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'plan_id',
            type: 'uuid',
          },
          {
            name: 'old_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'new_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'changed_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'changed_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'plan_price_history',
      new TableForeignKey({
        columnNames: ['plan_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'plans',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'plan_price_history',
      new TableForeignKey({
        columnNames: ['changed_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex(
      'plan_price_history',
      new TableIndex({
        name: 'idx_plan_price_history_plan_id',
        columnNames: ['plan_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('plan_price_history');
    
    if (table) {
      const planFk = table.foreignKeys.find(fk => fk.columnNames.includes('plan_id'));
      if (planFk) await queryRunner.dropForeignKey('plan_price_history', planFk);
      
      const changedByFk = table.foreignKeys.find(fk => fk.columnNames.includes('changed_by'));
      if (changedByFk) await queryRunner.dropForeignKey('plan_price_history', changedByFk);
    }

    await queryRunner.dropIndex('plan_price_history', 'idx_plan_price_history_plan_id');
    await queryRunner.dropTable('plan_price_history');
  }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateStudentsTable1743800000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'students',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'plan_id',
            type: 'uuid',
          },
          {
            name: 'dni',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'birth_date',
            type: 'date',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'date',
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

    await queryRunner.createForeignKey(
      'students',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'students',
      new TableForeignKey({
        columnNames: ['plan_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'plans',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createIndex(
      'students',
      new TableIndex({
        name: 'idx_students_user_id',
        columnNames: ['user_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'students',
      new TableIndex({
        name: 'idx_students_dni',
        columnNames: ['dni'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'students',
      new TableIndex({
        name: 'idx_students_plan_id',
        columnNames: ['plan_id'],
      }),
    );

    await queryRunner.createIndex(
      'students',
      new TableIndex({
        name: 'idx_students_is_active',
        columnNames: ['is_active'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('students');
    
    if (table) {
      const userFk = table.foreignKeys.find(fk => fk.columnNames.includes('user_id'));
      if (userFk) await queryRunner.dropForeignKey('students', userFk);
      
      const planFk = table.foreignKeys.find(fk => fk.columnNames.includes('plan_id'));
      if (planFk) await queryRunner.dropForeignKey('students', planFk);
    }

    await queryRunner.dropIndex('students', 'idx_students_is_active');
    await queryRunner.dropIndex('students', 'idx_students_plan_id');
    await queryRunner.dropIndex('students', 'idx_students_dni');
    await queryRunner.dropIndex('students', 'idx_students_user_id');
    await queryRunner.dropTable('students');
  }
}

import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IQueryRecords, IQueryRecordSchema, IRecordQueryModel, IRecordSpec, ViewId } from '@undb/core'
import { WithRecordId, WithRecordTableId } from '@undb/core'
import { Option } from 'oxide.ts'
import { ReferenceField, SelectField } from '../../entity/field.js'
import { Table as TableEntity } from '../../entity/table.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import type { RecordSqlite } from './record.type.js'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async #getTable(tableId: string): Promise<TableEntity> {
    const tableEntity = await this.em.findOneOrFail(
      TableEntity,
      { id: tableId },
      {
        populate: [
          'fields',
          'views',
          'fields.options',
          'fields.displayFields',
          'fields.countFields',
          'fields.sumFields',
          'fields.sumAggregateField',
          'fields.averageFields',
          'fields.averageAggregateField',
          'fields.lookupFields',
          'fields.foreignTable',
          'fields.foreignTable',
        ],
      },
    )
    for (const field of tableEntity.fields) {
      if (field instanceof ReferenceField) {
        if (!field.foreignTable?.fields.isInitialized()) {
          await field.foreignTable?.fields.init()
        }
        const displayFields = field.displayFields.getItems(false) ?? []
        for (const f of displayFields) {
          if (f instanceof SelectField) {
            await f.options.init()
          }
        }
      }
    }

    return tableEntity
  }

  async find(tableId: string, viewId: ViewId | undefined, spec: IRecordSpec | null): Promise<IQueryRecords> {
    const tableEntity = await this.#getTable(tableId)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec, viewId?.value)
    // TODO: expand reference field
    builder = builder.select().from().where().reference().sort().build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb)

    return RecordSqliteMapper.toQueries(tableId, schema, data)
  }

  async findAndCount(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
  ): Promise<{ records: IQueryRecords; total: number }> {
    const tableEntity = await this.#getTable(tableId)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec, viewId?.value)
    builder = builder.select().from().where().reference().sort().build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb)

    const records = RecordSqliteMapper.toQueries(tableId, schema, data)
    // TODO: 分页需要从 query 中获取
    const total = records.length

    return { records, total: total }
  }

  async findOne(tableId: string, spec: IRecordSpec | null): Promise<Option<IQueryRecordSchema>> {
    const tableEntity = await this.#getTable(tableId)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    spec = spec
      ? WithRecordTableId.fromString(tableId).unwrap().and(spec)
      : WithRecordTableId.fromString(tableId).unwrap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec)
    builder = builder.select().from().where().reference().build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb.first())

    const record = RecordSqliteMapper.toQuery(tableId, schema, data[0])
    return Option(record)
  }

  findOneById(tableId: string, id: string): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(tableId, WithRecordId.fromString(id))
  }
}

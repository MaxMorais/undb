import { type IRecordRepository, type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { DuplicateRecordCommand } from './duplicate-record.comand.js'

export class DuplicateRecordCommandHandler implements ICommandHandler<DuplicateRecordCommand, void> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly recordRepo: IRecordRepository) {}

  async execute(command: DuplicateRecordCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()
    const record = (await this.recordRepo.findOneById(table.id.value, command.id, table.schema.toIdMap())).unwrap()

    const duplicated = record.duplicate(table.schema.toIdMap())

    await this.recordRepo.insert(duplicated, table.schema.toIdMap())
  }
}

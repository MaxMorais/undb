import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { BulkDuplicateRecordsCommand, BulkDuplicateRecordsCommandHandler as DomainHandler } from '@undb/cqrs'
import { InjectRecordReposiory, InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(BulkDuplicateRecordsCommand)
export class BulkDuplicateRecordsCommandHandler
  extends DomainHandler
  implements ICommandHandler<BulkDuplicateRecordsCommand>
{
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,

    @InjectRecordReposiory()
    protected readonly recordRepo: IRecordRepository,
  ) {
    super(tableRepo, recordRepo)
  }
}

import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { ReorderOptionsCommandHandler as DomainHandler, ReorderOptionsCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(ReorderOptionsCommand)
export class ReorderOptionsCommandHandler extends DomainHandler implements ICommandHandler<ReorderOptionsCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}

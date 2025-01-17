import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { ResetFieldSortCommandHandler as DomainHandler, ResetFieldSortCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(ResetFieldSortCommand)
export class ResetFieldSortCommandHandler extends DomainHandler implements ICommandHandler<ResetFieldSortCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}

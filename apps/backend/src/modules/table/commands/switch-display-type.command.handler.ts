import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { SwitchDisplayTypeCommandHandler as DomainHandelr, SwitchDisplayTypeCommand } from '@undb/cqrs'
import { InjectTableReposiory } from '../adapters/index.js'

@CommandHandler(SwitchDisplayTypeCommand)
export class SwitchDisplayTypeCommandHandler
  extends DomainHandelr
  implements ICommandHandler<SwitchDisplayTypeCommand, void>
{
  constructor(
    @InjectTableReposiory()
    protected readonly tableRepo: ITableRepository,
  ) {
    super(tableRepo)
  }
}

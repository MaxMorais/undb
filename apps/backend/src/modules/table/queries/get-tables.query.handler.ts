import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type ITableQueryModel } from '@undb/core'
import type { IGetTablesOutput } from '@undb/cqrs'
import { GetTablesQuery, GetTablesQueryHandler } from '@undb/cqrs'
import { InjectTableQueryModel } from '../adapters/index.js'

@QueryHandler(GetTablesQuery)
export class NestGetTablesQueryHandelr
  extends GetTablesQueryHandler
  implements IQueryHandler<GetTablesQuery, IGetTablesOutput>
{
  constructor(
    @InjectTableQueryModel()
    protected readonly rm: ITableQueryModel,
  ) {
    super(rm)
  }
}

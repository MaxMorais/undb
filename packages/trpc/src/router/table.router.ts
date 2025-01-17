import type { IGetTableOutput, IGetTablesOutput } from '@undb/cqrs'
import {
  CreateTableCommand,
  DeleteTableCommand,
  GetTableQuery,
  GetTablesQuery,
  UpdateTableCommand,
  createTableCommandInput,
  createTableCommandOutput,
  deleteTableCommandInput,
  getTableQuerySchema,
  getTablesQuerySchema,
  updateTableCommandInput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { createAggregateRouter } from './aggregate.router.js'
import { createFieldRouter } from './field.router.js'
import { createViewRouter } from './view.router.js'
import { createVirsualizationRouter } from './virsualization.router.js'

export const createTableRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      get: procedure
        .input(getTableQuerySchema)
        .output(z.any())
        .query<IGetTableOutput>(({ input }) => {
          const query = new GetTableQuery({ id: input.id })
          return queryBus.execute(query)
        }),
      list: procedure
        .input(getTablesQuerySchema)
        .output(z.any())
        .query<IGetTablesOutput>(() => {
          const query = new GetTablesQuery()
          return queryBus.execute(query)
        }),
      create: procedure
        .input(createTableCommandInput)
        .output(createTableCommandOutput)
        .mutation(({ input }) => {
          const cmd = new CreateTableCommand(input)
          return commandBus.execute(cmd)
        }),
      update: procedure
        .input(updateTableCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new UpdateTableCommand(input)
          return commandBus.execute(cmd)
        }),
      delete: procedure
        .input(deleteTableCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DeleteTableCommand(input)
          return commandBus.execute(cmd)
        }),
      field: createFieldRouter(procedure)(commandBus),
      view: createViewRouter(procedure)(commandBus),
      aggregate: createAggregateRouter(procedure)(queryBus),
      virsualization: createVirsualizationRouter(procedure)(commandBus),
    })

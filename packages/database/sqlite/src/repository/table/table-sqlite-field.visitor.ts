/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type {
  UpdatedAtField as CoereUpdatedAtField,
  AttachmentField as CoreAttachmentField,
  AutoIncrementField as CoreAutoIncrementField,
  AverageField as CoreAverageField,
  BoolField as CoreBoolField,
  CollaboratorField as CoreCollaboratorField,
  ColorField as CoreColorField,
  CountField as CoreCountField,
  CreatedAtField as CoreCreatedAtField,
  CreatedByField as CoreCreatedByField,
  CurrencyField as CoreCurrencyField,
  DateField as CoreDateField,
  DateRangeField as CoreDateRangeField,
  EmailField as CoreEmailField,
  IdField as CoreIdField,
  LookupField as CoreLookupField,
  MultiSelectField as CoreMultiSelectField,
  NumberField as CoreNumberField,
  ParentField as CoreParentField,
  RatingField as CoreRatingField,
  ReferenceField as CoreReferenceField,
  SelectField as CoreSelectField,
  StringField as CoreStringField,
  SumField as CoreSumField,
  TreeField as CoreTreeField,
  UpdatedByField as CoreUpdatedByField,
  IFieldVisitor,
} from '@undb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@undb/core'
import {
  AttachmentField,
  AutoIncrementField,
  AverageField,
  BoolField,
  CollaboratorField,
  ColorField,
  CountField,
  CreatedAtField,
  CreatedByField,
  CurrencyField,
  DateField,
  DateRangeField,
  EmailField,
  Field,
  IdField,
  LookupField,
  MultiSelectField,
  NumberField,
  Option,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  SumField,
  Table,
  TreeField,
  UpdatedAtField,
  UpdatedByField,
} from '../../entity/index.js'
import {
  AdjacencyListTable,
  ClosureTable,
  CollaboratorForeignTable,
} from '../../underlying-table/underlying-foreign-table.js'
import { BaseEntityManager } from '../base-entity-manager.js'

export class TableSqliteFieldVisitor extends BaseEntityManager implements IFieldVisitor {
  constructor(private readonly table: Table, em: EntityManager) {
    super(em)
  }
  id(value: CoreIdField): void {
    const field = new IdField(this.table, value)

    this.em.persist(field)
  }

  createdAt(value: CoreCreatedAtField): void {
    const field = new CreatedAtField(this.table, value)

    this.em.persist(field)
  }

  createdBy(value: CoreCreatedByField): void {
    const field = new CreatedByField(this.table, value)

    this.em.persist(field)
  }

  updatedAt(value: CoereUpdatedAtField): void {
    const field = new UpdatedAtField(this.table, value)

    this.em.persist(field)
  }

  updatedBy(value: CoreUpdatedByField): void {
    const field = new UpdatedByField(this.table, value)

    this.em.persist(field)
  }

  autoIncrement(value: CoreAutoIncrementField): void {
    const field = new AutoIncrementField(this.table, value)

    this.em.persist(field)
  }

  string(value: CoreStringField): void {
    const field = new StringField(this.table, value)

    this.em.persist(field)
  }

  email(value: CoreEmailField): void {
    const field = new EmailField(this.table, value)

    this.em.persist(field)
  }

  color(value: CoreColorField): void {
    const field = new ColorField(this.table, value)

    this.em.persist(field)
  }

  number(value: CoreNumberField): void {
    const field = new NumberField(this.table, value)

    this.em.persist(field)
  }

  rating(value: CoreRatingField): void {
    const field = new RatingField(this.table, value)

    this.em.persist(field)
  }

  currency(value: CoreCurrencyField): void {
    const field = new CurrencyField(this.table, value)

    this.em.persist(field)
  }

  bool(value: CoreBoolField): void {
    const field = new BoolField(this.table, value)

    this.em.persist(field)
  }

  date(value: CoreDateField): void {
    const field = new DateField(this.table, value)

    this.em.persist(field)
  }

  dateRange(value: CoreDateRangeField): void {
    const field = new DateRangeField(this.table, value)

    this.em.persist(field)
  }

  select(value: CoreSelectField): void {
    const field = new SelectField(this.table, value)
    wrap(field).assign({ options: value.options.options.map((option) => new Option(field, option)) })
    this.em.persist(field)
  }

  multiSelect(value: CoreMultiSelectField): void {
    const field = new MultiSelectField(this.table, value)
    wrap(field).assign({ options: value.options.options.map((option) => new Option(field, option)) })
    this.em.persist(field)
  }

  attachment(value: CoreAttachmentField): void {
    const field = new AttachmentField(this.table, value)

    this.em.persist(field)
  }

  reference(value: CoreReferenceField): void {
    const field = new ReferenceField(this.table, value)
    this.em.persist(field)

    if (value.foreignTableId.isSome()) {
      field.foreignTable = this.em.getReference(Table, value.foreignTableId.unwrap())
    }
    field.displayFields.set(value.displayFieldIds.map((fieldId) => this.em.getReference(Field, fieldId.value)))
    if (value.symmetricReferenceFieldId) {
      field.symmetricReferenceField = this.em.getReference(ReferenceField, value.symmetricReferenceFieldId.value)
    }

    const adjacencyListTable = new AdjacencyListTable(this.table.id, value)

    const queries = adjacencyListTable.getCreateTableSqls(this.em.getKnex())

    this.addQueries(...queries)
  }

  count(value: CoreCountField): void {
    const field = new CountField(this.table, value)
    field.countReferenceField = this.em.getReference(Field, value.referenceFieldId.value) as ReferenceField | TreeField

    this.em.persist(field)
  }

  sum(value: CoreSumField): void {
    const field = new SumField(this.table, value)

    field.sumReferenceField = this.em.getReference(Field, value.referenceFieldId.value) as ReferenceField | TreeField
    field.sumAggregateField = this.em.getReference(Field, value.aggregateFieldId.value)

    this.em.persist(field)
  }

  average(value: CoreAverageField): void {
    const field = new AverageField(this.table, value)

    field.averageReferenceField = this.em.getReference(Field, value.referenceFieldId.value) as
      | ReferenceField
      | TreeField
    field.averageAggregateField = this.em.getReference(Field, value.aggregateFieldId.value)

    this.em.persist(field)
  }

  private initClosureTable(value: CoreTreeField | CoreParentField) {
    const tableId = this.table.id

    const closureTable = new ClosureTable(tableId, value)

    const knex = this.em.getKnex()

    const queries = closureTable.getCreateTableSqls(knex)
    this.addQueries(...queries)

    const insert = knex
      .insert(
        knex
          .select([
            `${INTERNAL_COLUMN_ID_NAME} as ${ClosureTable.CHILD_ID}`,
            `${INTERNAL_COLUMN_ID_NAME} as ${ClosureTable.PARENT_ID}`,
            knex.raw('? as ??', [0, ClosureTable.DEPTH]),
          ])
          .from(tableId),
      )
      .into(closureTable.name)
      .onConflict()
      .merge()
      .toQuery()
    this.addQueries(insert)
  }

  tree(value: CoreTreeField): void {
    const field = new TreeField(this.table, value)
    this.em.persist(field)
    field.displayFields.set(value.displayFieldIds.map((fieldId) => this.em.getReference(Field, fieldId.value)))

    this.initClosureTable(value)
  }

  parent(value: CoreParentField): void {
    const field = new ParentField(this.table, value)
    field.displayFields.set(value.displayFieldIds.map((fieldId) => this.em.getReference(Field, fieldId.value)))
    this.em.persist(field)
  }

  lookup(value: CoreLookupField): void {
    const field = new LookupField(this.table, value)
    field.lookupReferenceField = this.em.getReference(Field, value.referenceFieldId.value) as ReferenceField | TreeField
    field.displayFields.set(value.displayFieldIds.map((fieldId) => this.em.getReference(Field, fieldId.value)))

    this.em.persist(field)
  }

  collaborator(value: CoreCollaboratorField): void {
    const field = new CollaboratorField(this.table, value)

    this.em.persist(field)

    const ft = new CollaboratorForeignTable(this.table.id, value.id.value)
    const queries = ft.getCreateTableSqls(this.em.getKnex())

    this.addQueries(...queries)
  }
}

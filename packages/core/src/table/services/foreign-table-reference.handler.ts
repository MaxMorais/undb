/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { andOptions } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { Some } from 'oxide.ts'
import type { ParentField, ReferenceField, TreeField } from '../field/index.js'
import { FieldId, WithSymmetricReferenceField } from '../field/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/index.js'
import type { Table } from '../table.js'
import { AbstractReferenceFieldSpecVisitor } from './abstract-reference-field-spec.visitor.js'

export class ForeignTableReferenceHandler extends AbstractReferenceFieldSpecVisitor {
  constructor(private readonly table: Table, private readonly foreignTable: Table) {
    super()
  }

  #specs: Option<TableCompositeSpecificaiton>[] = []

  get spec() {
    return andOptions(...this.#specs)
  }

  reference(field: ReferenceField): void {
    const id = FieldId.createId()
    const spec = this.foreignTable.createField(undefined, {
      type: 'reference',
      id,
      foreignTableId: this.table.id.value,
      name: this.foreignTable.schema.getNextFieldName(this.table.name.value),
      symmetricReferenceFieldId: field.id.value,
    })

    this.#specs.push(Some(spec), Some(WithSymmetricReferenceField.fromString(field.type, field.id.value, id)))
  }
  tree(field: TreeField): void {}
  parent(field: ParentField): void {}
}

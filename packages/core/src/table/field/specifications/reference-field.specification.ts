import { CompositeSpecification } from '@undb/domain'
import { isEqual } from 'lodash-es'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import { type IAbstractLookingField, type ILookingFieldType } from '../field.type.js'
import type { ReferenceField } from '../reference-field.js'
import type { ReferenceFieldType } from '../reference-field.type.js'
import { FieldId } from '../value-objects/field-id.vo.js'

export class WithDisplayFields extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: ILookingFieldType,
    public readonly fieldId: string,
    public readonly displayFields: FieldId[],
  ) {
    super()
  }
  static fromIds(type: ILookingFieldType, fieldId: string, ids: string[]) {
    return new this(
      type,
      fieldId,
      ids.map((id) => FieldId.fromString(id)),
    )
  }
  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractLookingField
    return isEqual(field.displayFieldIds, this)
  }
  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as IAbstractLookingField
    field.displayFieldIds = this.displayFields
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.displayFieldsEqual(this)
    return Ok(undefined)
  }
}

export class WithSymmetricReferenceField extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: ReferenceFieldType,
    public readonly fieldId: string,
    public readonly symmetricReferenceFieldId: FieldId,
  ) {
    super()
  }
  static fromString(type: ReferenceFieldType, fieldId: string, symmetricReferenceFieldId: string) {
    return new this(type, fieldId, FieldId.fromString(symmetricReferenceFieldId))
  }
  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as ReferenceField
    return this.symmetricReferenceFieldId.equals(field.symmetricReferenceFieldId)
  }
  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as ReferenceField
    field.symmetricReferenceFieldId = this.symmetricReferenceFieldId
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.symmetricReferenceFieldEqual(this)
    return Ok(undefined)
  }
}

import type { SelectProps } from '@egodb/ui'
import { Select } from '@egodb/ui'
import type { FieldBase } from './field-picker.type'

interface IProps extends Omit<SelectProps, 'data'> {
  fields: FieldBase[]
}

export const FieldPicker: React.FC<IProps> = ({ fields, ...rest }) => {
  const data = fields.map((f) => ({ value: f.id, label: f.name }))

  return <Select {...rest} data={data} />
}
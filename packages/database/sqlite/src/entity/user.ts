import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import type { User as CoreUser } from '@undb/core'
import { BaseEntity } from './base.js'

@Entity({ tableName: 'undb_user' })
export class User extends BaseEntity {
  constructor(user: CoreUser) {
    super()
    this.id = user.userId.value
    this.email = user.email
    this.username = user.username
    this.password = user.password
    this.avatar = user.avatar
  }
  @PrimaryKey()
  id: string

  @Property({ nullable: true })
  avatar?: string

  @Property()
  @Index()
  username: string

  @Property()
  @Index()
  @Unique()
  email: string

  @Property()
  password: string
}

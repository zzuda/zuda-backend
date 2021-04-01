export class CreateUserDTO {
  uuid!: string;

  email!: string;

  vendor?: string;

  password?: string;

  name!: string;

  createdAt!: Date;

  updatedAt!: Date;

  deletedAt!: Date;
}

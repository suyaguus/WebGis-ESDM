import { Role } from "@prisma/client";

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
  companyId?: string;
};

export type UpdateUserInput = {
  name?: string;
  phone?: string;
  isActive?: boolean;
};
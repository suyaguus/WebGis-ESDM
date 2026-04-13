export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: string;
  companyId?: string;
};

export type UpdateUserInput = {
  name?: string;
  phone?: string;
  isActive?: boolean;
};

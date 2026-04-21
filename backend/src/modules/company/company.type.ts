export type CreateCompanyInput = {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  type?: string;
};

export type UpdateCompanyInput = Partial<CreateCompanyInput>;

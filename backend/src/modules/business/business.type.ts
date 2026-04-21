export type CreateBusinessInput = {
  name: string;
  address?: string;
  phone?: string;
  companyId: string;
};

export type UpdateBusinessInput = Partial<CreateBusinessInput>;

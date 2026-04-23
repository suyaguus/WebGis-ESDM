import { Role } from "@prisma/client";

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
  companyId?: string;
};

export type CreateAdminPerusahaanInput = {
  // Data user
  name: string;
  email: string;
  password: string;
  phone?: string;
  // Data perusahaan (wajib)
  companyName: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyType?: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  phone?: string;
  role?: Role;
  companyId?: string;
  isActive?: boolean;
};

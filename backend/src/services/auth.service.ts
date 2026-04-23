import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

type Role =
  | "super_admin"
  | "admin_perusahaan"
  | "kepala_instansi"
  | "supervisor";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  // Data perusahaan
  companyName: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyType?: string;
};

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email sudah digunakan");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: data.companyName,
        address: data.companyAddress,
        email: data.companyEmail,
        phone: data.companyPhone,
        type: data.companyType,
        isVerified: false,
        isActive: true,
      },
    });

    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: "admin_perusahaan",
        companyId: company.id,
        isVerified: false,
        isActive: true,
      },
    });

    const { password, ...safeUser } = user;
    return { user: safeUser, company };
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User tidak ditemukan");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password salah");

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
};

// console.log("JWT_SECRET SIGN:", process.env.JWT_SECRET);

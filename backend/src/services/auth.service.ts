import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export const registerUser = async (data: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User tidak ditemukan");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password salah");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  return { user, token };
};

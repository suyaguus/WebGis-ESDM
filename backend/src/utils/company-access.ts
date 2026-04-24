import prisma from "../config/prisma";

export const resolveCompanyId = async (user: {
  id: string;
  role: string;
}): Promise<string | null> => {
  if (user.role === "super_admin") return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { companyId: true },
  });

  return dbUser?.companyId ?? null;
};

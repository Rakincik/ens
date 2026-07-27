"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createUser(data: { name: string; surname: string; email: string; password?: string; role: string }) {
  try {
    if (!data.name || !data.surname || !data.email) {
      return { success: false, error: "Lütfen ad, soyad ve e-posta alanlarını doldurun." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "Bu e-posta adresi kullanımda." };
    }

    // Hashlenmeyecek (kural değişikliği)
    const passwordHash = data.password && data.password.trim() !== "" ? data.password : "123456";

    await prisma.user.create({
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    });

    revalidatePath("/admin/dashboard");
    return { success: true, message: "Kullanıcı başarıyla oluşturuldu." };
  } catch (error) {
    console.error("Create User Error:", error);
    return { success: false, error: "Kullanıcı oluşturulurken bir hata meydana geldi." };
  }
}

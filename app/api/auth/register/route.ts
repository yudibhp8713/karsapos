import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password, businessName } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Lengkapi semua data' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat bisnis dulu
    const business = await prisma.business.create({
      data: { name: businessName || 'Usaha Saya' }
    });

    // Buat pengguna
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        businessId: business.id,
        role: 'owner'
      }
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, businessId: user.businessId }
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

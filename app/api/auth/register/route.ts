import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { businessName, name, email, password } = await request.json();

    if (!businessName || !name || !email || !password) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi' }, { status: 400 });
    }

    // Cek email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah digunakan' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat Bisnis + Pemilik dalam transaksi
    const business = await prisma.business.create({
      data: {
        name: businessName,
        plan: 'BASIC'
      }
    });

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'OWNER',
        businessId: business.id
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}

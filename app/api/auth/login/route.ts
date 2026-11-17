import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Email tidak ditemukan' }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Kata sandi salah' }, { status: 401 });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      businessId: user.businessId,
      businessName: user.business?.name,
      role: user.role,
      plan: user.business?.plan || 'basic'
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

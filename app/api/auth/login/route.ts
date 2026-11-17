import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Email atau kata sandi salah' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Email atau kata sandi salah' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Akun dinonaktifkan' }, { status: 403 });
    }

        // ... kode sebelumnya tetap ada

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
        businessName: user.business.name,
        plan: user.business.plan
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}


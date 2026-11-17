import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Ambil daftar transaksi
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    
    if (!businessId) return NextResponse.json({ error: 'businessId diperlukan' }, { status: 400 });
    
    const where: any = { businessId };
    if (from && to) {
      where.createdAt = { gte: new Date(from), lte: new Date(to) };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('GET transactions error:', error);
    return NextResponse.json({ error: 'Gagal memuat transaksi' }, { status: 500 });
  }
}

// Buat transaksi baru
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const invoiceNo = `INV-${Date.now()}`;

    // Gunakan transaksi database untuk konsistensi
    const result = await prisma.$transaction(async (tx) => {
      // Buat transaksi
      const transaction = await tx.transaction.create({
        data: {
          invoiceNo,
          businessId: data.businessId,
          userId: data.userId,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          received: data.received,
          change: data.change,
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.subtotal
            }))
          }
        }
      });

      // Kurangi stok produk
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return transaction;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('POST transaction error:', error);
    return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 500 });
  }
}

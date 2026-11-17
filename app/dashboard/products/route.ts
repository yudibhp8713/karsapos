import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Ambil daftar produk
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'businessId diperlukan' }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ error: 'Gagal memuat produk' }, { status: 500 });
  }
}

// Tambah produk baru
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        barcode: data.barcode || null,
        category: data.category || null,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        stock: data.stock || 0,
        minStock: data.minStock || 0,
        businessId: data.businessId
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan produk' }, { status: 500 });
  }
}

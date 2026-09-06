import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('user_token')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập quản trị viên' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.email !== 'admin@gmail.com' && user.email !== 'admin')) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      categoryId,
      price,
      originalPrice,
      formats,
      fileSize,
      dimensions,
      sku,
      description,
      details,
      imageUrl,
      isFeatured,
    } = body;

    if (!title || !categoryId || !price) {
      return NextResponse.json({ error: 'Vui lòng điền đủ Tiêu đề, Danh mục và Giá bán.' }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        categoryId,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        formats: formats || 'AutoCAD .dwg, 3ds Max',
        fileSize: fileSize || '50 MB',
        dimensions: dimensions || null,
        sku: sku || 'BV-' + Math.floor(1000 + Math.random() * 9000),
        description: description || 'Hồ sơ bản vẽ chi tiết thi công hoàn chỉnh.',
        details: details || null,
        isFeatured: Boolean(isFeatured),
        images: {
          create: {
            url: imageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
            isPrimary: true,
          }
        }
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Không thể tạo bản vẽ' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('user_token')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập quản trị viên' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.email !== 'admin@gmail.com' && user.email !== 'admin')) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    }

    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Không thể xóa bản vẽ' }, { status: 500 });
  }
}
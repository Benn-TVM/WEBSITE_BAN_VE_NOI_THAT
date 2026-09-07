import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

async function checkAdmin() {
  const cookieStore = cookies();
  const userId = cookieStore.get('user_token')?.value;
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || (user.email !== 'admin@gmail.com' && user.email !== 'admin')) {
    return null;
  }
  return user;
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({ error: 'Lỗi tải danh mục' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug: customSlug, description, icon, image, orderIndex } = body;

    if (!name) {
      return NextResponse.json({ error: 'Tên danh mục không được để trống' }, { status: 400 });
    }

    // Generate slug
    let slug = customSlug;
    if (!slug) {
      slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Check if slug exists
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null,
        image: image || null,
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : 0,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Không thể tạo danh mục' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, slug, description, icon, image, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID danh mục' }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Danh mục không tồn tại' }, { status: 404 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name || existing.name,
        slug: slug || existing.slug,
        description: description !== undefined ? description : existing.description,
        icon: icon !== undefined ? icon : existing.icon,
        image: image !== undefined ? image : existing.image,
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : existing.orderIndex,
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Không thể cập nhật danh mục' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID danh mục' }, { status: 400 });
    }

    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json({ 
        error: `Danh mục này đang có ${productCount} bản vẽ. Vui lòng chuyển hoặc xóa các bản vẽ trước khi xóa danh mục!` 
      }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Không thể xóa danh mục' }, { status: 500 });
  }
}

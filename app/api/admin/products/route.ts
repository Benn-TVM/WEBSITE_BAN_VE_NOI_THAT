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

export async function GET(request: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: true,
        },
      });

      if (!product) {
        return NextResponse.json({ error: 'Không tìm thấy bản vẽ' }, { status: 404 });
      }

      return NextResponse.json({ success: true, product });
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug: customSlug,
      categoryId,
      price,
      originalPrice,
      formats,
      fileSize,
      dimensions,
      fileName,
      sku,
      description,
      details,
      imageUrl,
      images,
      isFeatured,
      views,
      downloads,
    } = body;

    if (!title || !categoryId || !price) {
      return NextResponse.json({ error: 'Vui lòng điền đủ Tiêu đề, Danh mục và Giá bán.' }, { status: 400 });
    }

    // Generate slug from title or customSlug
    let slug = customSlug;
    if (!slug) {
      slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
    }

    const allImages: string[] = Array.isArray(images) && images.length > 0
      ? images.filter(Boolean)
      : (imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80']);

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
        fileName: fileName || null,
        sku: sku || 'BV-' + Math.floor(1000 + Math.random() * 9000),
        description: description || 'Hồ sơ bản vẽ chi tiết thi công hoàn chỉnh.',
        details: details || null,
        isFeatured: Boolean(isFeatured),
        views: views !== undefined ? Number(views) : 0,
        downloads: downloads !== undefined ? Number(downloads) : 0,
        images: {
          create: allImages.map((url, idx) => ({
            url: url.trim(),
            isPrimary: idx === 0,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Không thể tạo bản vẽ' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      title,
      slug,
      categoryId,
      price,
      originalPrice,
      formats,
      fileSize,
      dimensions,
      fileName,
      sku,
      description,
      details,
      imageUrl,
      images,
      isFeatured,
      views,
      downloads,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID bản vẽ' }, { status: 400 });
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Bản vẽ không tồn tại' }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: title || existingProduct.title,
        slug: slug || existingProduct.slug,
        categoryId: categoryId || existingProduct.categoryId,
        price: price !== undefined ? Number(price) : existingProduct.price,
        originalPrice: originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : existingProduct.originalPrice,
        formats: formats || existingProduct.formats,
        fileSize: fileSize || existingProduct.fileSize,
        dimensions: dimensions !== undefined ? dimensions : existingProduct.dimensions,
        fileName: fileName !== undefined ? fileName : existingProduct.fileName,
        sku: sku || existingProduct.sku,
        description: description || existingProduct.description,
        details: details !== undefined ? details : existingProduct.details,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingProduct.isFeatured,
        views: views !== undefined ? Number(views) : existingProduct.views,
        downloads: downloads !== undefined ? Number(downloads) : existingProduct.downloads,
      },
    });

    // Cập nhật danh sách ảnh (ảnh 0 là ảnh chính, các ảnh sau là demo chi tiết CAD)
    const allImages: string[] = Array.isArray(images) && images.length > 0
      ? images.filter(Boolean)
      : (imageUrl ? [imageUrl] : []);

    if (allImages.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: allImages.map((url, idx) => ({
          productId: id,
          url: url.trim(),
          isPrimary: idx === 0,
        })),
      });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Không thể cập nhật bản vẽ' }, { status: 500 });
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
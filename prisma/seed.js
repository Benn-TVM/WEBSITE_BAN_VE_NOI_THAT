const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Categories
  const categoriesData = [
    {
      id: 'cat-hoa-van',
      name: 'Hoa văn',
      slug: 'hoa-van',
      description: 'Mẫu hoa văn điêu khắc, chạm trổ CNC, hoa sen, rồng phượng, hoa lá tây cho đá và gỗ.',
      icon: 'Sparkles',
      orderIndex: 1,
    },
    {
      id: 'cat-cong-da',
      name: 'Cổng đá',
      slug: 'cong-da',
      description: 'Hồ sơ bản vẽ thiết kế cổng đá tam quan, cổng nhà thờ họ, cổng đình chùa, cổng biệt thự cao cấp.',
      icon: 'DoorOpen',
      orderIndex: 2,
    },
    {
      id: 'cat-lan-can',
      name: 'Lan can',
      slug: 'lan-can',
      description: 'Bản vẽ lan can đá mỹ nghệ, con tiện đá, tường rào đá chạm khắc hoa văn tinh xảo.',
      icon: 'Shield',
      orderIndex: 3,
    },
    {
      id: 'cat-vach-ngan',
      name: 'Vách ngăn',
      slug: 'vach-ngan',
      description: 'Mẫu vách ngăn CNC, bình phong đá, vách chắn phong thủy phòng thờ và không gian trang trọng.',
      icon: 'Layers',
      orderIndex: 4,
    },
    {
      id: 'cat-phu-dieu',
      name: 'Phù điêu',
      slug: 'phu-dieu',
      description: 'Tranh phù điêu đá nguyên khối, phù điêu tứ quý, tùng cúc trúc mai, bát mã, hoa sen đầm.',
      icon: 'Palette',
      orderIndex: 5,
    },
    {
      id: 'cat-mo-lang-mo',
      name: 'Mộ / Lăng mộ',
      slug: 'mo-lang-mo',
      description: 'Hồ sơ kết cấu & kiến trúc khu lăng mộ đá gia tộc, mộ đá đơn, mộ đá đôi, lăng thờ chung chuẩn phong thủy.',
      icon: 'Landmark',
      orderIndex: 6,
    },
    {
      id: 'cat-trang-tri',
      name: 'Trang trí',
      slug: 'trang-tri',
      description: 'Bản vẽ cột rồng đá, chiếu đá, đỉnh hương, nghê đá, đèn đá lục giác và các hạng mục kiến trúc mỹ nghệ.',
      icon: 'Crown',
      orderIndex: 7,
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }

  // 2. Sample Products
  const productsData = [
    {
      title: 'Hồ sơ cổng đá tam quan 3 mái tứ trụ chạm rồng đá Ninh Bình',
      slug: 'ho-so-cong-da-tam-quan-3-mai-tu-tru-cham-rong-da-ninh-binh',
      sku: 'CD-TQ01',
      categoryId: 'cat-cong-da',
      price: 250000,
      originalPrice: 450000,
      formats: 'AutoCAD .dwg, 3ds Max, PDF bản vẽ kỹ thuật',
      fileSize: '148 MB',
      dimensions: 'Rộng 8.6m x Cao 6.8m x Sâu 1.5m',
      isFeatured: true,
      description: 'Hồ sơ bản vẽ thiết kế thi công hoàn chỉnh cổng đá tam quan 3 mái chùa/nhà thờ họ, đã thi công thực tế tại Ninh Bình. Đầy đủ mặt đứng, mặt cắt, chi tiết mộng ngàm đá, hoa văn cột tứ trụ chạm rồng mây tinh xảo.',
      details: 'Gồm: File CAD 2D bổ chi tiết 100% cấu kiện; File 3D phối cảnh; Bảng thống kê khối lượng đá chế tác chi tiết.',
      images: [
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      title: 'Bản vẽ khu lăng mộ đá xanh rêu cao cấp chuẩn thước Lỗ Ban',
      slug: 'ban-ve-khu-lang-mo-da-xanh-reu-cao-cap-chuan-thuoc-lo-ban',
      sku: 'LM-XR02',
      categoryId: 'cat-mo-lang-mo',
      price: 320000,
      originalPrice: 600000,
      formats: 'AutoCAD .dwg, SketchUp 2023, Excel bóc tách',
      fileSize: '215 MB',
      dimensions: 'Khu đất 12m x 18m, chuẩn cung đỏ phong thủy',
      isFeatured: true,
      description: 'Bản vẽ chi tiết tổ hợp lăng mộ đá xanh rêu Thanh Hóa gồm: Lăng thờ 3 mái chính, cuốn thư đá, đôi đèn đá, bàn lễ, cổng vào lăng và hàng rào bao quanh chạm sen.',
      details: 'Đã xuất xưởng thi công thực tế, file CAD chuẩn từng kích thước khớp mộng đá, không sợ lỗi xê dịch.',
      images: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      title: 'Bộ file CNC hoa văn tứ linh Long Lân Quy Phụng chạm khắc đá mỹ nghệ',
      slug: 'bo-file-cnc-hoa-van-tu-linh-long-lan-quy-phung-cham-khac-da-my-nghe',
      sku: 'HV-TL03',
      categoryId: 'cat-hoa-van',
      price: 150000,
      originalPrice: 280000,
      formats: 'JDpaint (.jdp), ArtCAM (.art), AutoCAD (.dwg), STL',
      fileSize: '88 MB',
      dimensions: 'Vector & 3D relief có thể phóng to thu nhỏ tùy ý',
      isFeatured: true,
      description: 'Bộ sưu tập hoa văn Tứ Linh chi tiết cực sâu, nét chạm uyển chuyển, độ nét cao cho máy CNC đục đá, máy cắt laser, khắc gỗ hoặc in 3D.',
      details: 'File đã test đường dao trên máy điêu khắc CNC đá 4 đầu, nét sắc, không gãy mũi đục.',
      images: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      title: 'Tranh phù điêu đá Vinh Quy Bái Tổ chạm sâu nguyên khối',
      slug: 'tranh-phu-dieu-da-vinh-quy-bai-to-cham-sau-nguyen-khoi',
      sku: 'PD-VQ04',
      categoryId: 'cat-phu-dieu',
      price: 280000,
      originalPrice: 500000,
      formats: 'JDpaint (.jdp), 3ds Max (.max), OBJ/STL, AutoCAD 2D',
      fileSize: '190 MB',
      dimensions: 'Kích thước tranh 2.35m x 1.33m (Độ dày chạm 12cm)',
      isFeatured: true,
      description: 'Phù điêu Vinh Quy Bái Tổ lột tả trọn vẹn nét văn hóa truyền thống, cảnh trạng nguyên về làng qua cổng đình, cây đa, giếng nước. Rất thích hợp làm bình phong nhà thờ họ hoặc sảnh biệt thự.',
      details: 'Bao gồm file lưới 3D sắc nét đa giác cao và file 2D bóc tách khung bo viền hoa lá đá.',
      images: [
        'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'Bản vẽ kỹ thuật lan can đá chạm đầm sen cổ kính',
      slug: 'ban-ve-ky-thuat-lan-can-da-cham-dam-sen-co-kinh',
      sku: 'LC-SEN05',
      categoryId: 'cat-lan-can',
      price: 180000,
      originalPrice: 300000,
      formats: 'AutoCAD .dwg, SketchUp 2022',
      fileSize: '65 MB',
      dimensions: 'Module 1.2m x Cao 0.81m ghép module liên hoàn',
      isFeatured: false,
      description: 'Thiết kế mẫu dậu lan can đá bưng chạm hoa sen sắc sảo, cột trụ vuông đầu gắn nụ sen. Bổ mộng âm dương chuẩn xác cho thợ dựng mộc đá nhanh chóng.',
      details: 'File CAD chia từng chi tiết bưng đá, con tiện, tay vịn, đế cá chân quỳ.',
      images: [
        'https://images.unsplash.com/photo-1599818496155-2746c8784d63?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'Vách ngăn bình phong đá chữ Thọ kết hợp hoa văn triện cổ',
      slug: 'vach-ngan-binh-phong-da-chu-tho-ket-hop-hoa-van-trien-co',
      sku: 'VN-THO06',
      categoryId: 'cat-vach-ngan',
      price: 200000,
      originalPrice: 350000,
      formats: 'AutoCAD (.dwg), Corel Draw (.cdr), JDpaint',
      fileSize: '75 MB',
      dimensions: 'Rộng 1.76m x Cao 2.15m x Dày 20cm',
      isFeatured: false,
      description: 'Bình phong chắn gió phong thủy cho từ đường, nhà thờ họ, đền chùa hoặc khuôn viên biệt thự. Ở giữa là đại tự chữ Thọ tròn, viền xung quanh cánh dơi ngậm tiền ngũ phúc.',
      details: 'File CAD 2D bóc tách đá + File vector CNC cắt chuẩn tỉ lệ.',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'Bản vẽ đôi cột rồng đá cuốn mây hiên tiền nhà cổ',
      slug: 'ban-ve-doi-cot-rong-da-cuon-may-hien-tien-nha-co',
      sku: 'TT-CR07',
      categoryId: 'cat-trang-tri',
      price: 220000,
      originalPrice: 400000,
      formats: 'AutoCAD .dwg, 3ds Max, JDpaint 3D',
      fileSize: '110 MB',
      dimensions: 'Đường kính cột D40cm x Cao 3.15m cả chân tảng',
      isFeatured: true,
      description: 'Bản vẽ chi tiết đôi cột đồng trụ / cột hiên chạm thân rồng uốn lượn ôm cột, đầu rồng hướng lên đón sinh khí. Chân tảng đá hoa sen chạm hai tầng cánh.',
      details: 'File gồm mặt cắt ngang tiện đá, mặt đứng hoa văn rải đều chu vi thân cột tròn.',
      images: [
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
      ]
    }
  ];

  for (const item of productsData) {
    const images = item.images;
    delete item.images;

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: item,
      create: {
        ...item,
        views: Math.floor(Math.random() * 200) + 50,
        downloads: Math.floor(Math.random() * 30) + 5,
      },
    });

    // Seed images
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[i],
          isPrimary: i === 0,
        }
      });
    }
  }

  // 3. Settings (Bank / QR config)
  const settings = [
    { key: 'BANK_NAME', value: 'Vietcombank', description: 'Tên ngân hàng' },
    { key: 'BANK_ACCOUNT_NO', value: '9988776655', description: 'Số tài khoản nhận tiền' },
    { key: 'BANK_ACCOUNT_NAME', value: 'NGUYEN VAN QUAN TRI', description: 'Tên chủ tài khoản' },
    { key: 'MOMO_PHONE', value: '0987069242', description: 'Số điện thoại Ví MoMo' },
    { key: 'HOTLINE', value: '0987.069.242', description: 'Số hotline hỗ trợ kỹ thuật' },
    { key: 'SUPPORT_EMAIL', value: 'hotro@banvenoithat.vn', description: 'Email liên hệ' },
    { key: 'SITE_TITLE', value: 'THƯ VIỆN BẢN VẼ MỸ NGHỆ & HOA VĂN KIẾN TRÚC', description: 'Tiêu đề website' }
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }

  // 4. Admin & User Accounts (admin@gmail.com / 123456, user@gmail.com / 123456)
  const crypto = require('crypto');
  const pass123456Hash = crypto.createHash('sha256').update('123456').digest('hex');

  await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: { passwordHash: pass123456Hash },
    create: {
      name: 'Khách hàng (User)',
      email: 'user@gmail.com',
      phone: '0988123456',
      passwordHash: pass123456Hash,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: { passwordHash: pass123456Hash },
    create: {
      name: 'Quản trị viên Hệ thống (Admin)',
      email: 'admin@gmail.com',
      phone: '0987069242',
      passwordHash: pass123456Hash,
    },
  });

  await prisma.adminUser.upsert({
    where: { username: 'admin@gmail.com' },
    update: { passwordHash: pass123456Hash },
    create: {
      username: 'admin@gmail.com',
      passwordHash: pass123456Hash,
      name: 'Quản trị viên Hệ thống',
      role: 'SUPERADMIN',
    },
  });

  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: { passwordHash: pass123456Hash },
    create: {
      username: 'admin',
      passwordHash: pass123456Hash,
      name: 'Quản trị viên Hệ thống',
      role: 'SUPERADMIN',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
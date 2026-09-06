const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  const password = '123456';
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

  console.log('Tạo tài khoản theo yêu cầu...');

  // 1. Tạo tài khoản User: user@gmail.com / 123456
  const user = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {
      passwordHash: passwordHash,
      name: 'Khách hàng (User)',
    },
    create: {
      name: 'Khách hàng (User)',
      email: 'user@gmail.com',
      phone: '0988123456',
      passwordHash: passwordHash,
    },
  });
  console.log('✓ Đã tạo/cập nhật User:', user.email);

  // 2. Tạo tài khoản Admin trong bảng User: admin@gmail.com / 123456
  const adminAsUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      passwordHash: passwordHash,
      name: 'Quản trị viên Hệ thống (Admin)',
    },
    create: {
      name: 'Quản trị viên Hệ thống (Admin)',
      email: 'admin@gmail.com',
      phone: '0987069242',
      passwordHash: passwordHash,
    },
  });
  console.log('✓ Đã tạo/cập nhật Admin trong bảng User:', adminAsUser.email);

  // 3. Tạo tài khoản Admin trong bảng AdminUser: username: admin@gmail.com & username: admin
  await prisma.adminUser.upsert({
    where: { username: 'admin@gmail.com' },
    update: {
      passwordHash: passwordHash,
      name: 'Quản trị viên Hệ thống (Admin)',
    },
    create: {
      username: 'admin@gmail.com',
      passwordHash: passwordHash,
      name: 'Quản trị viên Hệ thống (Admin)',
      role: 'SUPERADMIN',
    },
  });

  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: passwordHash,
    },
    create: {
      username: 'admin',
      passwordHash: passwordHash,
      name: 'Quản trị viên Hệ thống (Admin)',
      role: 'SUPERADMIN',
    },
  });
  console.log('✓ Đã tạo/cập nhật Admin trong bảng AdminUser: admin@gmail.com & admin');

  console.log('Hoàn thành tạo tài khoản!');
}

main()
  .catch((e) => {
    console.error('Lỗi khi tạo tài khoản:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

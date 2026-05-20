require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email    = 'admin@wandrer.vn';
  const password = 'Admin@2026';
  const name     = 'Admin Wandrer';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Nếu đã tồn tại thì đổi role thành ADMIN
    await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
    console.log('✅ Đã cập nhật role ADMIN cho:', email);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashed, role: 'ADMIN' },
  });

  console.log('✅ Tạo tài khoản admin thành công!');
  console.log('   Email   :', email);
  console.log('   Password:', password);
}

main()
  .catch(e => { console.error('❌ Lỗi:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@apncodix.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  });
  console.log('Admin user created/updated:', admin.email);

  const settings = [
    { key: 'websiteName', value: process.env.SITE_NAME || 'APN Codix' },
    { key: 'logoUrl', value: '/apn-codix-logo.svg' },
    { key: 'contactEmail', value: process.env.CONTACT_EMAIL || 'info@apncodix.com' },
    { key: 'phoneNumber', value: process.env.CONTACT_PHONE || '' },
    { key: 'enableBoatCursor', value: 'false' },
    {
      key: 'socialLinks',
      value: JSON.stringify({
        twitter: '',
        instagram: '',
        youtube: '',
        linkedin: '',
        facebook: '',
        github: '',
        telegram: '',
      }),
    },
  ];
  for (const s of settings) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('Website settings seeded (existing values preserved).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

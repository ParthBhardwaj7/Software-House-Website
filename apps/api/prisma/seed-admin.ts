import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('strongpassword123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hilo.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@hilo.com',
      password: hashedPassword,
    },
  });
  console.log('Admin user created/updated:', admin.email);

  // Seed default website settings
  const settings = [
    { key: 'websiteName', value: 'APN Codix' },
    { key: 'logoUrl', value: '/apn-codix-logo.svg' },
    { key: 'contactEmail', value: 'info@apncodix.com' },
    { key: 'phoneNumber', value: '32423423423' },
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
      update: { value: s.value },
      create: s,
    });
  }
  console.log('Website settings seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

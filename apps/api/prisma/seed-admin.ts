import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─── Admin Credentials ────────────────────────────────────────────────────────
// Change these before first deploy, then update via admin panel (/anish)
const ADMIN_EMAIL    = 'admin@apncodix.com';
const ADMIN_PASSWORD = 'Apncodix@2024!';
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where:  { email: ADMIN_EMAIL },
    update: { password: hashedPassword },
    create: { email: ADMIN_EMAIL, password: hashedPassword },
  });
  console.log('[seed] Admin ready:', admin.email);

  const defaults = [
    { key: 'websiteName',    value: 'APN Codix' },
    { key: 'logoUrl',        value: '/apn-codix-logo.svg' },
    { key: 'contactEmail',   value: 'info@apncodix.com' },
    { key: 'phoneNumber',    value: '' },
    { key: 'enableBoatCursor', value: 'false' },
    { key: 'socialLinks',    value: JSON.stringify({ twitter:'', instagram:'', youtube:'', linkedin:'', facebook:'', github:'', telegram:'' }) },
  ];

  for (const s of defaults) {
    await prisma.settings.upsert({
      where:  { key: s.key },
      update: {},          // never overwrite — admin panel changes are preserved
      create: s,
    });
  }
  console.log('[seed] Settings ready (existing values preserved).');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

// Plain JS seed — runs directly with node, no tsc compilation needed.
// Called from entrypoint.sh after prisma migrate deploy.
// prisma/ directory is already COPY'd into the runner stage.

'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@apncodix.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Apncodix@2024!';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where:  { email: ADMIN_EMAIL },
    update: { password: hash },
    create: { email: ADMIN_EMAIL, password: hash },
  });
  console.log('[seed] Admin ready:', admin.email);

  const defaults = [
    { key: 'websiteName',      value: 'APN Codix' },
    { key: 'logoUrl',          value: '/apn-codix-logo.svg' },
    { key: 'contactEmail',     value: 'info@apncodix.com' },
    { key: 'phoneNumber',      value: '' },
    { key: 'enableBoatCursor', value: 'false' },
    { key: 'socialLinks',      value: JSON.stringify({ twitter:'', instagram:'', youtube:'', linkedin:'', facebook:'', github:'', telegram:'' }) },
  ];

  for (const s of defaults) {
    await prisma.settings.upsert({
      where:  { key: s.key },
      update: {},   // never overwrite — admin panel changes are preserved
      create: s,
    });
  }
  console.log('[seed] Settings ready (existing values preserved).');
}

main()
  .catch((e) => { console.error('[seed] ERROR:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());

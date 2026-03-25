import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@softwarehouse.com' },
    update: {},
    create: {
      email: 'admin@softwarehouse.com',
      password: hashedPassword,
    },
  });
  console.log('Admin user created:', admin.email);

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        { title: 'AI Automation', description: 'Streamline operations with intelligent automation.', problem: 'Manual processes slow you down', solution: 'Custom AI workflows', outcome: '50%+ time savings', sortOrder: 0 },
        { title: 'Custom Software', description: 'Tailored applications for your business needs.', problem: 'Off-the-shelf doesn\'t fit', solution: 'Purpose-built software', outcome: 'Exact fit for your workflow', sortOrder: 1 },
        { title: 'Web & App Development', description: 'Modern web and mobile applications.', problem: 'Legacy systems hold you back', solution: 'Modern tech stack', outcome: 'Faster, scalable products', sortOrder: 2 },
        { title: 'Backend Systems', description: 'Robust APIs and infrastructure.', problem: 'Brittle backend architecture', solution: 'NestJS, Prisma, PostgreSQL', outcome: 'Enterprise-grade reliability', sortOrder: 3 },
      ],
    });
    console.log('Default services created');
  }

  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          name: 'Alex Rivera',
          role: 'Lead Developer',
          bio: 'Full-stack engineer focused on scalable systems and clean architecture.',
          photoUrl: 'https://picsum.photos/seed/hilo-1/256/256',
          sortOrder: 0,
          linkedinUrl: 'https://linkedin.com',
        },
        {
          name: 'Sam Chen',
          role: 'Product Designer',
          bio: 'UI/UX craft with a passion for accessible, delightful interfaces.',
          photoUrl: 'https://picsum.photos/seed/hilo-2/256/256',
          sortOrder: 1,
        },
        {
          name: 'Jordan Blake',
          role: 'DevOps Engineer',
          bio: 'CI/CD, cloud infra, and keeping production calm under load.',
          photoUrl: 'https://picsum.photos/seed/hilo-3/256/256',
          sortOrder: 2,
          githubUrl: 'https://github.com',
        },
        {
          name: 'Morgan Lee',
          role: 'Frontend Developer',
          bio: 'React, performance, and pixel-perfect implementation.',
          photoUrl: 'https://picsum.photos/seed/hilo-4/256/256',
          sortOrder: 3,
        },
        {
          name: 'Casey Kim',
          role: 'Backend Developer',
          bio: 'APIs, databases, and pragmatic security.',
          photoUrl: 'https://picsum.photos/seed/hilo-5/256/256',
          sortOrder: 4,
        },
        {
          name: 'Riley Patel',
          role: 'QA Lead',
          bio: 'Test strategy, automation, and shipping with confidence.',
          photoUrl: 'https://picsum.photos/seed/hilo-6/256/256',
          sortOrder: 5,
        },
        {
          name: 'Taylor Brooks',
          role: 'Project Manager',
          bio: 'Clear communication, timelines, and stakeholder alignment.',
          photoUrl: 'https://picsum.photos/seed/hilo-7/256/256',
          sortOrder: 6,
        },
      ],
    });
    console.log('Default team members created');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

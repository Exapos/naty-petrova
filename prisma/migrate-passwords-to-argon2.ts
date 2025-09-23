import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (!user.password.startsWith('$argon2')) {
      const hash = await argon2.hash(user.password);
      await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
      console.log(`Migrated user ${user.email}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

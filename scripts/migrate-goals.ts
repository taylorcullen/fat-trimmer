/**
 * Migration script: Copies existing User.goalWeightKg values into Goal records.
 *
 * Usage:
 *   npx tsx scripts/migrate-goals.ts
 *
 * Safe to run multiple times — skips users who already have goals.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const usersWithGoals = await prisma.user.findMany({
    where: {
      goalWeightKg: { not: null },
    },
    select: {
      id: true,
      goalWeightKg: true,
      _count: { select: { goals: true } },
    },
  });

  let migrated = 0;
  let skipped = 0;

  for (const user of usersWithGoals) {
    if (user._count.goals > 0) {
      skipped++;
      continue;
    }

    await prisma.goal.create({
      data: {
        userId: user.id,
        targetWeightKg: user.goalWeightKg!,
      },
    });
    migrated++;
  }

  console.log(
    `Migration complete: ${migrated} goal(s) created, ${skipped} user(s) skipped (already had goals).`
  );
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

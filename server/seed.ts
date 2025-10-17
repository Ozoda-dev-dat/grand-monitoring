import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const adminAccounts = [
  {
    username: "Studentaffairs",
    password: "STaffairs2233",
    role: "student_affairs" as const,
    email: "studentaffairs@pdp.edu",
    firstName: "Student",
    lastName: "Affairs Admin",
  },
  {
    username: "Academicaffairs",
    password: "ACaffairs2233",
    role: "academic_affairs" as const,
    email: "academicaffairs@pdp.edu",
    firstName: "Academic",
    lastName: "Affairs Admin",
  },
  {
    username: "admin",
    password: "admin2233",
    role: "grant_committee" as const,
    email: "sponsors@pdp.edu",
    firstName: "Grant",
    lastName: "Committee Admin",
  },
];

export async function seedAdminAccounts() {
  console.log("🌱 Seeding admin accounts...");

  for (const account of adminAccounts) {
    try {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, account.username));

      if (existingUser) {
        console.log(`✓ User ${account.username} already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(account.password, 10);

      await db.insert(users).values({
        username: account.username,
        password: hashedPassword,
        role: account.role,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
      });

      console.log(`✓ Created ${account.role} account: ${account.username}`);
    } catch (error) {
      console.error(`✗ Failed to create ${account.username}:`, error);
    }
  }

  console.log("✓ Admin accounts seeding complete");
}

seedAdminAccounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });

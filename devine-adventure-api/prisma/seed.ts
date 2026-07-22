// prisma/seed.ts
import { PrismaClient, EventCategory, Difficulty, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminHash = await bcrypt.hash('Admin@2025!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@devineadventure.co.ke' },
    update: {},
    create: {
      name: 'Devine Admin',
      email: 'admin@devineadventure.co.ke',
      phone: '+254700000000',
      passwordHash: adminHash,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  // Demo member
  const memberHash = await bcrypt.hash('Member@2025!', 12);
  await prisma.user.upsert({
    where: { email: 'member@devineadventure.co.ke' },
    update: {},
    create: {
      name: 'Jane Mwangi',
      email: 'member@devineadventure.co.ke',
      phone: '+254711000001',
      passwordHash: memberHash,
      role: Role.MEMBER,
      isVerified: true,
    },
  });

  // Events
  const events = [
    {
      title: 'Mt. Kenya Summit – Sirimon Route',
      slug: 'mt-kenya-summit-sirimon',
      description: 'Conquer Point Lenana (4,985m) via the scenic Sirimon Route. 4-day guided expedition with camping gear included.',
      location: 'Mt. Kenya National Park, Nanyuki',
      difficulty: Difficulty.ADVANCED,
      dateTime: new Date('2025-09-15T06:00:00Z'),
      endDateTime: new Date('2025-09-18T16:00:00Z'),
      price: 18500,
      memberPrice: 15000,
      isFree: false,
      capacity: 12,
      category: EventCategory.HIKE,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Ngong Hills Sunrise Hike',
      slug: 'ngong-hills-sunrise-hike',
      description: 'Catch the sunrise from the iconic Ngong Hills overlooking the Rift Valley. Beginner-friendly, 4-hour hike.',
      location: 'Ngong Hills, Kajiado County',
      difficulty: Difficulty.BEGINNER,
      dateTime: new Date('2025-08-10T05:30:00Z'),
      price: 2500,
      memberPrice: 0,
      isFree: false,
      capacity: 25,
      category: EventCategory.HIKE,
      images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa'],
      isPublished: true,
      isFeatured: false,
    },
    {
      title: "Hell's Gate Cycling Adventure",
      slug: 'hells-gate-cycling',
      description: "Cycle through Hell's Gate National Park among zebras and giraffes. Bikes provided. Half-day trip.",
      location: "Hell's Gate National Park, Naivasha",
      difficulty: Difficulty.MODERATE,
      dateTime: new Date('2025-08-24T07:00:00Z'),
      price: 4500,
      memberPrice: 3500,
      isFree: false,
      capacity: 20,
      category: EventCategory.BIKE,
      images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890'],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Aberdare Forest Night Trail',
      slug: 'aberdare-night-trail',
      description: 'An unforgettable nocturnal hike through the Aberdare Forest. Guided, limited slots.',
      location: 'Aberdare National Park, Nyeri',
      difficulty: Difficulty.MODERATE,
      dateTime: new Date('2025-09-05T20:00:00Z'),
      price: 6500,
      memberPrice: 5000,
      isFree: false,
      capacity: 10,
      category: EventCategory.HIKE,
      images: ['https://images.unsplash.com/photo-1448375240586-882707db888b'],
      isPublished: true,
      isFeatured: false,
    },
    {
      title: 'Member Free: Karura Forest Walk',
      slug: 'karura-forest-walk-free',
      description: 'Monthly members-free nature walk in Karura Forest. Learn about indigenous trees and birdlife.',
      location: 'Karura Forest, Nairobi',
      difficulty: Difficulty.BEGINNER,
      dateTime: new Date('2025-08-02T07:30:00Z'),
      price: 1500,
      memberPrice: 0,
      isFree: true,
      capacity: 30,
      category: EventCategory.HIKE,
      images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e'],
      isPublished: true,
      isFeatured: false,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: { ...event, price: event.price, memberPrice: event.memberPrice ?? null },
    });
  }

  console.log('✅ Seed complete');
  console.log(`   Admin: admin@devineadventure.co.ke / Admin@2025!`);
  console.log(`   Member: member@devineadventure.co.ke / Member@2025!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

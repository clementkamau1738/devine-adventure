// prisma/seed.ts
import { PrismaClient, EventCategory, Difficulty, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/** Local date at hour:minute, offset by whole days from today. */
function atDay(offsetDays: number, hour = 7, minute = 0): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  console.log('Seeding database...');

  const adminHash = await bcrypt.hash('Admin@2025!', 12);
  await prisma.user.upsert({
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

  // Relative dates so the calendar always has upcoming trips with photos
  const events = [
    {
      title: 'Member Free: Karura Forest Walk',
      slug: 'karura-forest-walk-free',
      description:
        'Monthly members-free nature walk under Karura’s canopy. Guides point out indigenous trees, waterfalls, and birdlife. Ideal first trail for new members.',
      location: 'Karura Forest, Nairobi',
      difficulty: Difficulty.BEGINNER,
      dateTime: atDay(5, 7, 30),
      endDateTime: null as Date | null,
      price: 1500,
      memberPrice: 0,
      isFree: true,
      capacity: 30,
      enrolled: 18,
      category: EventCategory.HIKE,
      images: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
      ],
      isPublished: true,
      isFeatured: false,
    },
    {
      title: 'Ngong Hills Sunrise Hike',
      slug: 'ngong-hills-sunrise-hike',
      description:
        'Catch first light from the iconic Ngong Hills overlooking the Rift Valley. Beginner-friendly 4-hour ridge walk with tea at the summit.',
      location: 'Ngong Hills, Kajiado County',
      difficulty: Difficulty.BEGINNER,
      dateTime: atDay(12, 5, 30),
      endDateTime: null,
      price: 2500,
      memberPrice: 0,
      isFree: false,
      capacity: 25,
      enrolled: 21,
      category: EventCategory.HIKE,
      images: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200',
      ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "Hell's Gate Cycling Adventure",
      slug: 'hells-gate-cycling',
      description:
        "Pedal through Hell's Gate among zebras and giraffes. Bikes, helmets, and park fees included. Half-day trip with a cliff-view picnic stop.",
      location: "Hell's Gate National Park, Naivasha",
      difficulty: Difficulty.MODERATE,
      dateTime: atDay(19, 7, 0),
      endDateTime: null,
      price: 4500,
      memberPrice: 3500,
      isFree: false,
      capacity: 20,
      enrolled: 9,
      category: EventCategory.BIKE,
      images: [
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200',
      ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Aberdare Forest Night Trail',
      slug: 'aberdare-night-trail',
      description:
        'Nocturnal hike through misty Aberdare forest. Headlamps on, limited to 10 for an intimate wildlife-and-stars experience. Guided throughout.',
      location: 'Aberdare National Park, Nyeri',
      difficulty: Difficulty.MODERATE,
      dateTime: atDay(26, 20, 0),
      endDateTime: null,
      price: 6500,
      memberPrice: 5000,
      isFree: false,
      capacity: 10,
      enrolled: 8,
      category: EventCategory.HIKE,
      images: [
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200',
      ],
      isPublished: true,
      isFeatured: false,
    },
    {
      title: 'Mt. Kenya Summit – Sirimon Route',
      slug: 'mt-kenya-summit-sirimon',
      description:
        'Conquer Point Lenana (4,985m) via the scenic Sirimon Route. 4-day guided expedition with camping gear, porters, and meals included.',
      location: 'Mt. Kenya National Park, Nanyuki',
      difficulty: Difficulty.ADVANCED,
      dateTime: atDay(35, 6, 0),
      endDateTime: atDay(38, 16, 0),
      price: 18500,
      memberPrice: 15000,
      isFree: false,
      capacity: 12,
      enrolled: 7,
      category: EventCategory.HIKE,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Longonot Crater Day Hike',
      slug: 'longonot-crater-day-hike',
      description:
        'Climb the rim of Mt. Longonot and walk the full crater loop. Steep start, huge Rift Valley views, and a proper workout for intermediate hikers.',
      location: 'Mt. Longonot National Park, Naivasha',
      difficulty: Difficulty.MODERATE,
      dateTime: atDay(9, 6, 30),
      endDateTime: null,
      price: 3200,
      memberPrice: 2200,
      isFree: false,
      capacity: 22,
      enrolled: 14,
      category: EventCategory.HIKE,
      images: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
      ],
      isPublished: true,
      isFeatured: false,
    },
    {
      title: 'Oloolua Nature Trail & Caves',
      slug: 'oloolua-nature-trail',
      description:
        'Shaded forest paths, a waterfall, and the Oloolua caves just outside Nairobi. Perfect half-day for families and first-timers.',
      location: 'Oloolua Nature Trail, Karen',
      difficulty: Difficulty.BEGINNER,
      dateTime: atDay(16, 8, 0),
      endDateTime: null,
      price: 1800,
      memberPrice: 0,
      isFree: false,
      capacity: 28,
      enrolled: 6,
      category: EventCategory.HIKE,
      images: [
        'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200',
      ],
      isPublished: true,
      isFeatured: false,
    },
    {
      title: 'Menengai Crater Rim Trail',
      slug: 'menengai-crater-rim',
      description:
        'Walk the rim of one of the world’s largest calderas above Nakuru. Cool highland air, geothermal views, and a packed lunch on the ridge.',
      location: 'Menengai Crater, Nakuru',
      difficulty: Difficulty.MODERATE,
      dateTime: atDay(42, 7, 0),
      endDateTime: null,
      price: 4800,
      memberPrice: 3800,
      isFree: false,
      capacity: 18,
      enrolled: 4,
      category: EventCategory.HIKE,
      images: [
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200',
      ],
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Private: Team Building — Karura',
      slug: 'private-team-building-karura',
      description:
        'Custom private booking for teams of 8–40. Facilitated trail challenges, picnic setup, and a Devine guide dedicated to your group.',
      location: 'Karura Forest, Nairobi',
      difficulty: Difficulty.BEGINNER,
      dateTime: atDay(22, 9, 0),
      endDateTime: null,
      price: 12000,
      memberPrice: 12000,
      isFree: false,
      capacity: 40,
      enrolled: 1,
      category: EventCategory.PRIVATE,
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200',
      ],
      isPublished: true,
      isFeatured: false,
    },
    {
      title: 'Trail Fitness Training — Ngong',
      slug: 'trail-fitness-ngong',
      description:
        'Structured hill intervals and technique coaching on the Ngong foothills. Bring trail shoes — we supply a coach and recovery stretch session.',
      location: 'Ngong Hills, Kajiado County',
      difficulty: Difficulty.ADVANCED,
      dateTime: atDay(14, 6, 0),
      endDateTime: null,
      price: 2800,
      memberPrice: 1800,
      isFree: false,
      capacity: 15,
      enrolled: 12,
      category: EventCategory.TRAINING,
      images: [
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
      ],
      isPublished: true,
      isFeatured: false,
    },
  ];

  for (const event of events) {
    const { slug, ...data } = event;
    await prisma.event.upsert({
      where: { slug },
      update: {
        title: data.title,
        description: data.description,
        location: data.location,
        difficulty: data.difficulty,
        dateTime: data.dateTime,
        endDateTime: data.endDateTime,
        price: data.price,
        memberPrice: data.memberPrice,
        isFree: data.isFree,
        capacity: data.capacity,
        enrolled: data.enrolled,
        category: data.category,
        images: data.images,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
      },
      create: {
        slug,
        ...data,
        price: data.price,
        memberPrice: data.memberPrice ?? null,
      },
    });
  }

  console.log('Seed complete');
  console.log('   Admin: admin@devineadventure.co.ke / Admin@2025!');
  console.log('   Member: member@devineadventure.co.ke / Member@2025!');
  console.log(`   ${events.length} adventures (dates relative to today)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@norvexsports.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe!2026';

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      name: 'Norvex Admin',
    },
  });

  const services = [
    {
      slug: 'football-development-program',
      title: 'Football Development Program',
      shortDesc: 'Grassroots to Elite — a structured pathway for every player.',
      longDesc:
        'A structured pathway designed to develop players from beginner to advanced levels, focusing on technical skills, game awareness, and overall performance. Sessions progress through clear age- and skill-banded stages so every player has a route from first touch to elite competition.',
      icon: 'trophy',
    },
    {
      slug: 'one-to-one-coaching',
      title: 'One-to-One & Community Coaching',
      shortDesc: 'Personal sessions plus group programs for the wider community.',
      longDesc:
        'Personalized training sessions for individual improvement, alongside group-based community programs that build chemistry, fitness and game intelligence. Ideal for players who want focused attention on a specific position, skill set, or weakness.',
      icon: 'user',
    },
    {
      slug: 'advanced-player-development',
      title: 'Advanced Player Development',
      shortDesc: 'High-performance training for players chasing the next level.',
      longDesc:
        'High-performance training sessions tailored for players aiming to compete at a professional or competitive level. Combines tactical periodisation, video analysis, physical loading and mental conditioning.',
      icon: 'flame',
    },
    {
      slug: 'adult-football-training',
      title: 'Adult Football Training',
      shortDesc: 'Stay sharp — fitness, skill work, and match play for adults.',
      longDesc:
        'Training programs for adults focusing on fitness, skill development, and competitive match play. Whether returning to the game or playing for life, sessions adapt to your level.',
      icon: 'shield',
    },
    {
      slug: 'tournament-event-organization',
      title: 'Tournament & Event Organization',
      shortDesc: 'Professional planning and execution of football events.',
      longDesc:
        'Professional planning and execution of football tournaments, leagues, and events — from fixturing and refereeing to logistics, branding and broadcast.',
      icon: 'calendar',
    },
    {
      slug: 'school-college-coaching',
      title: 'School & College Coaching',
      shortDesc: 'Customized football programs delivered to your institution.',
      longDesc:
        'Customized football training programs conducted in schools and colleges. We integrate with academic schedules to deliver age-appropriate technical, tactical, and physical curricula.',
      icon: 'building',
    },
    {
      slug: 'fitness-conditioning',
      title: 'Fitness & Conditioning',
      shortDesc: 'Strength, endurance, agility, and injury-prevention sessions.',
      longDesc:
        'Specialized sessions focused on strength, endurance, agility, and injury prevention — designed by sports-science principles and individualized to the player.',
      icon: 'activity',
    },
    {
      slug: 'talent-identification-trials',
      title: 'Talent Identification & Trials',
      shortDesc: 'Showcase your skills. Get scouted. Earn your shot.',
      longDesc:
        'Opportunities for players to showcase their skills and get identified for advanced programs. Our academy gives every child the exposure to be scouted for professional clubs through domestic and international tournaments.',
      icon: 'target',
    },
  ];

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { /* keep editable copy untouched on reseed */ },
      create: { ...s, order: i, isActive: true },
    });
  }

  const events = [
    {
      slug: 'norvex-youth-league',
      title: 'Norvex Youth League',
      summary: 'Structured league matches across age groups in a pro environment.',
      description:
        'The Norvex Youth League brings competitive football to every age group. Round-robin and knockout stages, qualified referees, and full match reporting give players a taste of the professional environment.',
      category: 'League',
      isFeatured: true,
    },
    {
      slug: 'football-development-clinics',
      title: 'Football Development Clinics',
      summary: 'Short, intensive programs to sharpen skills, fitness and IQ.',
      description:
        'Short-term intensive programs focused on skill development, fitness, and game understanding. Run during school holidays and weekend windows.',
      category: 'Clinic',
    },
    {
      slug: 'talent-identification-trials',
      title: 'Talent Identification Trials',
      summary: 'Open trials to identify and select promising players.',
      description:
        'Open trials conducted to identify and select promising players for advanced training programs. Bring your boots and your best.',
      category: 'Trial',
    },
    {
      slug: 'friendly-matches-seasonal-tournaments',
      title: 'Friendly Matches & Seasonal Tournaments',
      summary: 'Regular match play to apply training to the real game.',
      description:
        'Regular match opportunities to help players apply their training in real game situations. Competitive tournaments conducted during holidays and special seasons to maximize player exposure.',
      category: 'Tournament',
    },
    {
      slug: 'football-themed-birthday-parties',
      title: 'Football-Themed Birthday Parties',
      summary: 'Mini matches, custom jerseys, trophies, live commentary.',
      description:
        'Unique and fun football birthday experiences including mini matches, skill-based games, and engaging football activities. Packages can include custom jerseys, mini trophies or medals, and live match commentary with music — creating a truly memorable celebration for young players. Flexible packages available (Basic, Premium, and Elite) to suit different requirements.',
      category: 'Party',
    },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: { /* keep editable copy untouched on reseed */ },
      create: { ...e, isActive: true },
    });
  }

  const team = [
    {
      name: 'Shoukath',
      role: 'Co-Founder & Head of Youth Development',
      bio: 'Shoukath leads Norvex youth pathways, designing the curriculum that takes players from first touch to first team. His sessions focus on technique, decision-making and competitive maturity.',
      qualifications: 'Coaching Licence (pending listing)',
      experience: 'Years of youth coaching experience',
    },
    {
      name: 'Riyas',
      role: 'Co-Founder & Head of Grassroots',
      bio: 'Riyas builds the grassroots base — community programs, school partnerships, and the open trials that surface the next generation of Norvex players.',
      qualifications: 'Grassroots coaching credentials',
      experience: 'Years of grassroots development',
    },
    {
      name: 'Shuraih',
      role: 'Co-Founder & Operations Lead',
      bio: 'Shuraih runs the day-to-day — venues, scheduling, logistics, fixturing and the back-of-house that keeps every session and event running on time.',
      qualifications: 'Operations & event management',
      experience: 'Multi-event operational lead',
    },
    {
      name: 'Minhaj',
      role: 'Co-Founder & Marketing Lead',
      bio: 'Minhaj shapes how Norvex tells its story — brand, digital, partnerships, and the player journeys that make the academy visible to the families and clubs it serves.',
      qualifications: 'Marketing & digital strategy',
      experience: 'Brand-build and growth marketing',
    },
  ];

  for (let i = 0; i < team.length; i++) {
    const t = team[i];
    const existing = await prisma.teamMember.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.teamMember.create({ data: { ...t, order: i, isActive: true } });
    }
  }

  const news = [
    {
      slug: 'welcome-to-norvex-sports',
      title: 'Welcome to Norvex Sports',
      excerpt: 'Norvex Sports launches in Hyderabad — a professional football development platform.',
      body: 'Founded in 2026, Norvex Sports is now open to players across Hyderabad. Trials, league registrations and clinics are running through the season — get in touch to start your journey.',
      isPublished: true,
      publishedAt: new Date(),
      tags: ['announcement', 'launch'],
    },
    {
      slug: 'norvex-youth-league-kick-off',
      title: 'Norvex Youth League — Kick-Off',
      excerpt: 'The Norvex Youth League opens registrations across age groups.',
      body: 'Our flagship league competition launches with structured fixtures, qualified officials, and the kind of competitive environment players need to grow.',
      isPublished: true,
      publishedAt: new Date(),
      tags: ['league', 'event'],
    },
    {
      slug: 'open-trials-announcement',
      title: 'Open Trials Announcement',
      excerpt: 'Showcase your game. Our open trials are coming — get on the list.',
      body: 'Open trials for advanced training and the Norvex squad will run across the city. Bring your boots, bring your best — every child gets a fair look.',
      isPublished: true,
      publishedAt: new Date(),
      tags: ['trial', 'announcement'],
    },
  ];

  for (const n of news) {
    await prisma.newsPost.upsert({ where: { slug: n.slug }, update: {}, create: n });
  }

  const settings: Record<string, string> = {
    'site.tagline': 'Football Development. Done Professionally.',
    'site.aboutShort':
      'Founded in 2026 in Hyderabad, Norvex Sports is a professional football development platform dedicated to nurturing players through structured functional training and expert coaching.',
    'site.aboutLong':
      "Founded in 2026 in Hyderabad, Norvex Sports is a professional football development platform dedicated to nurturing players through structured functional training and expert coaching. Built on a strong passion for the game, we aim to create an environment where players can continuously improve their skills, confidence, and overall performance through high intensive training.\n\nWhat began as a grassroots initiative with a small group of aspiring players has grown into a structured platform offering academy training, one-to-one coaching, and team building to achieve competitive opportunities. Our training approach combines technical development, physical conditioning, and game awareness to ensure complete player growth.\n\nAt Norvex Sports, we believe in discipline, consistency, and continuous improvement. Our goal is not just to train players, but to guide them throughout their journey — helping them unlock their full potential both on and off the field.",
    'site.projectStatement':
      'At Norvex Sports, our project is to create a structured and professional environment where athletes can develop their skills, confidence, and overall performance through expert coaching and continuous development. Starting with football, we aim to build a strong sports development platform that supports athletes from grassroots to elite levels while expanding across multiple sports and cities in the future. Through discipline, consistency, and competitive exposure, we strive to create opportunities that help individuals grow both on and off the field.',
    'contact.phone': process.env.NEXT_PUBLIC_PHONE ?? '+91 80899 20562',
    'contact.email': process.env.NEXT_PUBLIC_EMAIL ?? 'support@norvexsports.in',
    'contact.whatsapp': process.env.NEXT_PUBLIC_WHATSAPP ?? '918089920562',
    'contact.location': 'Hyderabad, Telangana, India',
    'contact.careersEmail': 'careers@norvexsports.in',
    'social.instagram': 'https://www.instagram.com/norvexsports?igsh=MXVtOXEwdmFwb3B2YQ==',
    'social.facebook': 'https://www.facebook.com/share/1B2MxrehXu/',
    'social.linkedin': 'https://www.linkedin.com/company/norvex-sports/',
    'social.youtube': '',
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log('Seed complete.');
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

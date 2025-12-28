
import { PrismaClient, TaskStatus, DeliveryStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting seed...');

    // Upsert Users
    const santa = await prisma.user.upsert({
        where: { email: 'santa@northpole.com' },
        update: {},
        create: {
            email: 'santa@northpole.com',
            passwordHash: 'hashed_secret',
            name: 'Santa Claus',
            role: 'admin',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Santa',
        },
    });

    const elf = await prisma.user.upsert({
        where: { email: 'elf@workshop.com' },
        update: {},
        create: {
            email: 'elf@workshop.com',
            passwordHash: 'hashed_secret',
            name: 'Buddy the Elf',
            role: 'worker',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
        },
    });

    // Create Children if not exists
    const timmy = await prisma.child.create({
        data: {
            name: 'Timmy Turner',
            age: 10,
            location: 'Dimmsdale, USA',
            category: 'nice',
        },
    });

    const vicky = await prisma.child.create({
        data: {
            name: 'Vicky',
            age: 16,
            location: 'Dimmsdale, USA',
            category: 'naughty',
        },
    });

    // Create Wishlist for Timmy
    const timmyList = await prisma.wishlist.create({
        data: {
            childId: timmy.id,
            items: {
                create: [
                    {
                        giftName: 'Crimson Chin Action Figure',
                        description: 'Limited Edition',
                        priority: 'high',
                        status: 'approved',
                    },
                ],
            },
        },
    });

    // Create Tasks
    await prisma.task.create({
        data: {
            title: 'Build Crimson Chin Figure',
            description: 'Assemble the action figure parts',
            giftType: 'Toy',
            quantity: 1,
            priority: 'high',
            status: TaskStatus.pending,
            assignedTo: elf.id,
        },
    });

    // Create Deliveries
    await prisma.delivery.create({
        data: {
            childId: timmy.id,
            region: 'North America',
            address: '123 Dimmsdale Blvd',
            giftItems: ['Crimson Chin Action Figure'],
            status: DeliveryStatus.pending,
            deliveryDate: new Date('2025-12-25'),
        },
    });

    console.log('✅ Seed finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

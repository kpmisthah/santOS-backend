
import { prisma } from './src/lib/prisma';

async function main() {
    const trackingId = '13bb6889-494f-4d18-8461-354f6e7aa349';
    console.log(`Checking Delivery ID: ${trackingId}`);

    const delivery = await prisma.delivery.findUnique({
        where: { id: trackingId },
        include: { child: true }
    });

    if (!delivery) {
        console.log('Delivery NOT FOUND');
        return;
    }

    console.log('Delivery Found:', delivery);
    console.log('Child Name:', delivery.child?.name);

    if (delivery.child?.name) {
        const tasks = await prisma.task.findMany({
            where: {
                title: { contains: delivery.child.name }
            }
        });

        console.log('Matching Tasks:', tasks);
    } else {
        console.log('No child matched?');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

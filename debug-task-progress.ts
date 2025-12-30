
import { prisma } from './src/lib/prisma';

async function main() {
    const task = await prisma.task.findFirst({
        where: {
            title: { contains: 'udhay', mode: 'insensitive' }
        }
    });

    if (task) {
        console.log('Task found:', task);
        console.log('Progress:', task.progress);
        console.log('Status:', task.status);
    } else {
        console.log('No task found for udhay');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

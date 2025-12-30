
import { prisma } from './src/lib/prisma';

async function main() {
    const allTasks = await prisma.task.findMany();
    console.log('All Tasks:', allTasks.map(t => ({ id: t.id, title: t.title, status: t.status })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

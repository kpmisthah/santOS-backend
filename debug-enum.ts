
import { TaskStatus } from '@prisma/client';

console.log('TaskStatus keys:', Object.keys(TaskStatus));
console.log('TaskStatus.in_progress value:', TaskStatus.in_progress);
console.log('TaskStatus.in_progress type:', typeof TaskStatus.in_progress);

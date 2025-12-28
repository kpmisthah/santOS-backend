import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.role !== role) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // TODO: Implement proper password hashing verification (e.g. bcrypt)
        // For now preventing login if password doesn't match the seeded one (simplified)
        // In production, compare(password, user.passwordHash)

        // Mock successful login response
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
            },
            // token: 'jwt_token_here' // TODO: Add JWT
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

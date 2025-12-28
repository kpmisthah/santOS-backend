import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // Using arrow function to bind 'this' correctly when passed as callback
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, role } = req.body;

            if (!email || !password || !role) {
                res.status(400).json({ error: 'Email, password, and role are required' });
                return;
            }

            const result = await this.authService.login(email, role, password);
            res.json(result);
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.message === 'Invalid credentials' || error.message === 'Invalid role for this user') {
                res.status(401).json({ error: 'Invalid credentials' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };
}

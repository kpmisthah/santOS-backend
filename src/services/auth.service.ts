import { UserRepository } from '../repositories/user.repository';
import { Role } from '@prisma/client';

// Define types locally if not yet in a shared type file
interface LoginRequest {
    email: string;
    role: string; // passing as string from API, will validate
    password?: string;
}

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async login(email: string, role: string, password?: string): Promise<any> {
        console.log(`Attempting login for: ${email} with role: ${role}`);
        const user = await this.userRepository.findByEmail(email);
        console.log('User found:', user);

        if (!user) {
            console.error('Login failed: User not found');
            throw new Error('Invalid credentials');
        }

        if (user.role !== role) {
            console.error(`Login failed: Role mismatch. Expected ${user.role}, got ${role}`);
            throw new Error('Invalid role for this user');
        }

        // TODO: Add real password verification here (bcrypt)
        // if (!await bcrypt.compare(password, user.passwordHash)) ...

        // Return user profile (omitting sensitive data)
        const userProfile = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
        };

        return {
            message: 'Login successful',
            user: userProfile,
            // token: ... 
        };
    }
}

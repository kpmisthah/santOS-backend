import { UserRepository } from '../repositories/user.repository';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll();
        // Map to DTO if needed (exclude passwordHash)
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        }));
    }
}

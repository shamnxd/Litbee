import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if email already exists
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('An account with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Save user
        const user = await this.usersService.create(dto.email, dto.username, hashedPassword);

        return {
            message: 'Registration successful',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        };
    }

    async login(dto: LoginDto) {
        // Find user by email
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Verify password
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Sign JWT
        const payload = { sub: user._id.toString(), email: user.email };
        const access_token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            access_token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        };
    }

    logout() {
        return { message: 'Logged out successfully. Please discard your token on the client.' };
    }
}

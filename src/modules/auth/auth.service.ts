import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateDto) {
    const user = await this.usersService.create(dto);
    return { access_token: this.sign(user), user: this.sanitize(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.isActive) throw new UnauthorizedException('Credenciales inválidas');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    return { access_token: this.sign(user), user: this.sanitize(user) };
  }

  private sign(user: any) {
    return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
  }

  private sanitize(user: any) {
    const { password, resetToken, resetTokenExpiresAt, ...safe } = user;
    return safe;
  }
}
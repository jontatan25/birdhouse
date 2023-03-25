import { Injectable } from '@nestjs/common';
import { User } from './types/user.interface';

@Injectable()
export class AuthService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'admin',
        password: '$Shockbyte123',
      },
    ];
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = this.users.find(
      (user) => user.username === username && user.password === password,
    );
    return user;
  }
}

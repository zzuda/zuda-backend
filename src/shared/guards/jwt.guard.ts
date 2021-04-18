import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthError } from '../errors/auth.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<User>(err: Error, user: User): User {
    if (err || !user) {
      throw err || new UnauthorizedException(AuthError.PERMISSION);
    }
    return user;
  }
}

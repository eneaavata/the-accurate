import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
  Scope,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @Inject('SUPABASE_USER') private readonly userClient: SupabaseClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.user) return true;

    const authHeader = request.headers?.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('Missing token');

    const { data, error } = await this.userClient.auth.getClaims(token);
    if (error || !data) throw new UnauthorizedException('Invalid token');

    const claims = data.claims;

    request.user = {
      id: claims.sub,
      email: claims.email,
      role: claims.role,
      aud: claims.aud,
    };

    request.supabaseUser = this.userClient;

    return true;
  }
}

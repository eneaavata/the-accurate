import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
  Scope,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { extractBearerToken } from '../utils/bearer-token';
import { STRICT_SESSION_KEY } from '../decorators/strict-session.decorator';
import { Reflector } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('SUPABASE_USER') private readonly userClient: SupabaseClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.authorized) return true;

    const token = extractBearerToken(request);
    if (!token) throw new UnauthorizedException('Missing token');

    const strict = this.reflector.getAllAndOverride<boolean>(
      STRICT_SESSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (strict) {
      const { data, error } = await this.userClient.auth.getUser(token);
      if (error || !data) throw new UnauthorizedException('Invalid session');

      request.user = {
        id: data.user.id,
        email: data.user.email,
      };
    } else {
      const { data, error } = await this.userClient.auth.getClaims(token);
      if (error || !data) throw new UnauthorizedException('Invalid token');

      const claims = data.claims;

      request.user = {
        id: claims.sub,
        email: claims.email,
        role: claims.role,
        aud: claims.aud,
      };
    }

    request.supabaseUser = this.userClient;
    request.authorized = true;

    return true;
  }
}

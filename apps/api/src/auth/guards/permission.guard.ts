import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) return true;

    const request = context.switchToHttp().getRequest();

    const organisationId =
      request.params.organisationId ??
      request.body.organisationId ??
      request.query.organisationId;
    if (!organisationId)
      throw new ForbiddenException('Missing organisation ID');

    const userClient = request.supabaseUser;

    const { data, error } = await userClient.rpc('has_permission', {
      org_id: organisationId,
      required_permission: required,
    });

    if (error) throw new ForbiddenException('Permission check failed');
    if (!data) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}

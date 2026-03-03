import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'required_permission';

export const RequiredPermission = (permission: string) =>
  SetMetadata(PERMISSION_KEY, permission);

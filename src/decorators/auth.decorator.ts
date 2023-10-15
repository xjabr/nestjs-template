import { SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RolesGuard } from 'src/guards/roles.guard';

export const Authenticated = () => {
  return UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard);
}
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const HasPermission = (permission: string) => SetMetadata('permission', permission);
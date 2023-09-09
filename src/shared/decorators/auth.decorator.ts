import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role, RoleType, ValidRoles } from '../../shared/types';
import { JwtAuthGuard } from '../../app/auth/jwt-auth.guard';
import { RolesGuard } from '../../app/auth/roles.guard';

/**
 * This function is used to create a set of valid roles from the given roles.
 *
 * @param {...roles: RoleType[]} roles - The roles that need to be validated and transformed into a set.
 * @returns {ValidRoles} - Returns an array of unique, validated roles.
 * @throws {Error} - Throws an error if invalid role combinations are provided.
 */
function createValidRoles(...roles: RoleType[]): ValidRoles {
  // Create a Set from the provided roles. This will automatically remove any duplicates.
  const roleSet = new Set(roles);
  // If there are duplicate roles (i.e., the size of the set is not equal to the length of the input roles array), throw an error.
  if (roleSet.size !== roles.length) {
    throw new Error(
      'Invalid role combination. Duplicate roles are not allowed.',
    );
  }

  // Return the set of roles as an array.
  return Array.from(roleSet) as ValidRoles;
}

/**
 * @description A custom decorator that applies several decorators commonly used for authentication and authorization.
 * It applies the JwtAuthGuard for JWT-based authentication, sets metadata for role-based access control,
 * applies RolesGuard to check if the authenticated user has the required roles,
 * and sets up Swagger documentation decorators for bearer token authentication and unauthorized responses.
 *
 * @example
 * To restrict a route to 'USER' and 'ADMIN' roles, use:
 * ```typescript
 * @Auth('USER', 'ADMIN')
 * ```
 *
 * @example
 * To make a route accessible to all roles, use:
 * ```typescript
 * @Auth()
 * ```
 *
 * @param {...RoleType[]} roles - The roles that are allowed to access the decorated route. These roles are set as metadata for the RolesGuard to use.
 *
 * @returns This function returns nothing but applies several decorators to the decorated route.
 */
export function Auth(...rolesData: RoleType[]) {
  // If no roles are passed, default to all roles defined in Role
  if (rolesData.length === 0) {
    rolesData = Object.keys(Role) as RoleType[];
  }

  return applyDecorators(
    // Set metadata for role-based access control
    SetMetadata('role', createValidRoles(...rolesData)),
    // Use the JwtAuthGuard for JWT-based authentication
    // Apply RolesGuard to check if the authenticated user has the required roles

    UseGuards(JwtAuthGuard, RolesGuard),
    // Set up Swagger documentation decorators for bearer token authentication and unauthorized responses
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

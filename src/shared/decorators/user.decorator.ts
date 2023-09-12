import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ReqUser } from '../../app/user/entities/user.entity';

/**
 * @description A custom decorator that extracts the 'user' object from the request object in the context.
 * This decorator helps to directly access the authenticated user's email and role in any route handler.
 * The 'user' object is assumed to be populated by previous middleware (like an authentication middleware).
 *
 * @example
 * In your route handler, you can use this decorator as follows:
 * async function handleRequest(@User() user: ReqUser) {
 *   console.log(user.email);
 *   console.log(user.role);
 * }
 */
export const User = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<ReqUser> => {
    const { user } = ctx.switchToHttp().getRequest();
    return { email: user.email, role: user.role, sessionId: user.sessionId };
  },
);

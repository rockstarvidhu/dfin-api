import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { JWT } from "../../config";
import type { SessionTokenPayload } from "../../shared/types";
import { AuthService } from "./auth.service";

// Importing necessary modules and dependencies
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Constructor function is called when a new object is created
  constructor(private readonly authService: AuthService) {
    // Calling parent constructor with necessary parameters
    super({
      // Extracts JWT from the Authorization header where it's expected to come as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // If set to true, the token is accepted no matter what the expiration status is.
      // If false, the token is rejected if it is expired.
      ignoreExpiration: false,

      // This is the secret key used to sign the tokens. It can be either a string or a buffer.
      secretOrKey: JWT.SECRET,
    });
  }

  // The validate method is a required part of the strategy. It's used to provide the done callback function
  // which tells passport what user (or error) was found. It takes the payload from the JWT as its only parameter.
  async validate(payload: SessionTokenPayload) {
    await this.authService.getSession(payload.sessionId);
    // Here we're returning an object that contains the email, role, and sessionId properties from the payload.
    return {
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
    };
  }
}

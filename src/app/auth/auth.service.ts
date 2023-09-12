import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SessionData, SessionDataDocument } from "./entities/session.entity";
import { UserService } from "../user/user.service";
import { User, WarpedUser } from "../user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import type { SessionTokenPayload, AuthToken } from "../../shared/types";
import { LoginDto } from "./dto/login.dto";
import { Status } from "../../shared/types";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SessionData.name)
    private session: Model<SessionDataDocument>,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * Code validates the user's credentials when they log in
   * @param email
   * @param password
   * @returns  Promise<WarpedUser>
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    return (await this.userService.validateUser(email, password)) ?? null;
  }

  /**
   *  Login
   * @param email
   * @param password
   * @returns  { accessToken: string; refreshToken: string; }
   */
  async login(loginDto: LoginDto): Promise<AuthToken> {
    const isUser = (await this.validateUser(
      loginDto.email,
      loginDto.password
    )) as WarpedUser;
    console.log(
      "🚀 ~ file: auth.service.ts:37 ~ AuthService ~ login ~ isUser:",
      isUser
    );
    if (!isUser) {
      throw new NotFoundException("User not found");
    }
    // generate JWT
    const refreshToken = this.jwtService.sign(
      { email: isUser.email },
      { expiresIn: "30d" }
    );
    const session = new this.session({
      user: isUser,
      refreshToken,
      status: Status.ACTIVE,
    });
    await session.save();
    const payload: SessionTokenPayload = {
      email: isUser.email,
      sessionId: String(session._id),
      role: isUser.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, refreshToken };
  }

  /**
   *  Refresh Token
   * @param refreshToken
   * @returns  { accessToken: string; refreshToken: string; }
   */
  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const session = await this.session
      .findOne({ refreshToken, status: Status.ACTIVE })
      .populate("user")
      .exec();
    if (!session) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    if (session.user.status !== "ACTIVE") {
      throw new UnauthorizedException("User is not active");
    }

    const payload: SessionTokenPayload = {
      email: session.user.email,
      sessionId: String(session._id),
      role: session.user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(
      { email: session.user.email },
      { expiresIn: "30d" }
    );
    session.refreshToken = newRefreshToken;
    await session.save();
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   *  Logout
   * @param email
   * @returns  Promise<void>
   */

  async logout(sessionId: string): Promise<void> {
    const session = await this.session
      .findOne({ _id: sessionId, status: Status.ACTIVE })
      .exec();
    if (!session) {
      throw new NotFoundException("Session not found");
    }
    session.status = "INACTIVE";
    await session.save();
  }

  /**
   *  Get Session
   * @param sessionId
   * @returns  Promise<SessionData>
   */
  async getSession(sessionId: string): Promise<SessionData> {
    const session = await this.session
      .findOne({ _id: sessionId, status: Status.ACTIVE })
      .populate("user")
      .exec();
    if (!session) {
      throw new ForbiddenException("Session not found");
    }
    return session;
  }
}

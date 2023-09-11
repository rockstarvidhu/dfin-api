import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { NewUser, User, UserDocument } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { InjectModel } from "@nestjs/mongoose";
import { Status } from "../../shared/types";
import { DeleteUserDto } from "./dto/delete-user.dto";
const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private user: Model<UserDocument>
  ) {}

  /**
   *  hashPassword
   * @param password
   * @returns  Promise<string>
   */

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**
   *  create user
   * @param user
   * @returns  Promise<User>
   */

  async create(user: NewUser): Promise<User> {
    const createdUser = new this.user({
      ...user,
      passwordHash: await this.hashPassword(user.password),
    });
    return await createdUser.save();
  }

  /**
   *  validatePassword
   * @param password
   * @param hashedPassword
   * @returns  Promise<boolean>
   */
  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   *  Find a user by their email address
   * @param email
   * @returns  Promise<User | null>
   */

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.user.findOne({ email, status: Status.ACTIVE });
    if (!user) {
      throw new NotFoundException("User not found with this email");
    }
    return user;
  }

  /**
   *  Find a user by their id
   * @param id
   * @returns  Promise<User | null>
   */
  async findOneById(id: string): Promise<User | null> {
    return (await this.user.findById(id)) ?? null;
  }

  /**
   *  Find a user by their email address and updates a user in the database
   * @param id
   * @param user Partial<User>
   * @returns  Promise<User | null>
   */
  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    return (await this.user.findOneAndUpdate({ _id: id }, user)) ?? null;
  }

  /**
   *  validatePassword by passing email and password
   * @param email
   * @param password
   * @returns  Promise<User | null>
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findOneByEmail(email);
    if (await this.validatePassword(password, user.passwordHash)) {
      return user;
    }
    return null;
  }
  /**
   *  delete user by passing email
   * @param email
   * @returns  Promise<User | null>
   */
  async deleteUser(id: string): Promise<User | null> {
    const user = await this.findOneById(id);

    if (user) {
      const deletedUser = await this.user.findByIdAndDelete(user);
      return deletedUser;
    }
    return null;
  }

  /**
   *  get all suers
   * @returns  Promise<User[] | null>
   */
  async getAllUsers(): Promise<User[] | null> {
    return await this.user.find().exec();
  }
}

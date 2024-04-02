import { Injectable } from "@nestjs/common";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserInfoRequestDto } from "./dto/create-user-info-request.dto";
import { UpdateUserInfoRequestDto } from "./dto/update-user-info-request.dto";
import { GetUserTestQueryDto } from "./dto/get-user-test-query.dto";

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async getUserById(id: string): Promise<any> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException("user does not exists");
    }
    const { password, SortKey, ...result } = user;
    return result;
  }

  async create(userInfo: CreateUserInfoRequestDto): Promise<any> {
    const user = await this.usersRepository.findOneByEmail(userInfo.email);

    if (user) {
      throw new NotFoundException("user exist");
    }

    const item = await this.usersRepository.create(userInfo);
    const { password, SortKey, ...result } = item;
    return result;
  }

  async update(id: string, userInfo: UpdateUserInfoRequestDto): Promise<any> {
    if (!userInfo || Object.keys(userInfo).length === 0) {
      throw new BadRequestException(
        "At least one of nickname, gender, age is required.",
      );
    }

    const user = await this.usersRepository.update(id, userInfo);
    const { password, SortKey, ...result } = user;
    return result;
  }

  async getUserTest(id: string, query: GetUserTestQueryDto): Promise<any> {
    const limit = query.limit;
    const encodedStartKey = query.startkey;
    let startKey: any;
    if (encodedStartKey) {
      const decodedString = Buffer.from(encodedStartKey, "base64").toString(
        "utf-8",
      );
      startKey = JSON.parse(decodedString);
    }

    const userTest = await this.usersRepository.findUserTest(
      id,
      limit,
      startKey,
    );
    return userTest;
  }
}

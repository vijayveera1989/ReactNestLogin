import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserDetails } from './user-details.interface';

@Injectable()
export class UserService {
  
  constructor(@InjectModel('User') private readonly userModel:Model<UserDocument>,) {}

  getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id as string,
      name: user.name,
      email: user.email,
    };
  }

  // Find user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

    // Find user by ID
  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this.getUserDetails(user);
  }

  // create a new User
  async createUser(name: string,email: string,hashedPassword: string,): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }
}

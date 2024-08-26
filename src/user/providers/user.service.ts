import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}


    public seyHello(){
        return 'Hello World';
    }

    public async createUser(userDetails: object){

        let newUser = this.userRepository.create(userDetails)

        await this.userRepository.save(newUser)

        return newUser;
        
    };

    // Method to find a user by their third-party ID and provider
  public async findOneByThirdPartyId(thirdPartyId: string, provider: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { thirdPartyId, provider } });
  }

  // Method to create a new user from OAuth data
  public async createOAuthUser(thirdPartyId: string, provider: string, profile: any): Promise<User> {
    const newUser = this.userRepository.create({
      thirdPartyId,
      provider,
      email: profile.emails[0].value,
      name: profile.displayName,
    });
    return this.userRepository.save(newUser);
  }

   // Method to find a user by ID
   public async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Find or create method
  public async findOrCreate(thirdPartyId: string, provider: string, profile: any): Promise<User> {
    let user = await this.findOneByThirdPartyId(thirdPartyId, provider);
    if (!user) {
      user = await this.createOAuthUser(thirdPartyId, provider, profile);
    }
    return user;
  }

  // Method to find a user by their email address
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}


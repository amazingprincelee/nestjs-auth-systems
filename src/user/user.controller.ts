import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './providers/user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ){}


    @Get()
    sayHello(){
        return this.userService.seyHello()
    }

    @Post()
    creatuser(@Body() userDetails: object){

        return this.userService.createUser(userDetails)

    }
}

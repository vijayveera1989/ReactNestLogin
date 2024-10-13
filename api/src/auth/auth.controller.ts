import { 
  Body, 
  Controller, 
  HttpCode, 
  HttpException, 
  HttpStatus, 
  Post, 
  UsePipes, 
  ValidationPipe, 
  Res, 
  Get, 
  Req 
} from '@nestjs/common';
import { ExistingUserDTO } from 'src/user/dtos/existing-user.dto';
import { NewUserDTO } from 'src/user/dtos/new-user.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() user: NewUserDTO, 
    @Res() res: Response
  ): Promise<Response | HttpException> {
    return this.authService.registerUser(user, res);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body() user: ExistingUserDTO, 
    @Res() res: Response
  ): Promise<Response | HttpException> {
    return this.authService.loginUser(user, res);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMe(@Req() req: Request, @Res() res: Response) {
    return this.authService.validateUserAndGetUserDetails(req,res);
  }
}

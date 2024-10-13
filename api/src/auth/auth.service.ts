
import { Injectable, HttpException, UnauthorizedException, BadRequestException, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { UserDetails } from './../user/user-details.interface';
import { ExistingUserDTO } from './../user/dtos/existing-user.dto';
import { NewUserDTO } from 'src/user/dtos/new-user.dto';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    // to hash the passoword
    async hashPassword(password: string): Promise<string> {
        this.logger.log('Hashing password');
        return bcrypt.hash(password, 12);
    }

    // password validation
    async doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // register the user
    async registerUser(user: Readonly<NewUserDTO>, res: Response): Promise<Response | HttpException> {
        try {

            const { name, email, password } = user;
            const existingUser = await this.userService.findByEmail(email);
            if (existingUser) {
                this.logger.error('User already exists');
                throw new ConflictException(
                    'An account with that email already exists!');
            }

            const hashedPassword = await this.hashPassword(password);
            await this.userService.createUser(name, email, hashedPassword);
            this.logger.log('User registered successfully');
            return res.send({ message: 'Resgitration successful' });

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                this.logger.error('Error during registration', error.stack);
                throw new InternalServerErrorException(
                    'An unexpected error occurred during registration'
                );
            }
        }
    }



    // validate the user
    async validateUserCredentials(email: string, password: string): Promise<UserDetails | HttpException> {

        this.logger.log('Validating user and getting details');
        // find the user
        const user = await this.userService.findByEmail(email);
        const doesUserExist = !!user;
        if (!doesUserExist) {
            this.logger.error('User already exists');
            throw new UnauthorizedException(
                'User does not exists!',
            );
        }

        // verify the password
        const doesPasswordMatch = await this.doesPasswordMatch(
            password,
            user.password,
        );

        if (!doesPasswordMatch) {
            this.logger.error('Username or Password is incorrect!');
            throw new UnauthorizedException(
                'Username or Password is incorrect!'
            );
        }

        return this.userService.getUserDetails(user);
    }


    // login the user
    async loginUser(existingUser: ExistingUserDTO, res: Response): Promise<Response | HttpException> {

        this.logger.log('Logging in user');
        // validate the user details
        const { email, password } = existingUser;
        const user = await this.validateUserCredentials(email, password);

        if (!user) {
            this.logger.error('Credentials invalid!');
            throw new UnauthorizedException('Credentials invalid!');
        }

        // create the jwt token
        const jwt = await this.jwtService.signAsync({ user }, { expiresIn: '1h' }); // TODO pass expiry details
        res.cookie('token', jwt, { httpOnly: true, secure: false, sameSite: 'none' }); // todo false for local dev
        return res.send({ token: jwt });
    }


    // validate the user using JWT token and return the user details
    async validateUserAndGetUserDetails(request: Request, res: Response): Promise<Response | HttpException> {

        this.logger.log('Validating user and getting details');
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new BadRequestException('No authorization header provided');
        }

        const token = authHeader.split(' ')[1]; // Extract the token from the header
        if (!token) {
            this.logger.error('No token provided');
            throw new BadRequestException('No token provided');
        }

        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userService.findById(decoded.user.id);
            if (!user) {
                this.logger.error('User not found');
                throw new UnauthorizedException('User not found');
            }
            this.logger.log('User validated successfully');
            return res.send({ userDetails: user });
        } catch (error) {
            this.logger.error('Invalid token', error.stack);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";

export interface IAuthService {

    register(registerDto: RegisterDto): Promise<any>

    login(loginDto: LoginDto): Promise<any>
}
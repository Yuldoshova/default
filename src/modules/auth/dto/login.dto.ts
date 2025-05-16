import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class LoginDto {

    @ApiProperty({
        description: 'User\'s phone number (Uzbekistan format: +998XXXXXXXXX)',
        example: '+998901234567',
        maxLength: 13,
        minLength: 13
    })
    @IsNotEmpty({ message: 'Phone number is required' })
    @IsString({ message: 'Phone number must be a string' })
    @Length(13, 13, { message: 'Phone number must be exactly 13 characters' })
    @Matches(/^\+998\d{9}$/, {
        message: 'Phone number must start with "+998" followed by 9 digits'
    })
    phone: string;

    @ApiProperty({
        description: 'User\'s password (min 6 characters, must include letters and numbers)',
        example: 'admin123',
        minLength: 6
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @Length(6, 100, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message: 'Password must be at least 6 characters and contain at least one letter and one number'
    })
    password: string;
}
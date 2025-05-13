import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsISO8601, IsOptional, IsString, Length, Matches } from "class-validator";
import { UserRole } from "src/common/enums/user-role.enum";

export class UpdateUserDto {

    @ApiPropertyOptional({
        description: 'User\'s first name',
        example: 'John',
        minLength: 2,
        maxLength: 50
    })
    @IsOptional({ message: 'First name is not required' })
    @IsString({ message: 'First name must be a string' })
    @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
    firstName?: string;

    @ApiPropertyOptional({
        description: 'User\'s last name',
        example: 'Doe',
        maxLength: 50
    })
    @IsOptional({ message: 'Last name is not required' })
    @IsString({ message: 'Last name must be a string' })
    @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
    lastName?: string;

    @ApiPropertyOptional({
        description: 'User\'s date of birth (ISO format: YYYY-MM-DD)',
        example: '1990-02-15',
        type: String
    })
    @IsOptional({ message: 'Date of birth is not required' })
    @IsISO8601({}, { message: 'Date of birth must be in ISO8601 format (YYYY-MM-DD)' })
    birthday?: string;

    @ApiPropertyOptional({
        description: 'User\'s phone number (Uzbekistan format: +998XXXXXXXXX)',
        example: '+998901234567',
        maxLength: 13,
        minLength: 13
    })
    @IsOptional({ message: 'Phone number is not required' })
    @IsString({ message: 'Phone number must be a string' })
    @Length(13, 13, { message: 'Phone number must be exactly 13 characters' })
    @Matches(/^\+998\d{9}$/, {
        message: 'Phone number must start with "+998" followed by 9 digits'
    })
    phone?: string;

    @ApiPropertyOptional({
        description: 'User\'s password (min 6 characters, must include letters and numbers)',
        example: 'Pass123',
        minLength: 6
    })
    @IsOptional({ message: 'Password is not required' })
    @IsString({ message: 'Password must be a string' })
    @Length(6, 100, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message: 'Password must be at least 6 characters and contain at least one letter and one number'
    })
    password?: string;

}

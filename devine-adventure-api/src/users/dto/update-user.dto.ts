import { IsString, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^\+254[0-9]{9}$/, {
    message: 'Phone must be a valid Kenyan number (+254...)',
  })
  phone?: string;
}

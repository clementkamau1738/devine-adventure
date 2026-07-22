import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty()
  @IsString()
  @Matches(/^\+254[0-9]{9}$/, {
    message: 'Phone must be a valid Kenyan number (+254...)',
  })
  phone: string;
}

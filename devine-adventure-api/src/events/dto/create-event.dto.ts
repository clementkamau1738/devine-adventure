import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
  Min,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategory, Difficulty } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() location: string;
  @ApiProperty({ enum: Difficulty }) @IsEnum(Difficulty) difficulty: Difficulty;
  @ApiProperty() @IsDateString() dateTime: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDateTime?: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @IsPositive() price: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  memberPrice?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isFree?: boolean;
  @ApiProperty() @Type(() => Number) @IsNumber() @IsPositive() capacity: number;
  @ApiProperty({ enum: EventCategory })
  @IsEnum(EventCategory)
  category: EventCategory;
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  images: string[];
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateSearchDto {
  @IsString({ message: 'The keyword must be a string.' })
  @IsNotEmpty({ message: 'The keyword cannot be empty.' })
  @Length(4, 32, { message: 'The keyword must be between 4 and 32 characters long.' })
  keyword: string;
}
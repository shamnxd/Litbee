import { IsUrl, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateUrlDto {
  @IsUrl(
    {},
    { message: 'Please provide a valid URL (include http:// or https://)' },
  )
  longUrl: string;

  @IsOptional()
  @IsString()
  customSlug?: string;

  @IsOptional()
  @IsArray()
  tags?: { name: string; color: string }[];
}

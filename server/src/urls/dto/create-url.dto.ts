import { IsUrl } from 'class-validator';

export class CreateUrlDto {
    @IsUrl({}, { message: 'Please provide a valid URL (include http:// or https://)' })
    longUrl: string;
}

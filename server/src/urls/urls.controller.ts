import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Redirect,
    Request,
    UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) { }

    // ── Authenticated: Create short URL ──────────────────────────────
    @Post('urls')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateUrlDto, @Request() req: any) {
        const url = await this.urlsService.create(dto, req.user.userId);
        return {
            message: 'Short URL created successfully',
            data: url,
        };
    }

    // ── Authenticated: List user's URLs ──────────────────────────────
    @Get('urls')
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req: any) {
        const urls = await this.urlsService.findAllByUser(req.user.userId);
        return {
            count: urls.length,
            data: urls,
        };
    }

    // ── Public: Redirect short code to long URL ───────────────────────
    @Get(':code')
    @Redirect()
    async redirect(@Param('code') code: string) {
        const url = await this.urlsService.findByCode(code);
        return { url: url.longUrl, statusCode: HttpStatus.MOVED_PERMANENTLY };
    }
}

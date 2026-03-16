import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Redirect,
  Request as ReqDecorator,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { URL_MESSAGES } from '../common/constants/messages';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get('urls/check-availability')
  @UseGuards(JwtAuthGuard)
  async checkAvailability(
    @Query('slug') slug: string,
    @Query('excludeId') excludeId?: string,
  ) {
    const isAvailable = await this.urlsService.checkSlugAvailability(
      slug,
      excludeId,
    );
    return { available: isAvailable };
  }

  @Post('urls')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateUrlDto,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    const url = await this.urlsService.create(dto, req.user.userId);
    return {
      message: URL_MESSAGES.SUCCESS.CREATED,
      data: url,
    };
  }

  @Get('urls')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @ReqDecorator() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.urlsService.findAllByUser(
      req.user.userId,
      Number(page),
      Number(limit),
      search,
    );

    return {
      count: result.total,
      data: result.urls,
    };
  }

  @Put('urls/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateUrlDto>,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    const url = await this.urlsService.updateUrl(id, dto, req.user.userId);
    return { message: URL_MESSAGES.SUCCESS.UPDATED, data: url };
  }

  @Delete('urls/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    await this.urlsService.deleteUrl(id, req.user.userId);
    return { message: URL_MESSAGES.SUCCESS.DELETED };
  }

  @Get(':code')
  @Redirect()
  async redirect(@Param('code') code: string) {
    const url = await this.urlsService.findByCode(code);
    return { url: url.longUrl, statusCode: HttpStatus.MOVED_PERMANENTLY };
  }
}

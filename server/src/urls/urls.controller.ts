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
  Inject,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import type { IUrlsService } from './interfaces/urls.service.interface';
import { I_URLS_SERVICE } from './constants/tokens';
import { URL_ROUTES } from './constants/routes';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
export class UrlsController {
  constructor(
    @Inject(I_URLS_SERVICE) private readonly _urlsService: IUrlsService,
  ) { }

  @Get(URL_ROUTES.CHECK_AVAILABILITY)
  @UseGuards(JwtAuthGuard)
  async checkAvailability(
    @Query('slug') slug: string,
    @Query('excludeId') excludeId?: string,
  ) {
    const isAvailable = await this._urlsService.checkSlugAvailability(
      slug,
      excludeId,
    );
    return { available: isAvailable };
  }

  @Post(URL_ROUTES.URLS)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateUrlDto,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    return this._urlsService.create(dto, req.user.userId);
  }

  @Get(URL_ROUTES.URLS)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @ReqDecorator() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this._urlsService.findAllByUser(
      req.user.userId,
      Number(page),
      Number(limit),
      search,
    );
  }

  @Put(URL_ROUTES.URL_BY_ID)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateUrlDto>,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    return this._urlsService.updateUrl(id, dto, req.user.userId);
  }

  @Delete(URL_ROUTES.URL_BY_ID)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    return this._urlsService.deleteUrl(id, req.user.userId);
  }

  @Get(URL_ROUTES.REDIRECT_BY_CODE)
  @Redirect()
  async redirect(@Param('code') code: string) {
    const url = await this._urlsService.findByCode(code);
    return { url: url.longUrl, statusCode: HttpStatus.MOVED_PERMANENTLY };
  }
}

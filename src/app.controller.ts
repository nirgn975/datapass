import { lastValueFrom } from 'rxjs';
import { stringify } from 'querystring';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SearchRequestDto } from './req.dto';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  async passRequests(@Query() searchRequestDto: SearchRequestDto): Promise<any> {
    if (!Object.keys(searchRequestDto)?.length) {
      throw new BadRequestException('You must add at least one search field');
    }

    const queryString = stringify(searchRequestDto as Record<string, string>);

    return await lastValueFrom(
      this.httpService.get(`https://api.prod.datalead.ai/gatekeeper/search/person/by?${queryString}`, {
        headers: { 'Content-Type': 'application/json', 'api-key': '<YOUR-API-KEY>' },
      }),
    )
      .then((response) => response.data)
      .catch((error) => {
        console.error('error', error);
      });
  }
}

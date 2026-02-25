import { Body, Controller, Get, Post, Query, Res, HttpCode } from '@nestjs/common';
import { type Response } from 'express';
import { AccountNotFoundError, InsufficientFundsError, InvalidEventError } from './account.errors';
import { type EventInput } from './account.types';
import { AccountService } from './account.service';

@Controller()
export class AppController {
  constructor(private readonly accountService: AccountService) {}

  @Post('reset')
  @HttpCode(200)
  reset(@Res() response: Response): void {
    this.accountService.reset();
    response.status(200).send('OK');
  }

  @Get('balance')
  getBalance(@Query('account_id') accountId: string, @Res() response: Response): void {
    const balance = this.accountService.getBalance(accountId);

    if (balance === undefined) {
      response.status(404).send('0');
      return;
    }

    response.status(200).send(String(balance));
  }

  @Post('event')
  handleEvent(@Body() event: EventInput, @Res() response: Response): void {
    try {
      const eventResponse = this.accountService.handleEvent(event);
      response.status(201).json(eventResponse);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        response.status(404).send('0');
        return;
      }

      if (error instanceof InvalidEventError || error instanceof InsufficientFundsError) {
        response.status(400).send('0');
        return;
      }

      throw error;
    }
  }
}

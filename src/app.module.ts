import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountService } from './account/account.service';

@Module({
  controllers: [AppController],
  providers: [AccountService],
})
export class AppModule {}

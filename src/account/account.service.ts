import { Injectable } from '@nestjs/common';
import { EVENT_TYPES, EventInput, EventResponse } from './account.types';
import { AccountNotFoundError, InsufficientFundsError, InvalidEventError } from './account.errors';

@Injectable()
export class AccountService {
  private readonly balances = new Map<string, number>();

  reset(): void {
    this.balances.clear();
  }

  getBalance(accountId: string): number | undefined {
    return this.balances.get(accountId);
  }

  handleEvent(event: EventInput): EventResponse {
    const { type, destination, origin, amount } = event;

    if (!type || !EVENT_TYPES.includes(type)) {
      throw new InvalidEventError();
    }

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      throw new InvalidEventError();
    }

    if (type === 'deposit') {
      if (!destination) {
        throw new InvalidEventError();
      }
      return this.deposit(destination, amount);
    }

    if (type === 'withdraw') {
      if (!origin) {
        throw new InvalidEventError();
      }
      return this.withdraw(origin, amount);
    }

    if (type === 'transfer') {
      if (!origin || !destination) {
        throw new InvalidEventError();
      }
      return this.transfer(origin, destination, amount);
    }

    throw new InvalidEventError();
  }

  private deposit(accountId: string, amount: number): EventResponse {
    const currentBalance = this.balances.get(accountId) ?? 0;
    const updatedBalance = currentBalance + amount;

    this.balances.set(accountId, updatedBalance);

    return {
      destination: { id: accountId, balance: updatedBalance },
    };
  }

  private withdraw(accountId: string, amount: number): EventResponse {
    const currentBalance = this.balances.get(accountId);

    if (currentBalance === undefined) {
      throw new AccountNotFoundError();
    }

    if (amount > currentBalance) {
      throw new InsufficientFundsError();
    }

    const updatedBalance = currentBalance - amount;
    this.balances.set(accountId, updatedBalance);

    return {
      origin: { id: accountId, balance: updatedBalance },
    };
  }

  private transfer(originId: string, destinationId: string, amount: number): EventResponse {
    const currentOriginBalance = this.balances.get(originId);

    if (currentOriginBalance === undefined) {
      throw new AccountNotFoundError();
    }

    if (amount > currentOriginBalance) {
      throw new InsufficientFundsError();
    }

    const updatedOriginBalance = currentOriginBalance - amount;
    this.balances.set(originId, updatedOriginBalance);

    const currentDestinationBalance = this.balances.get(destinationId) ?? 0;
    const updatedDestinationBalance = currentDestinationBalance + amount;
    this.balances.set(destinationId, updatedDestinationBalance);

    return {
      origin: { id: originId, balance: updatedOriginBalance },
      destination: { id: destinationId, balance: updatedDestinationBalance },
    };
  }
}

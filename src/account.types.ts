export const EVENT_TYPES = ['deposit', 'withdraw', 'transfer'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export interface EventInput {
  type?: EventType;
  destination?: string;
  origin?: string;
  amount?: number;
}

interface AccountView {
  id: string;
  balance: number;
}

export type EventResponse =
  | { destination: AccountView }
  | { origin: AccountView }
  | { origin: AccountView; destination: AccountView };

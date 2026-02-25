# EBANX Software Engineer Coding Challenge

NestJS API for the EBANX Software Engineer technical challenge.

## Instructions

### `POST /event`

Create account or deposit:

```http
POST /event
Content-Type: application/json

{"type":"deposit", "destination":"100", "amount":10}
```

Withdraw from an existing account:

```http
POST /event
Content-Type: application/json

{"type":"withdraw", "origin":"100", "amount":5}
```

Transfer from an existing account:

```http
POST /event
Content-Type: application/json

{"type":"transfer", "origin":"100", "amount":15, "destination":"300"}
```

### `GET /balance`

Check balance of a non-existent account:

```http
GET /balance?account_id=1234
```

### `POST /reset`

Reset state before running tests:

```http
POST /reset
```

## Automated Test Suite Results

<img width="1028" height="1524" alt="automated-test-suite-results" src="https://github.com/user-attachments/assets/ac7521ca-67fe-4d3d-872b-addc0c3abecd" />



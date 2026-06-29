# Allo Inventory Reservation System

## Overview

This project is an inventory reservation system built as part of the Allo Health Engineering Take-Home Assignment.

It allows users to:

- View products and warehouse inventory
- Reserve available stock
- Confirm purchases
- Cancel reservations
- Automatically expire reservations after 10 minutes

---

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Prisma ORM

### Database

- PostgreSQL (Supabase)

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Seed the database

```bash
npx prisma db seed
```

Run the project

```bash
npm run dev
```

---

## API Endpoints

### Products

GET

```
/api/products
```

### Warehouses

GET

```
/api/warehouses
```

### Create Reservation

POST

```
/api/reservations
```

### Confirm Reservation

POST

```
/api/reservations/:id/confirm
```

### Release Reservation

POST

```
/api/reservations/:id/release
```

### Expire Reservations

POST

```
/api/reservations/expire
```

---

## Features

- Product inventory management
- Warehouse inventory
- Stock reservation
- Reservation confirmation
- Reservation cancellation
- Automatic expiry
- Countdown timer
- Responsive UI
- Toast notifications

---

## Author

Sadhana Jaladi
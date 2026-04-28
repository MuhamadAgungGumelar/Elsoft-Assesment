# Elsoft Assessment — Muhamad Agung Gumelar

Fullstack CRUD app untuk Elsoft programmer test case. Tiga halaman utama: Login, Master Item, dan Transaksi Stock.

## Tech Stack

- **Next.js 14** (App Router)
- **Redux Toolkit** + Thunk — state management & API calls
- **Tailwind CSS** — styling
- **MySQL** — optional local cache
- **Jest** + Testing Library — unit testing

## Struktur Project

```
src/
├── app/                  # Pages & API routes (Next.js App Router)
│   ├── api/              # Proxy ke Elsoft API
│   ├── login/
│   └── dashboard/
│       ├── master-item/
│       └── transaction/
├── components/
│   ├── ui/               # Button, Input, Modal, Table, dll
│   ├── layout/           # Sidebar, Header
│   ├── items/            # ItemForm
│   └── transactions/     # TransactionForm, TransactionDetailForm
├── hooks/                # useAuth, useItems, useTransactions
├── store/
│   ├── slices/           # authSlice, itemSlice, transactionSlice
│   └── thunks/           # API calls
├── types/                # TypeScript interfaces
└── lib/                  # constants, axios instance, db
```

## Cara Jalankan

**1. Install dependencies**
```bash
npm install
```

**2. Buat file `.env.local`**
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=elsoft_app
```

> MySQL bersifat opsional (untuk local cache). App tetap jalan tanpa MySQL.

**3. Jalankan dev server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

**4. Login**
```
Domain   : testcase
Username : testcase
Password : testcase123
```

## Unit Test

```bash
npm test
```

## Fitur

- **Login** — autentikasi via Elsoft API, token disimpan di httpOnly cookie
- **Master Item** — list, tambah, edit, hapus item
- **Transaksi Stock** — list, tambah, edit, hapus transaksi + detail per baris

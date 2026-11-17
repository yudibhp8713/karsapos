@echo off
chcp 65001 >nul
echo ==========================================
echo    KARSAPOS - PEMBUATAN FILE OTOMATIS
echo ==========================================
echo.

:: Buat Folder
echo [1/7] Membuat folder...
if not exist "prisma" mkdir prisma
if not exist "lib" mkdir lib
if not exist "types" mkdir types
echo ? Folder selesai dibuat
echo.

:: Buat lib/prisma.ts
echo [2/7] Membuat lib/prisma.ts...
(
echo import { PrismaClient } from '@prisma/client'
echo.
echo const prisma = global.prisma ^|^| new PrismaClient()
echo.
echo if (process.env.NODE_ENV !== 'production') global.prisma = prisma
echo.
echo export default prisma
) > "lib\prisma.ts"
echo ? lib/prisma.ts selesai
echo.

:: Buat types/index.ts
echo [3/7] Membuat types/index.ts...
(
echo import type { Business, Product, Customer, Transaction, TransactionItem, User } from '@prisma/client'
echo.
echo export type { Business, Product, Customer, Transaction, TransactionItem, User }
echo.
echo export type PlanType = 'BASIC' ^| 'PRO' ^| 'ENTERPRISE'
echo.
echo export interface NavItem {
echo   label: string
echo   href: string
echo   icon: string
echo }
) > "types\index.ts"
echo ? types/index.ts selesai
echo.

:: Buat .env
echo [4/7] Membuat file .env...
(
echo DATABASE_URL="postgresql://postgres:password@localhost:5432/karsapos?schema=public"
echo JWT_SECRET="ganti_dengan_kunci_rahasia_anda_sangat_panjang_123456789"
) > ".env"
echo ? File .env selesai — silakan ubah kata sandi PostgreSQL di dalamnya
echo.

:: Buat prisma/schema.prisma
echo [5/7] Membuat prisma/schema.prisma...
(
echo generator client {
echo   provider = "prisma-client-js"
echo }
echo.
echo datasource db {
echo   provider = "postgresql"
echo   url      = env("DATABASE_URL")
echo }
echo.
echo model User {
echo   id            String    @id @default(uuid())
echo   name          String
echo   email         String    @unique
echo   password      String
echo   role          Role      @default(CASHIER)
echo   businessId    String
echo   business      Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
echo   isActive      Boolean   @default(true)
echo   createdAt     DateTime  @default(now())
echo   updatedAt     DateTime  @updatedAt
echo }
echo.
echo enum Role {
echo   OWNER
echo   MANAGER
echo   CASHIER
echo }
echo.
echo model Business {
echo   id            String    @id @default(uuid())
echo   name          String
echo   address       String?
echo   phone         String?
echo   email         String?
echo   plan          PlanType  @default(BASIC)
echo   planExpiresAt DateTime?
echo   users         User[]
echo   products      Product[]
echo   transactions  Transaction[]
echo   customers     Customer[]
echo   createdAt     DateTime  @default(now())
echo   updatedAt     DateTime  @updatedAt
echo }
echo.
echo enum PlanType {
echo   BASIC
echo   PRO
echo   ENTERPRISE
echo }
echo.
echo model Product {
echo   id            String    @id @default(uuid())
echo   name          String
echo   description   String?
echo   barcode       String?
echo   category      String?
echo   purchasePrice Decimal   @db.Decimal(12, 2)
echo   sellingPrice  Decimal   @db.Decimal(12, 2)
echo   stock         Int       @default(0)
echo   minStock      Int       @default(0)
echo   imageUrl      String?
echo   businessId    String
echo   business      Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
echo   createdAt     DateTime  @default(now())
echo   updatedAt     DateTime  @updatedAt
echo }
echo.
echo model Customer {
echo   id            String    @id @default(uuid())
echo   name          String
echo   phone         String?
echo   email         String?
echo   address       String?
echo   businessId    String
echo   business      Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
echo   createdAt     DateTime  @default(now())
echo   updatedAt     DateTime  @updatedAt
echo }
echo.
echo model Transaction {
echo   id            String    @id @default(uuid())
echo   invoiceNo     String    @unique
echo   customerId    String?
echo   customer      Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)
echo   userId        String
echo   user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
echo   businessId    String
echo   business      Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
echo   totalAmount   Decimal   @db.Decimal(12, 2)
echo   paymentMethod String
echo   received      Decimal   @db.Decimal(12, 2)
echo   change        Decimal   @db.Decimal(12, 2)
echo   note          String?
echo   createdAt     DateTime  @default(now())
echo   updatedAt     DateTime  @updatedAt
echo   items         TransactionItem[]
echo }
echo.
echo model TransactionItem {
echo   id            String    @id @default(uuid())
echo   transactionId String
echo   transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
echo   productId     String
echo   product       Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
echo   quantity      Int
echo   price         Decimal   @db.Decimal(12, 2)
echo   subtotal      Decimal   @db.Decimal(12, 2)
echo   createdAt     DateTime  @default(now())
echo }
) > "prisma\schema.prisma"
echo ? prisma/schema.prisma selesai
echo.

:: Buat .gitignore
echo [6/7] Membuat .gitignore...
(
echo node_modules
echo .env
echo .env.local
echo .next
echo dist
echo *.log
) > ".gitignore"
echo ? .gitignore selesai
echo.

echo [7/7] Selesai!
echo.
echo ==========================================
echo    ? SEMUA FILE BERHASIL DIBUAT!
echo ==========================================
echo.
echo Langkah selanjutnya:
echo 1. Ubah kata sandi di file .env sesuai PostgreSQL kamu
echo 2. Jalankan: npx prisma generate
echo 3. Jalankan: npx prisma db push
echo 4. Jalankan: npm run dev
echo.
pause

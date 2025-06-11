/*
  Warnings:

  - You are about to drop the column `afterUrl` on the `BeforeAfterImage` table. All the data in the column will be lost.
  - You are about to drop the column `beforeUrl` on the `BeforeAfterImage` table. All the data in the column will be lost.
  - The primary key for the `Translation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `afterImage` to the `BeforeAfterImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beforeImage` to the `BeforeAfterImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Translation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BeforeAfterImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "beforeImage" TEXT NOT NULL,
    "afterImage" TEXT NOT NULL,
    "description" TEXT,
    "serviceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BeforeAfterImage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BeforeAfterImage" ("createdAt", "description", "id", "serviceId", "updatedAt") SELECT "createdAt", "description", "id", "serviceId", "updatedAt" FROM "BeforeAfterImage";
DROP TABLE "BeforeAfterImage";
ALTER TABLE "new_BeforeAfterImage" RENAME TO "BeforeAfterImage";
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" REAL,
    "duration" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Service" ("category", "createdAt", "currency", "description", "id", "price", "slug", "title", "updatedAt") SELECT "category", "createdAt", "currency", "description", "id", "price", "slug", "title", "updatedAt" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE INDEX "Service_category_idx" ON "Service"("category");
CREATE TABLE "new_Translation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'common',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Translation" ("category", "createdAt", "key", "languageCode", "updatedAt", "value") SELECT "category", "createdAt", "key", "languageCode", "updatedAt", "value" FROM "Translation";
DROP TABLE "Translation";
ALTER TABLE "new_Translation" RENAME TO "Translation";
CREATE INDEX "Translation_languageCode_idx" ON "Translation"("languageCode");
CREATE INDEX "Translation_category_idx" ON "Translation"("category");
CREATE UNIQUE INDEX "Translation_key_languageCode_key" ON "Translation"("key", "languageCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

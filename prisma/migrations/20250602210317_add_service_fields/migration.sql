/*
  Warnings:

  - You are about to drop the column `slug` on the `ServiceTranslation` table. All the data in the column will be lost.
  - Made the column `duration` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "duration" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "availability" TEXT NOT NULL DEFAULT 'always',
    "minAge" INTEGER NOT NULL DEFAULT 18,
    "maxAge" INTEGER NOT NULL DEFAULT 99,
    "prerequisites" TEXT,
    "aftercare" TEXT,
    "benefits" TEXT,
    "risks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Service" ("category", "createdAt", "currency", "description", "duration", "id", "price", "slug", "title", "updatedAt") SELECT "category", "createdAt", "currency", "description", "duration", "id", "price", "slug", "title", "updatedAt" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE TABLE "new_ServiceTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceTranslation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ServiceTranslation" ("createdAt", "description", "id", "language", "serviceId", "title", "updatedAt") SELECT "createdAt", "description", "id", "language", "serviceId", "title", "updatedAt" FROM "ServiceTranslation";
DROP TABLE "ServiceTranslation";
ALTER TABLE "new_ServiceTranslation" RENAME TO "ServiceTranslation";
CREATE UNIQUE INDEX "ServiceTranslation_serviceId_language_key" ON "ServiceTranslation"("serviceId", "language");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

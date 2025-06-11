/*
  Warnings:

  - You are about to drop the column `message` on the `Consultation` table. All the data in the column will be lost.
  - You are about to drop the column `treatment` on the `Consultation` table. All the data in the column will be lost.
  - Added the required column `country` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interestedServices` to the `Consultation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "BeforeAfterCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "patientAge" INTEGER,
    "patientGender" TEXT,
    "patientCountry" TEXT,
    "beforeImage" TEXT NOT NULL,
    "afterImage" TEXT NOT NULL,
    "description" TEXT,
    "treatmentDetails" TEXT,
    "results" TEXT,
    "timeframe" TEXT,
    "categoryId" TEXT,
    "serviceId" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "beforeImageAlt" TEXT,
    "afterImageAlt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BeforeAfterCase_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BeforeAfterCase_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Consultation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "age" TEXT,
    "gender" TEXT,
    "interestedServices" TEXT NOT NULL,
    "preferredDate" DATETIME,
    "preferredTime" TEXT,
    "medicalHistory" TEXT,
    "currentMedications" TEXT,
    "budget" TEXT,
    "additionalInfo" TEXT,
    "contactMethod" TEXT NOT NULL DEFAULT 'email',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Consultation" ("createdAt", "email", "firstName", "id", "lastName", "phone", "status", "updatedAt") SELECT "createdAt", "email", "firstName", "id", "lastName", "phone", "status", "updatedAt" FROM "Consultation";
DROP TABLE "Consultation";
ALTER TABLE "new_Consultation" RENAME TO "Consultation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "BeforeAfterCase_isFeatured_idx" ON "BeforeAfterCase"("isFeatured");

-- CreateIndex
CREATE INDEX "BeforeAfterCase_isPublished_idx" ON "BeforeAfterCase"("isPublished");

-- CreateIndex
CREATE INDEX "BeforeAfterCase_categoryId_idx" ON "BeforeAfterCase"("categoryId");

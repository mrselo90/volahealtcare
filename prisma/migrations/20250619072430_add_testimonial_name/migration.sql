/*
  Warnings:

  - Added the required column `name` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "photoUrl" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Testimonial_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Testimonial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Testimonial" ("country", "createdAt", "id", "isApproved", "isFeatured", "photoUrl", "rating", "review", "serviceId", "updatedAt", "userId") SELECT "country", "createdAt", "id", "isApproved", "isFeatured", "photoUrl", "rating", "review", "serviceId", "updatedAt", "userId" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

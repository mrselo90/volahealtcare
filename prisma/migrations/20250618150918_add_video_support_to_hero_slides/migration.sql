-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeroSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "videoUrl" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "videoPoster" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_HeroSlide" ("category", "createdAt", "id", "imageUrl", "isActive", "orderIndex", "subtitle", "title", "updatedAt") SELECT "category", "createdAt", "id", "imageUrl", "isActive", "orderIndex", "subtitle", "title", "updatedAt" FROM "HeroSlide";
DROP TABLE "HeroSlide";
ALTER TABLE "new_HeroSlide" RENAME TO "HeroSlide";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

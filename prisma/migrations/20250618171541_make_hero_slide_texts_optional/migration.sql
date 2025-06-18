-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeroSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "subtitle" TEXT,
    "category" TEXT,
    "imageUrl" TEXT NOT NULL,
    "videoUrl" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "videoPoster" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_HeroSlide" ("category", "createdAt", "id", "imageUrl", "isActive", "mediaType", "orderIndex", "subtitle", "title", "updatedAt", "videoPoster", "videoUrl") SELECT "category", "createdAt", "id", "imageUrl", "isActive", "mediaType", "orderIndex", "subtitle", "title", "updatedAt", "videoPoster", "videoUrl" FROM "HeroSlide";
DROP TABLE "HeroSlide";
ALTER TABLE "new_HeroSlide" RENAME TO "HeroSlide";
CREATE TABLE "new_HeroSlideTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slideId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HeroSlideTranslation_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "HeroSlide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HeroSlideTranslation" ("category", "createdAt", "id", "language", "slideId", "subtitle", "title", "updatedAt") SELECT "category", "createdAt", "id", "language", "slideId", "subtitle", "title", "updatedAt" FROM "HeroSlideTranslation";
DROP TABLE "HeroSlideTranslation";
ALTER TABLE "new_HeroSlideTranslation" RENAME TO "HeroSlideTranslation";
CREATE UNIQUE INDEX "HeroSlideTranslation_slideId_language_key" ON "HeroSlideTranslation"("slideId", "language");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

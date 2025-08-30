-- CreateTable
CREATE TABLE "GridAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" TEXT NOT NULL,
    "voltage" INTEGER NOT NULL,
    "load" REAL NOT NULL,
    "capacity" INTEGER NOT NULL,
    "lastUpdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

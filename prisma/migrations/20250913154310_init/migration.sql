-- CreateTable
CREATE TABLE "public"."SearchJob" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SearchResult" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "snippet" TEXT,
    "foundAt" TIMESTAMP(3),
    "depth" INTEGER,
    "fromUrl" TEXT,
    "searchJobId" TEXT NOT NULL,

    CONSTRAINT "SearchResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SearchResult" ADD CONSTRAINT "SearchResult_searchJobId_fkey" FOREIGN KEY ("searchJobId") REFERENCES "public"."SearchJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

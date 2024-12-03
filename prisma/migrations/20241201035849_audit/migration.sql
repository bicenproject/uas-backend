-- CreateTable
CREATE TABLE "AuditTrail" (
    "id" SERIAL NOT NULL,
    "Url" VARCHAR(255) NOT NULL,
    "ActionName" VARCHAR(255) NOT NULL,
    "MenuName" VARCHAR(255) NOT NULL,
    "DataBefore" TEXT NOT NULL,
    "DataAfter" TEXT NOT NULL,
    "UserName" VARCHAR(255) NOT NULL,
    "IpAddress" VARCHAR(255) NOT NULL,
    "ActivityDate" TIMESTAMP(3) NOT NULL,
    "Browser" VARCHAR(255) NOT NULL,
    "OS" VARCHAR(255) NOT NULL,
    "AppSource" VARCHAR(20) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "commercial";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "delivery";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "development";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "shared";

-- CreateEnum
CREATE TYPE "shared"."UserRole" AS ENUM ('ADMIN', 'STAFF', 'CLIENT');

-- CreateEnum
CREATE TYPE "shared"."NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "shared"."OutboxStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "commercial"."LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "commercial"."OpportunityStage" AS ENUM ('QUALIFYING', 'NEEDS_ANALYSIS', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "commercial"."ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "commercial"."ContractStatus" AS ENUM ('DRAFT', 'SIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "commercial"."InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "commercial"."PaymentMethod" AS ENUM ('BANK_TRANSFER', 'MPESA', 'EMOLA', 'CARD', 'CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "commercial"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "commercial"."ExpenseCategory" AS ENUM ('SOFTWARE', 'HOSTING', 'MARKETING', 'EQUIPMENT', 'CONTRACTOR', 'TAXES', 'OTHER');

-- CreateEnum
CREATE TYPE "commercial"."CampaignStatus" AS ENUM ('PLANNED', 'ACTIVE', 'PAUSED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "delivery"."ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "delivery"."TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');

-- CreateEnum
CREATE TYPE "delivery"."TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "delivery"."TaskSource" AS ENUM ('MANUAL', 'LABS_PROPOSAL');

-- CreateEnum
CREATE TYPE "delivery"."MilestoneStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE', 'MISSED');

-- CreateEnum
CREATE TYPE "delivery"."SprintStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "delivery"."SubtaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "delivery"."BlockerStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "development"."ObjectiveStatus" AS ENUM ('ACTIVE', 'ACHIEVED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "development"."PlanStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'MISSED');

-- CreateEnum
CREATE TYPE "development"."DevelopmentEventType" AS ENUM ('COMMIT', 'BRANCH_CREATED', 'BRANCH_SWITCHED', 'PR_CREATED', 'PR_MERGED', 'DEPLOYMENT', 'BUILD_STARTED', 'BUILD_FAILED', 'BUILD_SUCCEEDED', 'TASK_STARTED', 'TASK_COMPLETED', 'BLOCKER_RAISED', 'BLOCKER_RESOLVED', 'INTERRUPTION', 'DECISION_LOGGED', 'FOCUS_ACTIVITY', 'MANUAL_ACTIVITY');

-- CreateEnum
CREATE TYPE "development"."DevelopmentEventSource" AS ENUM ('GIT', 'GITHUB', 'IDE', 'TERMINAL', 'WEBSTUDIO_PLANNER', 'CI_CD', 'DEPLOYMENT', 'MANUAL');

-- CreateEnum
CREATE TYPE "development"."InterruptionSource" AS ENUM ('NOTIFICATION', 'MEETING', 'CONTEXT_SWITCH', 'MANUAL', 'UNKNOWN');

-- CreateTable
CREATE TABLE "shared"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "shared"."UserRole" NOT NULL DEFAULT 'STAFF',
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared"."api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userId" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared"."audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "actorId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared"."clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "taxId" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared"."activities" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT,
    "clientId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "shared"."NotificationType" NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared"."outbox" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "shared"."OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial"."leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "source" TEXT,
    "message" TEXT,
    "status" "commercial"."LeadStatus" NOT NULL DEFAULT 'NEW',
    "ownerId" TEXT,
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial"."opportunities" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "title" TEXT NOT NULL,
    "estimatedValue" DECIMAL(14,2),
    "probability" INTEGER NOT NULL DEFAULT 50,
    "stage" "commercial"."OpportunityStage" NOT NULL DEFAULT 'QUALIFYING',
    "expectedCloseDate" TIMESTAMP(3),
    "ownerId" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial"."services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(14,2) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'projeto',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial"."proposals" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "leadId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "items" JSONB NOT NULL,
    "totalAmount" DECIMAL(14,2) NOT NULL,
    "status" "commercial"."ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "validUntil" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial"."contracts" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "proposalId" TEXT,
    "title" TEXT NOT NULL,
    "terms" TEXT,
    "value" DECIMAL(14,2) NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "commercial"."ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "signedAt" TIMESTAMP(3),
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial"."invoices" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    "items" JSONB NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL,
    "tax" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL,
    "status" "commercial"."InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial"."payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "method" "commercial"."PaymentMethod" NOT NULL,
    "status" "commercial"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial"."expenses" (
    "id" TEXT NOT NULL,
    "category" "commercial"."ExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial"."campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "budget" DECIMAL(14,2),
    "status" "commercial"."CampaignStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "metrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery"."projects" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "contractId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "delivery"."ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "budget" DECIMAL(14,2),
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery"."tasks" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "milestoneId" TEXT,
    "sprintId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "delivery"."TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "delivery"."TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "assigneeId" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "source" "delivery"."TaskSource" NOT NULL DEFAULT 'MANUAL',
    "sourceProposalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery"."milestones" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "delivery"."MilestoneStatus" NOT NULL DEFAULT 'PLANNED',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery"."sprints" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "status" "delivery"."SprintStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery"."subtasks" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "delivery"."SubtaskStatus" NOT NULL DEFAULT 'TODO',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subtasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery"."blockers" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "delivery"."BlockerStatus" NOT NULL DEFAULT 'OPEN',
    "raisedById" TEXT,
    "raisedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolution" TEXT,

    CONSTRAINT "blockers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery"."time_entries" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "durationMins" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery"."project_files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."objectives" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "development"."ObjectiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "targetDate" TIMESTAMP(3),
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."roadmaps" (
    "id" TEXT NOT NULL,
    "objectiveId" TEXT,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."weekly_plans" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekEnd" TIMESTAMP(3) NOT NULL,
    "goals" JSONB NOT NULL,
    "status" "development"."PlanStatus" NOT NULL DEFAULT 'PLANNED',
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."daily_plans" (
    "id" TEXT NOT NULL,
    "weeklyPlanId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "priorities" JSONB NOT NULL,
    "status" "development"."PlanStatus" NOT NULL DEFAULT 'PLANNED',
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."development_events" (
    "id" TEXT NOT NULL,
    "source" "development"."DevelopmentEventSource" NOT NULL,
    "eventType" "development"."DevelopmentEventType" NOT NULL,
    "userId" TEXT,
    "projectId" TEXT,
    "taskId" TEXT,
    "externalId" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."development_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "projectId" TEXT,
    "taskId" TEXT,
    "sourceEventId" TEXT,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."focus_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "projectId" TEXT,
    "taskId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "durationSecs" INTEGER,
    "activityScore" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "sourceEvents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "inferred" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "focus_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."interruptions" (
    "id" TEXT NOT NULL,
    "focusSessionId" TEXT,
    "source" "development"."InterruptionSource" NOT NULL DEFAULT 'UNKNOWN',
    "reason" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interruptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."development_decisions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "relatedTaskId" TEXT,
    "context" TEXT,
    "decision" TEXT NOT NULL,
    "reason" TEXT,
    "alternatives" JSONB,
    "impact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development"."development_activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "focusSecs" INTEGER NOT NULL DEFAULT 0,
    "summary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "shared"."users"("email");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "shared"."audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "shared"."clients"("email");

-- CreateIndex
CREATE INDEX "activities_entityType_entityId_idx" ON "shared"."activities"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "outbox_status_idx" ON "shared"."outbox"("status");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_proposalId_key" ON "commercial"."contracts"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_number_key" ON "commercial"."invoices"("number");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_sourceProposalId_key" ON "delivery"."tasks"("sourceProposalId");

-- CreateIndex
CREATE INDEX "project_files_entityType_entityId_idx" ON "delivery"."project_files"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "development_events_source_eventType_idx" ON "development"."development_events"("source", "eventType");

-- CreateIndex
CREATE INDEX "development_events_projectId_idx" ON "development"."development_events"("projectId");

-- CreateIndex
CREATE INDEX "development_logs_projectId_idx" ON "development"."development_logs"("projectId");

-- CreateIndex
CREATE INDEX "focus_sessions_projectId_idx" ON "development"."focus_sessions"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "development_activity_userId_date_key" ON "development"."development_activity"("userId", "date");

-- AddForeignKey
ALTER TABLE "shared"."api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shared"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared"."audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared"."activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared"."activities" ADD CONSTRAINT "activities_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "shared"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shared"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."leads" ADD CONSTRAINT "leads_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."leads" ADD CONSTRAINT "leads_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "shared"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."opportunities" ADD CONSTRAINT "opportunities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "commercial"."leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."opportunities" ADD CONSTRAINT "opportunities_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."proposals" ADD CONSTRAINT "proposals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "shared"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."proposals" ADD CONSTRAINT "proposals_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "commercial"."leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."proposals" ADD CONSTRAINT "proposals_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."contracts" ADD CONSTRAINT "contracts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "shared"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."contracts" ADD CONSTRAINT "contracts_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "commercial"."proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "shared"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."invoices" ADD CONSTRAINT "invoices_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "delivery"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "commercial"."invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."expenses" ADD CONSTRAINT "expenses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "delivery"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial"."expenses" ADD CONSTRAINT "expenses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."projects" ADD CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "shared"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."projects" ADD CONSTRAINT "projects_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "commercial"."contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "delivery"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."tasks" ADD CONSTRAINT "tasks_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "delivery"."milestones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."tasks" ADD CONSTRAINT "tasks_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "delivery"."sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."milestones" ADD CONSTRAINT "milestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "delivery"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."sprints" ADD CONSTRAINT "sprints_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "delivery"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."subtasks" ADD CONSTRAINT "subtasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "delivery"."tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."blockers" ADD CONSTRAINT "blockers_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "delivery"."tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."blockers" ADD CONSTRAINT "blockers_raisedById_fkey" FOREIGN KEY ("raisedById") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."time_entries" ADD CONSTRAINT "time_entries_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "delivery"."tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."time_entries" ADD CONSTRAINT "time_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery"."project_files" ADD CONSTRAINT "project_files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."objectives" ADD CONSTRAINT "objectives_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."roadmaps" ADD CONSTRAINT "roadmaps_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "development"."objectives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."roadmaps" ADD CONSTRAINT "roadmaps_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "delivery"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."weekly_plans" ADD CONSTRAINT "weekly_plans_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "development"."roadmaps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."daily_plans" ADD CONSTRAINT "daily_plans_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "development"."weekly_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."development_events" ADD CONSTRAINT "development_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."development_events" ADD CONSTRAINT "development_events_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "delivery"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."development_events" ADD CONSTRAINT "development_events_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "delivery"."tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."development_logs" ADD CONSTRAINT "development_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."development_logs" ADD CONSTRAINT "development_logs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "delivery"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."development_logs" ADD CONSTRAINT "development_logs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "delivery"."tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."development_logs" ADD CONSTRAINT "development_logs_sourceEventId_fkey" FOREIGN KEY ("sourceEventId") REFERENCES "development"."development_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."focus_sessions" ADD CONSTRAINT "focus_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."focus_sessions" ADD CONSTRAINT "focus_sessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "delivery"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."focus_sessions" ADD CONSTRAINT "focus_sessions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "delivery"."tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."interruptions" ADD CONSTRAINT "interruptions_focusSessionId_fkey" FOREIGN KEY ("focusSessionId") REFERENCES "development"."focus_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."development_decisions" ADD CONSTRAINT "development_decisions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development"."development_decisions" ADD CONSTRAINT "development_decisions_relatedTaskId_fkey" FOREIGN KEY ("relatedTaskId") REFERENCES "delivery"."tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

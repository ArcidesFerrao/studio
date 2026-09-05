import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/app/lib/api-response";
import { requireStaff } from "@/app/lib/permissions";
import { prisma } from "@/app/lib/db";

/**
 * Agregado do Dashboard interno (funil comercial + operacional).
 * Consumido por app/admin/page.tsx.
 */
export const GET = withErrorHandling(async (req: NextRequest) => {
  void req;
  await requireStaff();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [
    leadsOpen,
    proposalsSent,
    contractsActive,
    projectsInProgress,
    invoicesOverdueCount,
    paidThisMonth,
    recentActivities,
  ] = await Promise.all([
    prisma.lead.count({ where: { status: { notIn: ["WON", "LOST"] } } }),
    prisma.proposal.count({ where: { status: "SENT" } }),
    prisma.contract.count({ where: { status: "ACTIVE" } }),
    prisma.project.count({ where: { status: "IN_PROGRESS" } }),
    prisma.invoice.count({ where: { status: "OVERDUE" } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "COMPLETED",
        paidAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, description: true, createdAt: true },
    }),
  ]);

  return ok({
    funnel: {
      leads: leadsOpen,
      proposals: proposalsSent,
      contracts: contractsActive,
      projects: projectsInProgress,
    },
    invoicesOverdueCount,
    revenueThisMonth: Number(paidThisMonth._sum.amount ?? 0),
    recentActivities,
  });
});

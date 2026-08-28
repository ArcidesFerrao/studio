export type WebstudioEventType =
  | "client.created"
  | "lead.created"
  | "lead.converted"
  | "proposal.created"
  | "proposal.sent"
  | "proposal.accepted"
  | "proposal.rejected"
  | "contract.created"
  | "contract.signed"
  | "project.created"
  | "project.updated"
  | "project.completed"
  | "task.created"
  | "task.completed"
  | "invoice.created"
  | "invoice.paid"
  | "payment.created"
  | "expense.created"
  | "campaign.created";

export interface WebstudioEvent<T = Record<string, unknown>> {
  type: WebstudioEventType;
  payload: T;
}

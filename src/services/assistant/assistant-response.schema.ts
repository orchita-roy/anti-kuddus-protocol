import { z } from "zod";
export const citationTypes=["school_rule","curriculum","source_document","complaint_statistics","ledger_analytics","sos_summary","seat_plan","rumor_check","behaviour_analysis","democracy_proposal"] as const;
export const AssistantResponseSchema=z.object({answer:z.string().min(1),groundingStatus:z.enum(["grounded","partially_grounded","insufficient_context"]),citations:z.array(z.object({sourceType:z.enum(citationTypes),sourceId:z.string().optional(),sourceTitle:z.string().optional(),section:z.string().optional(),pageNumber:z.number().nullable().optional()})),suggestedQuestions:z.array(z.string()).max(4),safeActions:z.array(z.object({label:z.string(),href:z.string().regex(/^\//)})).max(3)});
export type AssistantResponse=z.infer<typeof AssistantResponseSchema>;

//import { json, serial, varchar } from "drizzle-orm/mysql-core";
import { pgTable, serial, varchar, text} from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview',{
    id : serial('id').primaryKey(), 
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: text('jobPosition').notNull(),
    jobDesc: text('jobDesc').notNull(),
    jobExperience: text('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt:varchar('createdAt'),
    mockId:varchar('mockId').notNull()
})
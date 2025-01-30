"use client";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { eq, desc } from "drizzle-orm";
import InterviewItemCard from "./InterviewItemCard";
import { db } from "@/utils/db";

const InterviewList = () => {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    useEffect(() => {
        console.log("Updated interviewList:", interviewList);
    }, [interviewList]); // Track state updates

    const GetInterviewList = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(MockInterview.id));

        console.log("Fetched result:", result.length);
        setInterviewList(result);
    };

    return (
        <div>
            <h2 className="font-medium text-xl">Previous Mock Interview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                {interviewList.length > 0 ? (
                    interviewList.map((interview, index) => {
                        return <InterviewItemCard interview={interview} key={index} />;
                    })
                ) : (
                    <p>No mock interviews found.</p>
                )}
            </div>
        </div>
    );
};

export default InterviewList;

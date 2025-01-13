"use client"
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import RecordAnswerSection from './_components/RecordAnswerSection';


const StartInterview = ({params}) => {

    const [interviewData , setInterviewData] = useState();
    const { interviewId } = React.use(params);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    //states question no /state
    const [activeQuestionIndex , SetActiveQuestionIndex] = useState(0);
    useEffect(()=>{
        GetInterviewDetails();
    },[]);
    
    //fetches interview record which matches params interview id
    const GetInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));
        console.log(result);
        
        //conver result into json format
        const jsonMockResp = JSON.parse(result[0].jsonMockResp)
        // put it in MockInterviewQuestion
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
    }
    
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Questions */}
        <QuestionsSection 
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
        />

        {/* vidios/audios */}
        <RecordAnswerSection/>
      </div>
    </div>
  )
}

export default StartInterview

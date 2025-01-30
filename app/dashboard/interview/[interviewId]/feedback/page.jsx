"use client"

import { UserAnswer } from '@/utils/schema'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Feedback = ({params}) => {
  const { interviewId } = React.use(params);
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter()
  useEffect(()=>{
    GetFeedback();
  },[])
  const GetFeedback=async()=>{
    const result = await db.select().from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef,interviewId))
    .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
  }
  return (
    <div className='p-10'>

      {feedbackList?.length==0?
      <h2 className='font-bold text-xl text-gray-500'>No Interview Record Found</h2>
       :<>
      <h2 className='text-2xl font-bold text text-green-500'>Congratulation!</h2>
      <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
      
      <h2 className='my-3'>Your overall interview rating: <strong>7/10</strong></h2>

      <h2 className='text-sm text-gray-500'>Find below interview question with correct answer , your answer and feedback for improvement</h2>

      {
      feedbackList && feedbackList.map((item, index) => (
        <Collapsible key={index} className='mt-7'>
          <CollapsibleTrigger className='p-5 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7'>
            {item.question}
            <ChevronDown className='h-5 w-5'/>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2'>
              <h2 className='text-red-500 p-2 border rounded-lg'>
                <strong>Rating:</strong>
                {item.rating}
              </h2>
              <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
              <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>
              <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback: </strong>{item.feedback}</h2>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))
    }
    </>}
    <Button onClick={()=> router.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default Feedback

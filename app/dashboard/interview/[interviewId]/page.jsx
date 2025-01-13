
"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React, {use, useEffect, useState } from 'react'
import Webcam from 'react-webcam';

const Interview = ({params : asyncParams}) => {
    const params = use(asyncParams)
    const [interviewData, setInterviewData] = useState();
    const [webCamEnable, setWebCamEnable] = useState(false);
    //params = mockID -> uuid
    useEffect(()=>{
        console.log(params.interviewId);
        GetInterviewDetails();
    }, [])

    //fetches interview record which matches params interview id
    const GetInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
        console.log(result);
        //fechting first result
        setInterviewData(result[0]);
        console.log("inter")
        console.log(interviewData);
    }
    useEffect(() => {
      if (interviewData) {
        console.log("Updated interviewData:", interviewData);
      }
    }, [interviewData]);
  return (
    <div className='my-10'>
      <h2 className='font-bold text-2xl'>
        Let's get strated
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
      <div className='flex flex-col my-5 gap-5'>
        <div className='flex flex-col p-5 rounded-lg border gap-5'>
        {interviewData ? ( // Conditional rendering
          <>
            <h2> <strong>Job Position: </strong> {interviewData.jobPosition}</h2>
            <h2> <strong>Job Description: </strong>{interviewData.jobDesc}</h2>
            <h2><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
          </>
        ) : (
          <p>Loading interview details...</p>
        )}
        </div>
       </div> 
      <div>
        {
          webCamEnable?
          <Webcam
          onUserMedia={()=> setWebCamEnable(true)}
          onUserMediaError={()=>setWebCamEnable(false)}
          //if you raise right hand it should show right hand not like original mirror
          mirrored={true}
          style={{
            height:300,
            width:300
          }}
          />:
          <>
          <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary'/>
          <Button variant="ghost" onClick={()=>setWebCamEnable(true)}>Enable Web Cam and Microphone</Button>
          </>
        }
      </div>
      </div>
      <div className='flex justify-end items-end'>
        
        <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
        <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  )
}

export default Interview

"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { chatSession } from '@/utils/GeminiAIModal'
import { Loader, LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'
  
const AddNewInterview = () => {
  const [openDailog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //clerk hook to het user info
  const {user} = useUser();

  //save json response
  const [jsonResponse, setJsonResponse] = useState([]);
  const onSubmit=async(e)=>{

    //prevent form from refreshing and lossing all info
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition , jobDesc , jobExperience);

    const InputPrompt = "Job Position :"+ jobPosition + "Job Description :" + jobDesc + "Job Experience" + jobExperience +"give us" +process.env.NEXT_INTERVIEW_QUESTION_COUNT+ "interview questions along with Answere in JSON format, give us question and answer field on json";
    
    // call to gemini api
    const result = await chatSession.sendMessage(InputPrompt);
    //cleaning response
    const MockJsonResp = (result.response.text()).replace('```json','').replace('```','');
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);

    if(MockJsonResp)
    {
    //add interview data to the database
    const resp = await db.insert(MockInterview).values({
      mockId : uuidv4(),
      jsonMockResp: MockJsonResp,
      jobPosition: jobPosition,
      jobDesc: jobDesc,
      jobExperience: jobExperience,
      createdBy: user?.primaryEmailAddress.emailAddress,
      createdAt: moment().format('DD-MM-yyyy')
    }).returning({mockId:MockInterview.mockId});

    console.log("insert id :", resp);

    //once response is added to the database close dialoge box
    if(resp)
    {
      setOpenDialog(false);
      router.push('/dashboard/interview/'+resp[0]?.mockId)
    }
  }
  else{
    console.log("error")
  }
    setLoading(false);
  }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={()=>setOpenDialog(true)}>
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDailog}>
        <DialogContent className="max-w-xl">
            <DialogHeader>
            <DialogTitle><h2 className='font-bold text-2xl'>Tell me more about your job Interviewing</h2></DialogTitle>
            {/* <DialogDescription> */}
            <form onSubmit={onSubmit}>
                <div>
                  <h2>Add Details about your job position/role, Job description and years of experiance</h2>
                </div>
                <div className='mt-7 my-3'>
                  <label>Job Role/ Job Position</label>
                  <Input placeholder = "Ex. Full Stack Developer" required
                  onChange={(event)=>setJobPosition(event.target.value)} />
                </div>
                <div className='my-3'>
                  <label>Job Description/ Tech Stack</label>
                  <Input placeholder = "Ex. MERN, JAVA, etc" required
                  onChange={(event)=>setJobDesc(event.target.value)}/>
                </div>
                <div className='my-3'>
                  <label>Years of experience</label>
                  <Input placeholder = "Ex. 5" type = "number" required
                  onChange={(event)=>setJobExperience(event.target.value)}/>
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading? 
                    <>
                    <LoaderCircle className='animate-spin'/>'Generating from AI'
                    </>: 'Star Interview'
                    }
                   </Button>
                </div>
              </form>
            {/* </DialogDescription> */}
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview

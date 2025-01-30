
"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'

function RecordAnswerSection({mockInterviewQuestion , activeQuestionIndex , interviewId}) {

    const [userAnswer , setUserAnswer] = useState('');
    const [loading , setLoading]= useState(false);
    const {user} = useUser();
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults, //it will set ans as empty for next record each time
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        results.map((result)=>{
          //read documentation
          setUserAnswer(prevAns=>prevAns+result?.transcript)
        })
      },[results])

      useEffect(()=>{
        if(!isRecording&&userAnswer.length>3)
        {
          UpdateUserAnswerInDb();
        }
        
      },[userAnswer])

      // SHOW SAVED ANSWER ONLY AFTER RECORDING
      const StartStopRecording=async()=>{
        if(isRecording)
        {
          stopSpeechToText();

        }
        else
        {
          startSpeechToText();
        }
      }
      
      const UpdateUserAnswerInDb=async()=>{
        console.log(userAnswer)
        setLoading(true);
        const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
          ", User Answer :"+ userAnswer + ", Depends on question and user answer fro given interview question"+
          "please give us rating for answer and feedback as an area of improvement"+
          "in few lines to improve it in JSON format with rating field and feedback field";

          const result =await chatSession.sendMessage(feedbackPrompt);
          console.log(result);
          const mockJsonResp = (result.response.text()).replace('```json','').replace('```','');
          console.log(mockJsonResp);
          const JsonFeedbackResp = JSON.parse(mockJsonResp);
          console.log(interviewId);
          const resp = await db.insert(UserAnswer)
          .values({
            mockIdRef:interviewId,
            question:mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAns:userAnswer,
            feedback:JsonFeedbackResp?.feedback,
            rating:JsonFeedbackResp?.rating,
            userEmail:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-YYYY')
          })

          if(resp)
          {
            toast('User Answer recorded successfully');
            setUserAnswer('');
            setResults([]);
          }
          setResults([]);
          setLoading(false);
      }
  return (
    <div className='flex items-center justify-center flex-col'>
        <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
            src={'/webcam.png'} 
            width={200} 
            height={200} 
            alt="Webcam" 
            className="absolute"
        />
        <Webcam mirrored={true} style={{height:300, width:'100%', zIndex:10}}/>
        </div>
        
        <Button variant="outline" className="my-10" onClick={StartStopRecording}>
          {isRecording?
            <h2 className='text-red-600'>
              <Mic/> Stop Recording
            </h2>
            : 'Record answer'
          }
        </Button>
        {/* <Button onClick={()=>console.log(userAnswer)}>Show User Answer</Button> */}
    </div>
  )
}

export default RecordAnswerSection

import { index } from 'drizzle-orm/mysql-core'
import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

const QuestionsSection = ({mockInterviewQuestion , activeQuestionIndex}) => {

  const textToSpeach=(text)=>{
    if('speechSynthesis' in window)
    {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }
    else{
      alert('Sorry, Your browser does not support text to speech');
    }
  }
  return mockInterviewQuestion&&(
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {
            mockInterviewQuestion&&mockInterviewQuestion.map((Questions, index)=>(
                <h2 
                key={index}
                className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex==index&&'text-pink-600'}`}>
                Questions #{index+1}
                </h2>
            ))
        }
        </div>
        <h2 className='my-5 sm:text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
        {/* speak */}
        <Volume2 className="cursor-pointer" onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}/>
        <div className='border rounded-lg p-5 bg-pink-100'>
          <h2 className='flex gap-2 items-center text-pink-600'>
            <Lightbulb/>
            <strong>Note :</strong>
          </h2>
          <h2>
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
    </div>
  )
}

export default QuestionsSection 

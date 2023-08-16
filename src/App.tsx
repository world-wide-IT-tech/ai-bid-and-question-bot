/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { useEffect, useState } from 'react';
import copy from 'clipboard-copy';

import { BiMessageAltDetail } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FcAnswers } from 'react-icons/fc';
import { FaRegClipboard } from 'react-icons/fa';

import { Button } from './core/Button';
import Popup from './components/Popup';
import GPTAPI from './utils/GPTApiUtils';
import type { GPTAPIError } from './utils/GPTApiUtils';
import './App.css'
import { getApiKey } from './store';

function App() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [error, setError] = useState('');

  const fillForm = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    setIsLoading(true)
    try {
      setError('')
      const API_KEY = await getApiKey() as string;
      const gptApi = new GPTAPI(API_KEY);
      const res = await gptApi.processMessageToChatGPT(`write cover letter for this offer. \n ${selectedText}`);
      setAnswerText(res.choices[0].message.content);
    } catch (error: unknown | GPTAPIError) {
      // @ts-ignore
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fillAnswer = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    ev.stopPropagation();

    setIsAnswering(true)
    try {
      setError('')
      const API_KEY = await getApiKey() as string;
      const gptApi = new GPTAPI(API_KEY);
      const res = await gptApi.processMessageToChatGPT(`answer following question like a human. \n ${selectedText}`);
      setAnswerText(res.choices[0].message.content);
    } catch (error: unknown | GPTAPIError) {
      // @ts-ignore
      setError(error.message)
    } finally {
      setIsAnswering(false)
    }
  }

  const copy2Clip = async () => {
    copy(answerText);
  }

  useEffect(() => {
    const mouseUpHandler = (ev: MouseEvent) => {
      // const self = document.getElementById('ai-bid-bot');
      console.log('ev', ev)
      const selectedContent = window.getSelection()?.toString()
      console.log('selectedContent', selectedContent)

      if (ev.button == 0 && selectedContent) {
        setSelectedText(selectedContent)
        setPosition({
          x: ev.x,
          y: ev.y,
        })
        setShowPopup(true)
      } else {
        console.log('No left button')
        console.log('No Text')
        setSelectedText('')
        setShowPopup(false)
      }
    }
    window.addEventListener('mouseup', mouseUpHandler)
    return () => {
      window.removeEventListener('mouseup', mouseUpHandler)
    }
  }, [answerText])

  // focusin handler
  useEffect(() => {
    const focusinHandler = (ev: FocusEvent) => {
      const target = ev.target as HTMLInputElement | HTMLTextAreaElement;
      if (answerText) {
        target.value = answerText;
      }
    }
    window.addEventListener('focusin', focusinHandler)
    return () => {
      window.addEventListener('focusin', focusinHandler)
    }
  }, [answerText])

  return (
    <>
      <div className='fixed z-[1000000000]'
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div id='ai-bid-bot' className={`bg-slate-600 rounded-lg p-1 ${showPopup ? 'block' : 'hidden'}`}>
          <div>
            <Button title={isLoading ? 'Processing...' : 'Generate Cover letter'} disabled={isLoading} onClick={fillForm}>
              {isLoading ? <AiOutlineLoading3Quarters /> : <BiMessageAltDetail />}
            </Button>
            <Button className='ml-1' title={isAnswering ? 'Processing...' : 'Generate Answer'} disabled={isAnswering} onClick={fillAnswer}>
              {isAnswering ? <AiOutlineLoading3Quarters /> : <FcAnswers />}
            </Button>
            <Button className='ml-1' title='Copy to Clipboard' disabled={!answerText} onClick={copy2Clip}>
              <FaRegClipboard />
            </Button>
          </div>

          <div>
            <div className='text-red-600'>{error}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

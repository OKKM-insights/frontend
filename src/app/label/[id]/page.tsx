"use client"

import { useState } from 'react';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Joyride, { Step, CallBackProps } from 'react-joyride';
import { Button } from "@/components/ui/button";
import { HelpCircle } from 'lucide-react';

const LabelStudioUI = dynamic(() => import('../../../components/LabelStudioUI'), {
  ssr: false,
});

const Label: React.FC = () => {
  const { id } = useParams();
  const [runTutorial, setRunTutorial] = useState(id == "Tutorial");
  const [joyrideKey, setJoyrideKey] = useState(0);


  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      // Tutorial finished or skipped
      setRunTutorial(false);
      setJoyrideKey(prevKey => prevKey + 1);
    }
  };

  const steps: Step[] = [
    {
      target: '.Panel_block__controls__psq4W',
      content: 'Use these tools to modify the labels you have created',
      disableBeacon: true,
    },
    {
      target: '.ant-tag',
      content: 'Choose a label choice, and draw your label on the image below',
      disableBeacon: true,
    },
    {
      target: '.ant-form-item-control-input-content',
      content: 'When there is nothing to label, check this box',
      disableBeacon: true,
    },
    {
      target: '.ls-skip-btn',
      content: 'Use this button when you are unsure on how to label the image',
      disableBeacon: true,
    },
    {
      target: '.ls-submit-btn',
      content: 'Use this button when you have finished your labeling of an image and want to submit',
      disableBeacon: true,
    },
  ]
  return (
    <>
        <Header status='logged_in'/>
        <div className="bg-black min-h-[90vh]">
          <Joyride
            key={joyrideKey}
            steps={steps}
            run={runTutorial}
            continuous={true}
            showSkipButton={true}
            hideCloseButton={true}
            scrollDuration={0}
            styles={{
              options: {
                primaryColor: '#3b82f6',
                backgroundColor: '#1f2937',
                textColor: '#f3f4f6',
                arrowColor: '#1f2937',
                zIndex: 1000,
              },
              tooltip: {
                fontSize: 15,
                padding: 15,
              },
              tooltipContainer: {
                textAlign: 'left',
              },
              buttonNext: {
                backgroundColor: '#3b82f6',
                fontSize: 14,
                padding: '8px 15px',
              },
              buttonBack: {
                color: '#3b82f6',
                marginRight: 10,
              }
            }}
            disableScrolling={true}
            disableScrollParentFix={true}
            callback={handleJoyrideCallback}
          />
          <LabelStudioUI />
          <div className="flex items-center justify-center">
            <Button 
              variant="outline" 
              className="mt-4 bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => setRunTutorial(true)}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
    </>
    
  );
};

export default Label;
"use client"

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useParams } from 'next/navigation';
import Joyride, { Step, CallBackProps } from 'react-joyride';
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import PhotoLabelingTool from '@/components/PhotoLabelingTool';
import { BoundingBox, Image } from '@/types';

const Label: React.FC = () => {
  const { id } = useParams();
  const [runTutorial, setRunTutorial] = useState(id == "Tutorial");
  const [joyrideKey, setJoyrideKey] = useState(0);
  const { user, loading} = useAuth();
  const [labels, setLabels] = useState<string[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const router = useRouter();

  useEffect(() => {
    if (!loading && !(user?.userType === "labeller")) {
      router.push('/');
    }
  }, [user, router, loading]);

  const fetchProjectDetails = async () => {
    try {
      //const url = `http://localhost:5050/api/project/${id}`
      const url = `https://api.orbitwatch.xyz/api/project/${id}`
      const response = await axios.get(url);
      console.log(response.data)
      const categoriesString = response.data.categories;
      setLabels(categoriesString.split(',').map((category: string) => category.trim()));
      // Fetch images once the project details are available
      await fetchImages();
      setLoadingProject(false)
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError("Error fetching project details")
      setLoadingProject(false)
    }
  };

  const fetchImages = async () => {
    try {
      //const url = `http://localhost:5050/api/getImages?projectId=${id}&limit=${limit}&offset=${offset}&userId=${userId}`
      const url = `https://api.orbitwatch.xyz/api/getImages?projectId=${id}&limit=${limit}&offset=${offset}&userId=${user?.id}`
      const response = await axios.get(url);
      console.log(response.data.images)
      setImages(prevImages => [...prevImages, ...response.data.images]);
      setOffset(curr => curr + limit)
    } catch (error) {
      setError("Error fetching images")
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    if (!loading){
      fetchProjectDetails();
    }
  }, [loading]);

  if (!user || loadingProject) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>{error}</p>
  }

  const getCurrentTimestamp = () => {
    const now = new Date();
    const isoString = now.toISOString().replace("T", " ").replace("Z", "");
    return isoString.slice(0, 23) + "00";
  };

  const handleImageProcessed = () => {
    setImages(prevImages => {
      const updatedImages = prevImages.slice(1); // Remove the first image
      if (updatedImages.length <= 2) {
        fetchImages();  // Fetch new images if 2 or less remain
      }
      return updatedImages;
    });
  };

  const handleSubmit = (labels : BoundingBox[], image: Image, skip : boolean, nothing : boolean) => {
    if (labels.length == 0 && !skip && !nothing){
      alert("No Labels to Submit!");
      return;
    }
    handleImageProcessed();
    let labelData = [];
    const time = getCurrentTimestamp();
  
    if (nothing) {
      labelData.push({
        LabellerID: user.id,
        ImageID: image.id,
        OrigImageID: image.orig_image_id,
        Class: "__nothing__",
        bot_right_x: null,
        bot_right_y: null,
        top_left_x: null,
        top_left_y: null,
        offset_x: image.x_offset,
        offset_y: image.y_offset,
        creation_time: time,
      });
    } else if (skip){
      labelData.push({
        LabellerID: user.id,
        ImageID: image.id,
        OrigImageID: image.orig_image_id,
        Class: "__skip__",
        bot_right_x: null,
        bot_right_y: null,
        top_left_x: null,
        top_left_y: null,
        offset_x: image.x_offset,
        offset_y: image.y_offset,
        creation_time: time,
      });
    } else {
      labelData = labels.map(label => {
        return {
          LabellerID: user.id,
          ImageID: image.id,
          OrigImageID: image.orig_image_id,
          Class: label.label,
          bot_right_x: label.brx,
          bot_right_y: label.bry,
          top_left_x: label.tlx,
          top_left_y: label.tly,
          offset_x: image.x_offset,
          offset_y: image.y_offset,
          creation_time: time,
        };
      });
    }

    console.log(labelData)

    // let url = "http://3.93.145.140/1.0/push_label";
    const url = "https://label.orbitwatch.xyz/1.0/push_label";
    axios.post(url, { labels: labelData })
      .then(response => {
        console.log('Data submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting data:', error);
      });
  };

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
      target: '.label-options',
      content: 'Choose a label choice, and draw your label on the image below.',
      disableBeacon: true,
    },
    {
      target: '.labeling-toolbar',
      content: 'Use these tools to assist you when labeling. They all have keyboard shortcuts which can be viewed by hovering over the tool',
      disableBeacon: true,
    },
    {
      target: '.zoom-controls',
      content: 'Zoom in and out of the image with these tools. Select the Move Mode button to move the photo around when zoomed in.',
      disableBeacon: true,
    },
    {
      target: '.adjust-tools',
      content: 'Adjust the contrast and brightness of this image with these sliders.',
      disableBeacon: true,
    },
    {
      target: '.reset-view',
      content: 'The reset view button allows you to set zoom, brightness, contrast, and the image position back to default.',
      disableBeacon: true,
    },
    {
      target: '.undo-label',
      content: 'The undo button allows you to undo your last label.',
      disableBeacon: true,
    },
    {
      target: '.reset-labels',
      content: 'The clear labels button allows you to remove all the labels on the canvas.',
      disableBeacon: true,
    },
    {
      target: '.no-labels',
      content: 'When there is nothing to label, click this button',
      disableBeacon: true,
    },
    {
      target: '.skip-image',
      content: 'Use this button when you are unsure on how to label the image',
      disableBeacon: true,
    },
    {
      target: '.submit-labels',
      content: 'Use this button when you have finished your labeling of an image and want to submit',
      disableBeacon: true,
    },
  ]

  return (
    <>
        <Header status='logged_in'/>
        <div className="bg-black min-h-[90vh]">
          <div className="pl-4 pt-1">
            <Button variant="ghost" className="text-white hover:text-black" onClick={() => {router.push('/label-projects')}}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
          </div>
          {images.length === 0 ? <p className="text-white text-center text-5xl font-bold p-6 rounded-lg shadow-lg">
                Project Complete
              </p> : 
          <PhotoLabelingTool labels={labels} image={images[0]} onSubmit={handleSubmit} />}
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
        </div>
    </>
    
  );
};

export default Label;
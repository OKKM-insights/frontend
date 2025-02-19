import { useEffect, useState, useRef } from 'react';
import LabelStudio from "label-studio";
import "label-studio/build/static/css/main.css";
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const LabelStudioUI = ({id, userId}) => {
  const [labels, setLabels] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const labelStudioRef = useRef(null);
  const limit = 5;

  const fetchProjectDetails = async () => {
    try {
      //const url = `http://localhost:5050/api/project/${id}`
      const url = `https://api.orbitwatch.xyz/api/project/${id}`
      const response = await axios.get(url);
      console.log(response.data)
      const categoriesString = response.data.categories;
      setLabels(categoriesString.split(',').map(category => category.trim()));
      // Fetch images once the project details are available
      await fetchImages();
      setLoading(false)
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError(error)
      setLoading(false)
    }
  };

  const fetchImages = async () => {
    try {
      //const url = `http://localhost:5050/api/getImages?projectId=${id}&limit=${limit}&offset=${offset}&userId=${userId}`
      const url = `https://api.orbitwatch.xyz/api/getImages?projectId=${id}&limit=${limit}&offset=${offset}&userId=${userId}`
      const response = await axios.get(url);
      console.log(response.data.images)
      setImages(prevImages => [...prevImages, ...response.data.images]);
      setOffset(curr => curr + limit)
    } catch (error) {
      setError(error)
      console.error("Error fetching images:", error);
    }
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    const isoString = now.toISOString().replace("T", " ").replace("Z", "");
    return isoString.slice(0, 23) + "00";
  };
  

  const handleSubmit = (labels, image, skip, nothing) => {
    let labelData = [];
    let time = getCurrentTimestamp();
  
    if (nothing) {
      labelData.push({
        LabellerID: userId,
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
        LabellerID: userId,
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
          LabellerID: userId,
          ImageID: image.id,
          OrigImageID: image.orig_image_id,
          Class: label.value.rectanglelabels[0],
          bot_right_x: ((label.value?.x + label.value?.width) / 100)*image.image_width,
          bot_right_y: ((label.value?.y + label.value?.height) / 100)*image.image_height,
          top_left_x: (label.value?.x / 100)*image.image_width,
          top_left_y: (label.value?.y / 100)*image.image_height,
          offset_x: image.x_offset,
          offset_y: image.y_offset,
          creation_time: time,
        };
      });
    }

    console.log(labelData)

    // let url = "http://3.93.145.140/1.0/push_label";
    let url = "https://label.orbitwatch.xyz/1.0/push_label";
    axios.post(url, { labels: labelData })
      .then(response => {
        console.log('Data submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting data:', error);
      });
  };

  // Function to initialize Label Studio
  const initializeLabelStudio = (image) => {
    labelStudioRef.current = new LabelStudio("label-studio", {
      config:`
        <View>
          <Header value="Label the Following"
                style="font-weight: normal"/>
          <RectangleLabels name="tag" toName="img" allowEmpty="false">
              ${labels.map(label => `<Label value="${label}"/>`).join('')}
          </RectangleLabels>
          <Image horizontalAlignment="center" crosshair="true" brightnessControl="true" contrastControl="true" zoom="true" negativeZoom="true" zoomControl="true" name="img" value="$image"></Image>
          <View style="width: 130px; cursor: pointer; margin: 0 auto;">
            <Text name="Nothing to Label" value="Nothing to Label" />
          </View>
        </View>
      `,
      interfaces: [
        "panel",
        "update",
        "submit",
        "controls",
        "skip",
        "instruction",
      ],
      
      user: {
        pk: 1,
        firstName: "James",
        lastName: "Dean"
      },

      task: {
        annotations: [],
        predictions: [],
        data: {
          image: `data:image/png;base64,${image.image}`,
        }
      },

      continuousLabeling: true,

      onLabelStudioLoad: function (LS) {
        const c = LS.annotationStore.addAnnotation({
          userGenerate: true
        });
        LS.annotationStore.selectAnnotation(c.id);
      },

      onSubmitAnnotation: function (LS, annotation) {// eslint-disable-line @typescript-eslint/no-unused-vars
        // Dont allow submits on nothing
        console.log(annotation.serializeAnnotation());
        let results = annotation.serializeAnnotation()
        if (results.length !== 0){
          handleImageProcessed();
          handleSubmit(results, image, false, false)
        }
        
      },

      onSkipTask: function (LS) {// eslint-disable-line @typescript-eslint/no-unused-vars
        handleImageProcessed();
        handleSubmit([], image, true, false)
      },
    });
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

  useEffect(() => {
    if (images.length > 0) {
      initializeLabelStudio(images[0]);  // Initialize with the first image in the array
      const buttons = document.querySelectorAll('.Panel_block__controls__psq4W .ant-btn');
      let buttonTags = ["Undo:[Ctrl+Z]", "Redo:[Ctrl+Y]", "Reset:[Ctrl+X]"];
      for (let ind = 0; ind < 3; ind++){
        if (buttons.length > ind && buttons[ind]) {
          addCustomTooltip(buttons[ind], buttonTags[ind]);
        }
      }
      const nothingBtn = document.querySelector('.Text_block__1VM-S');
      if (nothingBtn) {
        nothingBtn.onclick = () => {
          handleSubmit([], images[0], false, true);
          handleImageProcessed();
        }
      }
      
    }
  }, [images]);  // Re-run when images change

  // Fetch initial images when component mounts
  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const addCustomTooltip = (button, shortcut) => {
    const tooltip = document.createElement('span');
    tooltip.className = 'custom-tooltip';
    tooltip.innerText = `${shortcut}`;
  
    button.classList.add('button-with-tooltip');
    button.style.position = 'relative'; // Ensure proper positioning
    button.appendChild(tooltip);
  };

  // Add hotkey bindings
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.ctrlKey && event.key === "Enter") {
        const submitButton = document.querySelector("button.ls-submit-btn");
        if (submitButton) submitButton.click();
      }
      if (event.ctrlKey && event.code === "Space") {
        const skipButton = document.querySelector("button.ls-skip-btn");
        if (skipButton) skipButton.click();
      }
      if (event.ctrlKey && event.key === "z") {
        const buttons = document.querySelectorAll('.Panel_block__controls__psq4W .ant-btn');
        if (buttons.length > 0 && buttons[0]) {
          buttons[0].click();
        }
      }
      if (event.ctrlKey && event.key === "y") {
        const buttons = document.querySelectorAll('.Panel_block__controls__psq4W .ant-btn');
        if (buttons.length > 1 && buttons[1]) {
          buttons[1].click();
        }
      }
      if (event.ctrlKey && event.key === "x") {
        const buttons = document.querySelectorAll('.Panel_block__controls__psq4W .ant-btn');
        if (buttons.length > 2 && buttons[2]) {
          buttons[2].click();
        }
      }

    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  if (loading){
    return <LoadingSpinner />
  }

  if (error) {
    return <p>{error}</p>
  }

  if (images.length === 0){
    return (
        <p className="text-white text-center text-5xl font-bold p-6 rounded-lg shadow-lg">
          Project Complete
        </p>
    )
  }

  return (
    <div
      id="label-studio"
      className="bg-black p-2.5 w-1/2 mx-auto"
    ></div>
  );
}

export default LabelStudioUI;

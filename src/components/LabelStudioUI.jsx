import { useEffect, useState, useRef } from 'react';
import LabelStudio from "label-studio";
import "label-studio/build/static/css/main.css";

const LabelStudioUI = (props) => {// eslint-disable-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(0); // Track the current task ID
  const labelStudioRef = useRef(null); // Store the LabelStudio instance
  const images = [
    `/images/airport_1.png`,
    `/images/airport_2.png`,
    `/images/airport_3.png`
  ];

  // Function to initialize Label Studio
  const initializeLabelStudio = (taskId) => {
    labelStudioRef.current = new LabelStudio("label-studio", {
      config: taskId%2 === 0 ?`
        <View>
          <Header value="Label the Planes"
                style="font-weight: normal"/>
          <RectangleLabels name="tag" toName="img" allowEmpty="false">
              <Label value="Plane"/>
          </RectangleLabels>
          <Image name="img" value="$image"></Image>
          <Choices name="noLabelOption" toName="img">
              <Choice value="Nothing to Label" />
          </Choices>
        </View>
      ` : `<View>
            <Header value="Do you see a plane?"
                style="font-weight: normal"/>
            <Choices name="sentiment" toName="img" choice="single" showInLine="true">
              <Choice value="Yes"/>
              <Choice value="No"/>
            </Choices>
            <Image name="img" value="$image"></Image>
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
        id: taskId + 1, // Pass current task ID
        data: {
          image: images[taskId], // Use the current image based on task ID
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
        console.log(annotation.serializeAnnotation());
        setSelected(!selected);
        getAnnotations();

        // Move to the next task by updating task ID
        const nextTaskId = (taskId + 1) % images.length; // Loop through tasks
        setCurrentTaskId(nextTaskId);
      },

      onSkipTask: function (LS) {// eslint-disable-line @typescript-eslint/no-unused-vars
        console.log(`Task ${taskId + 1} skipped.`);
        
        // Move to the next task
        const nextTaskId = (taskId + 1) % images.length;
        setCurrentTaskId(nextTaskId);
      },

      // onEntityCreate: function (LS) {
      //   console.log(`Task ${taskId + 1} created.`);
      // }
    });
  };

  // Reinitialize Label Studio when the task ID changes
  useEffect(() => {
    initializeLabelStudio(currentTaskId);
  }, [currentTaskId]); // Dependency on task ID changes

  // annotations can be accessed accordingly, so we can define our own buttons as we like
  const getAnnotations = () => {
    if (labelStudioRef.current) {
      const annotationStore = labelStudioRef.current.annotationStore;
      const selectedAnnotation = annotationStore.selected;
      if (selectedAnnotation) {
        const serializedAnnotation = selectedAnnotation.serializeAnnotation();
        console.log("Another function: ", serializedAnnotation); // This will log the serialized annotation
        return serializedAnnotation;
      }
    }
    return null; // If no annotation is selected
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

  return (
    <div
      id="label-studio"
      className="bg-black p-2.5 w-1/2 mx-auto"
    ></div>
  );
}

export default LabelStudioUI;
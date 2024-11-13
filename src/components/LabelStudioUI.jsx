import { useEffect, useState, useRef } from 'react';
import LabelStudio from "label-studio";
import "label-studio/build/static/css/main.css";

const LabelStudioUI = (props) => {// eslint-disable-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(0); // Track the current task ID
  const labelStudioRef = useRef(null); // Store the LabelStudio instance
  const images = [
    `/images/pets.jpg`,
    `/images/pet2.jpg`
  ];

  // Function to initialize Label Studio
  const initializeLabelStudio = (taskId) => {
    labelStudioRef.current = new LabelStudio("label-studio", {
      config: taskId === 0 ?`
        <View>
          <Header value="Label the Following Animals"
                style="font-weight: normal"/>
          <RectangleLabels name="tag" toName="img" allowEmpty="false">
              <Label value="Turtle"></Label>
              <Label value="Parrot"></Label>
              <Label value="Rabbit"></Label>
          </RectangleLabels>
          <Image name="img" value="$image"></Image>

        </View>
      ` : `<View>
            <Choices name="sentiment" toName="img" choice="single" showInLine="true">
              <Choice value="Cat"/>
              <Choice value="Dog"/>
              <Choice value="Bird"/>
            </Choices>
            <Image name="img" value="$image"></Image>
          </View>
      `,
          // Add for background picture
          //<View style="position: absolute; top: 50px; left: 0; z-index: -1;">
          //     <Image name="img2" value="$image"></Image>
          // </View>
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

      onEntityCreate: function (LS) {
        console.log(`Task ${taskId + 1} created.`);
      }
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

  return (
    <div
      id="label-studio"
      className="bg-black p-2.5 w-1/2 mx-auto"
    ></div>
  );
}

export default LabelStudioUI;
import Details from "./components/Details";
import Feed from "./components/Feed";
import styles from './style.module.css';
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import {drawRect} from "./components/Utilities";


function App() {
  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const abortControllerRef = React.useRef(null);
  const threshold = 0.7

  // States used by classes and their setters
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [neuralNetLeft, setNeuralNetLeft]=useState()
  const [neuralNetRight, setNeuralNetRight]=useState()
  const [result, setResult] = useState("")  //
  const [currentQuestion, setCurrentQuestion]=useState("") //quiz
  const [questions, setQuestions]=useState([]) //quiz
  const [score, setScore] = useState(0)  //app
  const [scoreUpdate, setScoreUpdate] = useState(false)
  const [isQuiz, setisQuiz] = useState(false)  //sa  quiz lang
  const [detectEnabled, setDetectEnabled] = useState(false)
  const [rightMode, setRightMode] = useState(true)
  
  let netLeft, netRight;

  // Loading of the model locally
  const runCoco = async () => {
    //Load the models, as you can see, for netRight, we are using the model trained for left hand, this is due to the reacts webcam, that is innately not mirrored 
    netRight = await tf.loadGraphModel(process.env.PUBLIC_URL + 'model-20k-left/model.json') 
    netLeft= await tf.loadGraphModel(process.env.PUBLIC_URL + 'model-20k-right/model.json') 
    setNeuralNetLeft(netLeft);
    setNeuralNetRight(netRight);
    setModelsLoaded(true);
    console.log("Done loading models")

  };

  // Reset canvas for next detection
  function resetCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const objectPrinter = async (obj) =>{
    console.log(await obj[0].array())
    console.log(await obj[1].array())
    console.log(await obj[2].array())
    console.log(await obj[3].array())
    console.log(await obj[4].array())
    console.log(await obj[5].array())
    console.log(await obj[6].array())
    console.log(await obj[7].array())
  }

  const modePrinter = async () =>{
    if(rightMode){
      console.log("Using right hand model")
    }else{
      console.log("Using left hand model")
    }
  }

  // Detect function
  const detect = async (net) => {
    // why is this needed? when we use the use state for the first time, the neuralNet will 
    // only update when the state has been set, thus we use a local variable for the network,
    //  neuralNet is used to pass the network to the detect button functionality in the feed
    // when a state change and the app is re rendered, the neuraNet is already been set, and
    // since the runCoco command will only run in the first rendering, the net will remain
    // undefined now, thus we will use the neuralNet that is loaded in the state as the network for this function
    
    if(net === undefined && modelsLoaded===true){
      if (rightMode && neuralNetRight !== undefined){
        net = neuralNetRight
        console.log("Using right hand model ---")
      }else if (!(rightMode) && neuralNetLeft !== undefined){
        net = neuralNetLeft
        console.log("Using left hand model ---")
      }
    }

    // Check if webcam feed is available and properly set
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640,480])  // i should inspect if wether 640 by 480 ba yung webcam feed, and if hinde, imatch
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)

      // Check here what model to use based on hand method
      const obj = await net.executeAsync(expanded)
      // objectPrinter(obj)


      // Set up bounding boxes, classes, and scores from the object generated
      let indexes;
      if (rightMode){
        indexes = [1,6,7]
      }else{
        indexes = [5,0,6]
      }

      const boxes = await obj[indexes[0]].array()
      const classes = await obj[indexes[1]].array()
      const scores = await obj[indexes[2]].array()

      // Draw mesh and show detections
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(()=>{drawRect(
        setDetectEnabled, scoreUpdate, setScoreUpdate ,setScore,  score, 
        currentQuestion, boxes[0], classes[0], scores[0], threshold, videoWidth, videoHeight, ctx, isQuiz, setResult
        )}); 

      // Dispose created object for next detection
      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)
      
      setTimeout(() => {
        // reset canvas after 5 seconds
        resetCanvas()
      }, 5000);
           
    }
  };

  
  // Initialize the neural network
  useEffect(()=>{runCoco()}, []);

  // Function that allows for continuous detection, and stops if the quiz is engaged
  useEffect(()=>{    
    let intervalId;
    abortControllerRef.current = new AbortController();
    const startDetecting = () => {
      intervalId = setInterval(async () => {
        if (!isQuiz && modelsLoaded===true) {
          if(rightMode){
            await detect(netRight, abortControllerRef.current);
          }else{
            await detect(netLeft, abortControllerRef.current);
          }
          
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
    }
    startDetecting();
    return () => clearInterval(intervalId);
  },[isQuiz, netLeft, netRight, modelsLoaded, rightMode])

  // Aborts on-going detection if the quiz is engaged
  const handleCancel = () => {
    abortControllerRef.current.abort();
  };

  return (
    <div className={styles.App}>
      <Feed detectEnabled={detectEnabled} webcamRef={webcamRef} canvasRef={canvasRef} isQuiz={isQuiz} detect={detect} neuralNetLeft={neuralNetLeft} neuralNetRight={neuralNetRight} rightMode={rightMode}></Feed>
      
      <Details
        rightMode={rightMode}
        setRightMode={setRightMode}
        handleCancel = {handleCancel}
        setDetectEnabled = {setDetectEnabled} 
        setScoreUpdate = {setScoreUpdate}
        score={score}
        setScore={setScore}
        isQuiz={isQuiz} 
        setisQuiz={setisQuiz} 
        result={result}
        setResult={setResult} 
        currentQuestion = {currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        questions = {questions}
        setQuestions = {setQuestions}
      ></Details>
    </div>
  );
}

export default React.memo(App);

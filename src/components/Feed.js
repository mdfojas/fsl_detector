import styles from '../style.module.css';
import Webcam from "react-webcam";
import React, { useEffect } from 'react';
function Feed ({detectEnabled, webcamRef, canvasRef, isQuiz, detect, neuralNetLeft, neuralNetRight, rightMode}){
    
    // Detect function for the Detect button
    const startDetection = () => {
      if(rightMode){
        detect(neuralNetRight);
      }else{
        detect(neuralNetLeft);
      }
    };

    // Event listener for detection if Enter key is pressed
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        startDetection();
      }
    }

    useEffect(() => {
      document.addEventListener('keypress', handleKeyPress);
      return () => {
        document.removeEventListener('keypress', handleKeyPress);
      };
    });

    return <div className={styles.feed}>
        <Webcam
          ref={webcamRef}
          muted={true} 
          className={styles.webcam}
        />

        <canvas
          ref={canvasRef}
          className={styles.canvas}
        />

        {isQuiz? <button className={detectEnabled? styles.detect_feed: styles.detect_feed_disabled}  onClick={startDetection} disabled={!detectEnabled}>Detect</button>
        : <></>}
    </div>

}

export default Feed;
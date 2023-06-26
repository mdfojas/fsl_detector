import styles from '../style.module.css';
import React from 'react';
import {labels} from "./Utilities";
import { useEffect, useState } from 'react';


const Quiz = ({ handleCancel, setDetectEnabled, setScoreUpdate, score, setScore, setisQuiz, result, setResult, currentQuestion,
    setCurrentQuestion, questions, setQuestions, setEndScreen}) => {
    const [count, setCount] = useState(0)
    const MAX_QUESTIONS = 10

    // Generation of each questions in the quiz
    const generateQuestion = () => {

        // Get unasked signs from the original labels list
        const remainingLabels = labels.filter(x => !questions.includes(x));


        if (count < MAX_QUESTIONS && remainingLabels.length !== 0) {
            const randomIndex = Math.floor(Math.random() * remainingLabels.length);
            setScoreUpdate(true)
            setDetectEnabled(true)
            setCurrentQuestion(remainingLabels[randomIndex]);
            setQuestions([...questions, remainingLabels[randomIndex]])
            
            setCount(count + 1)
        } else {
            setEndScreen(true)
            setCurrentQuestion("")
        }

    }

    // Onclick function for the Next Button which generates the next item in the quiz
    const handleNext = (e) => {
        setResult("")
        generateQuestion();
   
    }

    // Starting point in the quiz
    const handleQuizScreens = (e) => {
        if (currentQuestion === "") {
            generateQuestion();
        }
    };

    // Reset States for each dependency (variables) 
    const cancelQuiz=()=>{
        setisQuiz(false)
        setEndScreen(false)
        setScore(0)
        setDetectEnabled(true)
        setCurrentQuestion("")
      }
    
    // Shows whether the detected sign is right or wrong
    const showCorrectOrWrong = () => {
        let message;
        if (result === currentQuestion) {
          message = `You are correct, congratulations! Current Score: ${score}`;
        } else {
          message = `Aww, You are incorrect! Current Score: ${score}`;
        }
        return message;
      };


    // Aborts previews detection ongoing as the quiz starts and starts the quiz
    useEffect(() => {
        handleCancel()
        handleQuizScreens()
    });

    return <div className={styles.quiz}>
                <h4>Result: {result}</h4>
                {result !== "" ? <><h4>{showCorrectOrWrong()}</h4><button onClick={handleNext} className={styles.quizbutton}>
                    Next
                    </button></> : <h4>Please show me how to sign letter {currentQuestion}</h4>
                }
                <button onClick={cancelQuiz} className={styles.quizstartbutton} >
                    Cancel
                </button>
            </div>
}

export default React.memo(Quiz);
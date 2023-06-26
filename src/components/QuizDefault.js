import styles from '../style.module.css';
import React from 'react';

const QuizDefault =({setisQuiz, setResult, setQuestions})=>{

    // Initialize starting conditions for variables
    const handleStartQuiz=()=>{
        setResult("");
        setisQuiz(true)
        setQuestions([])
    };

    return <div className={styles.quizdefault}  >
                <h4>
                    Want to take a quiz to test your knowledge?
                </h4>
                <button onClick={handleStartQuiz} className={styles.quizstartbutton} >
                    Start Quiz
                </button>
            </div>
}

export default React.memo(QuizDefault);
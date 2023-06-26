import styles from '../style.module.css';
import React from 'react';

const EndScreen =({score, setScore, setisQuiz, setEndScreen, setResult})=>{

    // Updating of states so that the quiz will reset
    const finishQuiz=()=>{
        setisQuiz(false)
        setEndScreen(false)
        setScore(0)
    }


    return <div className={styles.quizdefault}  >
                <h4>
                    Your Score: {score}. Thank you for taking the quiz! I hope you learned something!
                </h4>
                <button onClick={finishQuiz} className={styles.quizstartbutton} >
                    Finish
                </button>
            </div>
}

export default React.memo(EndScreen);
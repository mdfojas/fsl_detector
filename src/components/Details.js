import styles from '../style.module.css';
import ChangeMode from './ChangeMode';
import DetailsHeader from './DetailsHeader';
import EndScreen from './EndScreen';
import Quiz from './Quiz';
import QuizDefault from './QuizDefault';
import SignDetected from "./SignDetected";
import Tutorials from './Tutorials';
import React, { useState } from 'react';



const Details =({ rightMode, setRightMode, handleCancel, setDetectEnabled, setScoreUpdate, score, setScore, isQuiz, setisQuiz, result, setResult, currentQuestion, setCurrentQuestion, questions, setQuestions, detect, neuralNet})=>{
    
    // State used to keep count of questions and know when to set the end screen of quiz
    const [endScreen, setEndScreen] = useState(false)

    return <div className={styles.details}>
        <DetailsHeader></DetailsHeader>
        
        <SignDetected
            result = {result}
        ></SignDetected>

        <Tutorials
            isQuiz={isQuiz}
        ></Tutorials>

        {/* Handles the display of the Quiz Section */}
        {isQuiz?         
        (!endScreen? <Quiz 
            handleCancel = {handleCancel}
            setDetectEnabled = {setDetectEnabled}
            setScoreUpdate={setScoreUpdate}
            score= {score}
            setScore = {setScore}
            setisQuiz={setisQuiz} 
            result={result}
            setResult={setResult} 
            currentQuestion = {currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            questions = {questions}
            setQuestions = {setQuestions}
            setEndScreen = {setEndScreen}
        ></Quiz> : 
        <EndScreen score = {score} setScore = {setScore} setisQuiz={setisQuiz} setEndScreen={setEndScreen} setResult={setResult} setQuestions={setQuestions}></EndScreen>
        ): <QuizDefault setisQuiz={setisQuiz} setResult={setResult} setQuestions = {setQuestions} ></QuizDefault>}
        
        <ChangeMode rightMode={rightMode} setRightMode={setRightMode}></ChangeMode>
    </div>
}

export default React.memo(Details);
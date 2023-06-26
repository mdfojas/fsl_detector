import styles from '../style.module.css';
import React, {useState} from 'react';
import {labels} from "./Utilities";

const Tutorials = ({ isQuiz }) => {
    const [buttonClicked, setButtonClicked] = useState("") //tutorial
    const [isButtonClicked, setIsButtonClicked] = useState(false)
    
    // This function handles each click of the buttons generated. Sets the button clicked to the state, so that the image of the sign 
    // can be shown in the application
    const handleClick = (label) => {
        let toClick;
        if (isButtonClicked === true) {
            if (buttonClicked === label) {
                toClick = false
            } else {
                toClick = true
            }
        } else if (isButtonClicked === false) {
            toClick = true
        }

        if (toClick) {
            setButtonClicked(label)
            setIsButtonClicked(true)
        } else {
            setButtonClicked("")
            setIsButtonClicked(false)
        }
    }

    // Iterates through the labels list which contains all the signs recognized and produces a button for each sign
    const buttons = labels.map((name, index) => {
        return <button className= {styles.tutorial_button} key={index} name={labels[index]} onClick={() => handleClick(name)} >{name}</button>;
    });

    // Conditional rendering of tutorials, the tutorials section should'nt e shown when the quiz starts
    return (
        (isQuiz ? (<></>) :
            (<div className={styles.tutorials}>
                {buttons}
                {isButtonClicked ? (<img className ={styles.image} src={require('../images/'+buttonClicked+'.jpg')} alt={"This is the tutorial for A"} />):(<></>)}
                
            </div>))

    )
}

export default React.memo(Tutorials);
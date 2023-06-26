import styles from '../style.module.css';
import React from 'react';

// This class returns the Change Mode button that will be used to change the mode of the detection. 
// If Right mode is being used and the button is clicked, then Left mode will be enabled, vice versa.
const ChangeMode=({rightMode, setRightMode})=>{
    const handleChange = () => {
        setRightMode((!rightMode))
        console.log(`Changed to ${rightMode ? 'Left handed' : 'Right handed'} mode.`);
    };

    return <button onClick={handleChange} className={styles.changeModeButton}>
                        Change mode to {rightMode? "Left Handed mode": "Right Handed Mode"}
                </button>
}

export default React.memo(ChangeMode);
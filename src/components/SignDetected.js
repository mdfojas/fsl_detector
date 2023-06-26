import styles from '../style.module.css';
import React from 'react';

// Class that is responsible for showing the detected sign as text in the right half for the application
const SignDetected=({result})=>{

    return(
        <div className={styles.signDetected}>
                <h4 className={styles.detectedText}>Detected sign: {result}</h4>
        </div>
    )
}

export default React.memo(SignDetected);
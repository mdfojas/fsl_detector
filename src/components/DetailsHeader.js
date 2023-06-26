import styles from '../style.module.css';
import React, { Component } from 'react';

// Class that is responsible for showing the Header for the application
class DetailsHeader extends Component {
    render(){
        return(
            <div className={styles.detailsheader}>
                <h3 className={styles.headertext}>Thank you for using the FSL Detector</h3>
            </div>
        )
    }

}

export default React.memo(DetailsHeader);
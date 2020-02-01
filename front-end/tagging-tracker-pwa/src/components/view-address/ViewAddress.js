import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './ViewAddress.scss';

const ViewAddress = (props) => {
    const history = useHistory();
    
    if (typeof props.location.state === "undefined") {
        history.push("/addresses");
    }

    return(
        <div className="tagging-tracker__view-address"></div>
    )
}

export default ViewAddress;
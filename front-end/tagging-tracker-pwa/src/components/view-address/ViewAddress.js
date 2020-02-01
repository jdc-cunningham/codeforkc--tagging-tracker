import React from 'react';
import { useHistory } from 'react-router-dom';
import './ViewAddress.scss';

import thumbnail1 from './../../assets/images/sample-thumbnails/thumbnail1.png';
import thumbnail2 from './../../assets/images/sample-thumbnails/thumbnail2.png';
import thumbnail3 from './../../assets/images/sample-thumbnails/thumbnail3.png';

const ViewAddress = (props) => {
    const history = useHistory();
    
    if (typeof props.location.state === "undefined") {
        history.push("/addresses");
    }

    const images = [
        thumbnail1, thumbnail2, thumbnail3
    ];

    const renderImages = () => {
        return images.map((image, index) => {
            return <div key={ index } style={{
                backgroundImage: `url(${image})`
            }} alt="address thumbnail" className="address__tag-image" />
        });
    }

    return(
        <div className="tagging-tracker__view-address">
            { renderImages() }
        </div>
    )
}

export default ViewAddress;
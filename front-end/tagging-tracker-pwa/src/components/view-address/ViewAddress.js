import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ViewAddress.scss';

const ViewAddress = (props) => {
    const history = useHistory();
    const [localImages, setLocalImages] = useState([]);
    
    if (typeof props.location.state === "undefined") {
        history.push("/addresses");
    }

    const renderTags = () => {
        console.log(props);
        const db = props.offlineStorage;

        if (db && !localImages.length) {
            db.open().then(function (db) {
                db.images.toArray().then((images) => {
                    setLocalImages(images);
                });
            }).catch (function (err) {
                // handle this failure correctly
                alert('failed to open local storage');
            });

        }
        
        return localImages.map((image, index) => {
            return <div key={ index } style={{
                backgroundImage: `url(${image.src})`
            }} alt="address thumbnail" className="address__tag-image" />
        });
    }

    return(
        <div className="tagging-tracker__view-address">
            { renderTags() }
        </div>
    )
}

export default ViewAddress;
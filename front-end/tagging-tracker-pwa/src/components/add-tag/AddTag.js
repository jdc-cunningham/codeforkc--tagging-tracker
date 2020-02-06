import React, { useRef, useState, useEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import './AddTag.scss';
import BottomNavbar from './../../components/bottom-navbar/BottomNavbar';
import { getImagePreviewAspectRatioClass } from './../../utils/image';

/**
 * Brief explanation how this works it's kind of confusing since everything is a callback of a callback
 * The bottomNavbar starts it off by setting fileUpload to true
 * Then that clicks on fileInput which if a device has a camera prompts to open the camera or show file upload(pc)
 * Then when the picture loads cameraCallback is called and the previewPhoto function is called
 * That actually renders it on page, but I'm going to resize the photo with canvas so there is a small version for previews
 * @param {*} props 
 */
const AddTag = (props) => {
    const fileInput = useRef(null);
	const [fileUpload, triggerFileUpload] = useState(false);
    const [loadedPhotos, setLoadedPhotos] = useState([]);
    const [savingToDevice, setSavingToDevice] = useState(false);

    const saveToDevice = () => {

    }

    // TODO this is not staying ugly flash
    useEffect(() => {
        props.setBodyClass("tagging-tracker__body increase-height");
    }, []);

    return (
        <>
            <div className="tagging-tracker__add-tag move-bottom-navbar-down">
            </div>
            <BottomNavbar
                {...props}
                triggerFileUpload={triggerFileUpload}
                fileUpload={fileUpload}
                saveToDevice={saveToDevice}
                savingToDevice={savingToDevice}
            />
        </>
    );
}

export default AddTag;
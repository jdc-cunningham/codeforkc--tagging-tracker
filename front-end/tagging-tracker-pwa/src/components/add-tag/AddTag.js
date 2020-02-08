import React, { useRef, useState, useEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import './AddTag.scss';
import BottomNavbar from './../../components/bottom-navbar/BottomNavbar';
import { getImagePreviewAspectRatioClass } from './../../utils/image';

/**
 * Brief explanation how this works it's kind of confusing since everything is a callback of a callback
 * The bottomNavbar starts it off by setting fileUpload to true
 * Then that clicks on fileInput which if a device has a camera prompts to open the camera or show file upload(pc)
 * Then when the fileInput changes, cameraCallback is called and the previewPhoto function is called
 * That actually renders it on page, then when the rendered image load, it has a callback to update image meta eg. width/height
 * which can only be taken from a loaded <img />
 * I'm going to resize the photo with canvas for the thumbnail and potentially save storage by capping files
 * @param {*} props 
 */
const AddTag = (props) => {
    const fileInput = useRef(null);
	const [fileUpload, triggerFileUpload] = useState(false);
    const [loadedPhotos, setLoadedPhotos] = useState([]);
    const [savingToDevice, setSavingToDevice] = useState(false);

    const saveToDevice = () => {
        setSavingToDevice(true);

        const offlineStorage = props.offlineStorage;
        const address = props.location.state;     

        // not going to add duplicate logic here because you can delete them somewhere else
        // the loaded photos are deleted after upload so duplicate issue doesn't happen unless the file is selected again
        loadedPhotos.forEach((loadedPhoto, index) => {
            offlineStorage.transaction('rw', offlineStorage.tags, async() => {
                if (
                    await offlineStorage.tags.add({
                        addressId: address.addressId,
                        fileName: loadedPhoto.meta.name,
                        src: loadedPhoto.src,
                        thumbnail_src: "",
                        meta: loadedPhoto.meta
                    }).then((insertedId) => {
                        return true;
                    })
                ) {
                    if (index === loadedPhotos.length - 1) {
                        alert('Photos saved');
                        setLoadedPhotos([]);
                        setSavingToDevice(false);
                    }
                } else {
                    alert('Failed to save photos to device');
                }
            })
            .catch(e => {
                alert('Failed to save photos to device');
            });
        });
    }

    // Step 2: when file input changes, check if file/photo selected
    const cameraCallback = (fileInput) => {
        if (fileInput.files.length) {
			previewPhoto(fileInput);
		} else {
            alert('No image selected');
        }
    }

    // Step 3: read the photo and get src plus other data like size
    const previewPhoto = (fileInput) => {
        const reader = new FileReader();
        const file = fileInput.files[0]; // I guess multi-select upload is special, I tried it doesn't work with current code

        reader.onload = function (e) {
            setLoadedPhotos(loadedPhotos.concat({
                addressId: props.location.state.addressId,
                src: e.target.result,
                thumbanil_src: "",
                meta: {
                    "name": file.name,
                    "size": file.size
                }
            }));
        }

        reader.readAsDataURL(file);
    }

    // Step 4: this runs anytime the page loads but when photos are available they will get rendered as <img />
    const renderPhotoPreviews = () => {
        return loadedPhotos.map((loadedPhoto, index) => {
            return (
                <div style={{
                    backgroundImage: 'url(' + loadedPhoto.src + ')'
                }} key={index} className="tagging-tracker__address-tag" >
                    <img src={loadedPhoto.src} onLoad={ (e) => setLoadedImageMeta(e.target, index) } />
                </div>
            )
        })
    }

    // Step 5: this is a callback when the new <img />'s load to get additional meta
    // the meta's collected in different stages, the file itself(previewPhoto) has the name, size
    // the image that loads has the width/height
    const setLoadedImageMeta = (loadedImage, loopIndex) => {
        const loadedPhotosClone = loadedPhotos;
		loadedPhotos.filter((loadedPhoto, index) => {
            if (loopIndex === index && typeof loadedPhotos[index].meta.width === "undefined") {
                loadedPhotosClone[index].meta['width'] = loadedImage.width;
                loadedPhotosClone[index].meta['height'] = loadedImage.height;
                setLoadedPhotos(loadedPhotosClone);
            }
        });
    }

    // Step 1: Click on file input when clicking on Use Camera button
    useEffect(() => {
        if (fileUpload) {
            fileInput.current.click();
        } else {
            triggerFileUpload(false);
        }
    }, [fileUpload]);

    // callback to toggle/make Use Camera useable again
    useEffect(() => {
        triggerFileUpload(false);
    }, [loadedPhotos]);

    // TODO this is not staying eg. ugly flash
    useEffect(() => {
        props.setBodyClass("tagging-tracker__body increase-height");
    }, []);

    return (
        <>
            <div className="tagging-tracker__add-tag move-bottom-navbar-down">
                <input type="file" ref={fileInput} name="image" onChange={ () => { cameraCallback(fileInput.current) } } id="add-tag-file-input" />
                { renderPhotoPreviews() }
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
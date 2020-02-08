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

    const cameraCallback = (fileInput) => {
		if (fileInput.files.length) {
			previewPhoto(fileInput);
		} else {
            alert('No image selected');
        }
    }
    
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

    const renderFileInput = () => {
        return (
            <input type="file" ref={fileInput} name="image" onChange={ () => { cameraCallback(fileInput.current) } } id="add-tag-file-input" />
        )
    }

    const renderPhotoPreviews = () => {
        return loadedPhotos.map((loadedPhoto, index) => {
            return (
                <div style={{
                    backgroundImage: 'url(' + loadedPhoto.src + ')'
                }} key={index} className={ "tagging-tracker__address-tag " + getImagePreviewAspectRatioClass(loadedPhotos[index]) } >
                    <img src={loadedPhoto.src} onLoad={ (e) => setLoadedImageMeta(e.target, index) } />
                </div>
            )
        })
    }

    const getResizedImageHeight = (imageWidth, imageHeight, smallerWidth) => {
        return Math.ceil(((imageHeight * smallerWidth) / imageWidth));
      
    }
    
    // the meta's collected in different stages, the file itself(previewPhoto) has the name, size
    // the image that loads has the width/height
    const setLoadedImageMeta = (loadedImage, loopIndex) => {
        const loadedPhotosClone = loadedPhotos;
		loadedPhotos.filter((loadedPhoto, index) => {
            if (loopIndex === index && typeof loadedPhotos[index].meta.width === "undefined") {
                // I think this is bad, pretty much removing original state entirely/removing
                // with new but achieves purpose of getting the rest of meta info
                loadedPhotosClone[index].meta['width'] = loadedImage.width;
                loadedPhotosClone[index].meta['height'] = loadedImage.height;

                // this is not working, callback doesn't fire probably image disappears before it can
                // do callback
                // // genrate thumbnail
                // if (loadedImage.width > 150) {
                //     // create canvas for resizing
                //     // https://stackoverflow.com/questions/17583984/possible-to-resize-an-image-client-side-on-an-html-form-before-upload
                //     const img = new Image();
                //     img.onLoad = () => {
                //         img.src = loadedImage.src;
                //         const canvas = document.createELement('canvas');
                //         const ctx = canvas.getContext('2d');
                //         canvas.width = 150;
                //         canvas.height = getResizedImageHeight(img.width, img.height, 150);
                //         ctx.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);
                //         loadedPhoto.thumbnail_src = canvas.toDataURL();
                //         setLoadedPhotos(loadedPhotosClone);
                //     };
                // } else {
                    setLoadedPhotos(loadedPhotosClone);
                // }
            }
        });
    };

    useEffect(() => {
        if (fileUpload) {
            fileInput.current.click();
        } else {
            triggerFileUpload(false);
        }
    }, [fileUpload]);

    useEffect(() => {
        triggerFileUpload(false);
    }, [loadedPhotos]);

    const saveToDevice = () => {
        setSavingToDevice(true);

        const offlineStorage = props.offlineStorage;
        const address = props.location.state;     

        // not going to add duplicate logic here because you can delete them somewhere else
        loadedPhotos.forEach((loadedPhoto, index) => {
            offlineStorage.transaction('rw', offlineStorage.tags, async() => {
                if (
                    await offlineStorage.tags.add({
                        addressId: address.addressId,
                        src: loadedPhoto.src,
                        thumbnail_src: "",
                        meta: loadedPhoto.meta
                    }).then((insertedId) => {
                        return true;
                    })
                ) {
                    if (index === loadedPhotos.length - 1) {
                        alert('Photos saved');
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
    
    useEffect(() => {
        if (!savingToDevice) {
            setLoadedPhotos([]);
        }
    }, [savingToDevice]);

    // TODO this is not staying ugly flash
    useEffect(() => {
        props.setBodyClass("tagging-tracker__body increase-height");
    }, []);

    return (
        <>
            <div className="tagging-tracker__add-tag move-bottom-navbar-down">
                { renderFileInput() }
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
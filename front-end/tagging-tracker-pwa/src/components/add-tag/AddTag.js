import React, { useRef, useState, useEffect, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import './AddTag.scss';
import BottomNavbar from './../../components/bottom-navbar/BottomNavbar';
import { getImagePreviewAspectRatioClass } from './../../utils/image';

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

    
    
    // the meta's collected in different stages, the file itself(previewPhoto) has the name, size
    // the image that loads has the width/height
    const setLoadedImageMeta = (loadedImage, loopIndex) => {
        const loadedPhotosClone = loadedPhotos;
		loadedPhotos.filter((loadedPhoto, index) => {
            if (loopIndex === index) {
                // I think this is bad, pretty much removing original state entirely/removing
                // with new but achieves purpose of getting the rest of meta info
                loadedPhotosClone[index].meta['width'] = loadedImage.width;
                loadedPhotosClone[index].meta['height'] = loadedImage.height;
                setLoadedPhotos(loadedPhotosClone);
            }
        });
    };

    useEffect(() => {
        console.log('render at');
    });

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
                        address_id: address.addressId,
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

    return (
        <>
            <div className="tagging-tracker__add-tag">
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
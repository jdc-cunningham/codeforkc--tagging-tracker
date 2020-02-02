import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './ViewAddress.scss';

const ViewAddress = (props) => {
    const history = useHistory();
    const [localImages, setLocalImages] = useState(null);
    const [loadedPhoto, setLoadedPhoto] = useState({ src: "", meta: {} });
    const fileInput = useRef(null);
    const photoPreview = useRef(null);
    
    if (typeof props.location.state === "undefined") {
        history.push("/addresses");
    }

    const renderTags = () => {
        console.log(props);
        const db = props.offlineStorage;
        console.log(props);

        if (db && !localImages) {
            db.open().then(function (db) {
                db.tags.toArray().then((tags) => {
                    !tags.length
                        ? setLocalImages([])
                        :  db.tags
                        .where("addressId").equals(props.location.state.addressId)
                        .toArray().then((tags) => {
                            setLocalImages(tags);
                        });
                });
            }).catch (function (err) {
                // handle this failure correctly
                alert('failed to open local storage');
            });
        }
        
        if (Array.isArray(localImages)) {
            return localImages.map((image, index) => {
                return <div key={ index } style={{
                    backgroundImage: `url(${image.src})`
                }} alt="address thumbnail" className="address__tag-image" />
            });
        }
    }

    const cameraCallback = (fileInput) => {
		if (fileInput.files.length) {
			previewPhoto(fileInput);
		} else {
            alert('No image selected');
		}
    }
    
    const previewPhoto = (fileInput) => {
        const reader = new FileReader();

        reader.onload = function (e) {
			photoPreview.current.src = e.target.result;
        }

        reader.readAsDataURL(fileInput.files[0]);
	}

    const renderFileInput = () => {
        return (
            <input type="file" ref={fileInput} name="image" onChange={ () => { cameraCallback(fileInput.current) } } id="test-camera" />
        )
    }

    const renderPhotoPreviews = () => {
        return (
            <div className={ loadedPhoto.src ? "tagging-tracker__view-address-tag" : "tagging-tracker__view-address-tag hidden"}>
                <img className={ getImagePreviewAspectRatioClass() } ref={ photoPreview } onLoad={ () => setLoadedImageMeta(photoPreview.current) } />
            </div>
        )
    }

    const getImagePreviewAspectRatioClass = () => {
		const imageMetaSet = Object.keys(loadedPhoto.meta).length;

		if (imageMetaSet) {
			const imageMeta = loadedPhoto.meta;
			return !(imageMeta.width >= imageMeta.height) // flipped
				? "App__image-preview landscape"
				: "App__image-preview portrait";	
		} else {
			return "App__image-preview";
		}
    }
    
    const setLoadedImageMeta = (loadedImage) => {
		setLoadedPhoto({ 
			src: loadedImage.src,
			meta: {
				width: loadedImage.width,
				height: loadedImage.height
			} = loadedImage }); // lol destructure works
	};

    return(
        <div className="tagging-tracker__view-address">
            { renderTags() }
            { renderFileInput() }
            { renderPhotoPreviews() }
        </div>
    )
}

export default ViewAddress;
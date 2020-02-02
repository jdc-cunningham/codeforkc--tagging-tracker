import React, { useRef, useState, useEffect } from 'react';
import './AddTag.scss';
import BottomNavbar from './../../components/bottom-navbar/BottomNavbar';

const AddTag = (props) => {
    const [loadedPhoto, setLoadedPhoto] = useState({ src: "", meta: {} });
    const fileInput = useRef(null);
    const photoPreview = useRef(null);
	const [fileUpload, triggerFileUpload] = useState(false);
    const [loadedPhotos, setLoadedPhotos] = useState([]);

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
            setLoadedPhotos(loadedPhotos.concat(e.target.result));
        }

        reader.readAsDataURL(fileInput.files[0]);
	}

    const renderFileInput = () => {
        return (
            <input type="file" ref={fileInput} name="image" onChange={ () => { cameraCallback(fileInput.current) } } id="add-tag-file-input" />
        )
    }

    const renderPhotoPreviews = () => {
        console.log(loadedPhotos);
        return loadedPhotos.map((photoSrc, index) => {
            return (
                <div style={{
                    backgroundImage: 'url(' + photoSrc + ')'
                }} key={index} className={ getImagePreviewAspectRatioClass() } ref={ photoPreview } >
                    <img src={photoSrc} onLoad={ () => setLoadedImageMeta(photoPreview.current) } />
                </div>
            )
        })
    }

    const getImagePreviewAspectRatioClass = () => {
		const imageMetaSet = Object.keys(loadedPhoto.meta).length;

		if (imageMetaSet) {
			const imageMeta = loadedPhoto.meta;
			return !(imageMeta.width >= imageMeta.height) // flipped
				? "tagging-tracker__address-tag landscape"
				: "taggign-tracker__address-tag portrait";	
		} else {
			return "tagging-tracker__address-tag";
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

    useEffect(() => {
        console.log('render at');
    });

    useEffect(() => {
        console.log('prop change');
        if (fileUpload) {
            fileInput.current.click();
        } else {
            triggerFileUpload(false);
        }
    }, [fileUpload]);

    useEffect(() => {
        triggerFileUpload(false);
    }, [loadedPhotos]);
    
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
            />
        </>
    );
}

export default AddTag;
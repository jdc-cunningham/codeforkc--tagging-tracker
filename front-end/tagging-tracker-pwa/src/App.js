import React, { useRef, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
import Dexie from 'dexie';

const App = () => {
	const [camera, setCamera] = useState({ enabled: false }); // not sure if needed
	const [loadedPhoto, setLoadedPhoto] = useState({ src: "", meta: {} });
	const [savedPhotos, setSavedPhotos] = useState([]);
	const [offlineStorage, setOfflineStorage] = useState(null);
	// const 

	const fileInput = useRef(null);
	const photoPreview = useRef(null);

	const openCamera = () => {
		fileInput.current.click();
	}

	// https://stackoverflow.com/questions/18457340/how-to-preview-selected-image-in-input-type-file-in-popup-using-jquery
	const previewPhoto = (fileInput) => {
		const reader = new FileReader();

        reader.onload = function (e) {
			// file size fileInput.files[0].size
			photoPreview.current.src = e.target.result;
        }

        reader.readAsDataURL(fileInput.files[0]);
	}

	// this code will load the image in the background to get meta eg. size, width, height
	// then the promise is resolved/returned for saving process of photo, skipping for now for mvp test
	// this is for getting image dimensions
	// const getImageMeta = new Promise(fileInput) => {
	// 	const reader = new FileReader();

    //     reader.onload = function (e) {
	// 		// file size fileInput.files[0].size
	// 		photoPreview.current.src = e.target.result;
	// 		setPhoto({ src: e.target.result });
    //     }

    //     reader.readAsDataURL(fileInput.files[0])
	// }

	



	const cameraCallback = (fileInput) => {
		if (fileInput.files.length) {
			previewPhoto(fileInput);
		} else {

		}
	}

	// pulls image from local storage dexie
	const loadImage = () => {

	}

	// const getImageMeta = (file) => {
	// 	const reader = new FileReader();

    //     reader.onload = function (e) {
	// 		console.log(e);
	// 		return {
	// 			width: e.
	// 		}
    //     }

	// 	reader.readAsDataURL(file);
	// };

	const saveImage = async () => {
		const file = fileInput.current.files[0];
		const fileName = file.name.split(/(\\|\/)/g).pop();

		offlineStorage.transaction('rw', offlineStorage.images, async() => {
			if (await offlineStorage.images.add({
				name: fileName,
				fileSize: file.size, // KB
				width: loadedPhoto.meta.width,
				height: loadedPhoto.meta.height,
				src: loadedPhoto.src
			})) {
				alert('Image saved');
				setSavedPhotos(savedPhotos.push(fileName));
			}
		})
		.catch(e => {
			alert('Failed to save image to device');
			console.log(e);
		});
	}

	const setupOfflineStorage = () => { // width height come from preview
		console.log('create db');
		const db = new Dexie("LocalImageDatabase");
		db.version(1).stores({ images: "++id,name,fileSize,width,height" }); // can add additional meta
		db.open().then(function (db) {
			// Database opened successfully
			db.images.toArray().then((images) => {
				setSavedPhotos(images);
			});
		}).catch (function (err) {
			// handle this failure correctly
			alert('failed to open local storage');
		});
		setOfflineStorage(db);
	};

	// check local storage eg. dexie on first run
	useEffect(() => {
		setupOfflineStorage();
	}, []);

	// const getOfflineStoragePhotos = async () => {
	// 	const deviceStoredImages = await offlineStorage.images.toArray();
	// 	return deviceStoredImages;
	// };

	// // when db set
	useEffect(() => {
	// 	console.log('os', offlineStorage);
	// 	console.log(getOfflineStoragePhotos());
	// 	// savedPhotos
	
	// pull an image from storage

	console.log(savedPhotos.length);

	}, [offlineStorage]); // listen to this change

	const setLoadedImageMeta = (loadedImage) => {
		setLoadedPhoto({ 
			src: loadedImage.src,
			meta: {
				width: loadedImage.width,
				height: loadedImage.height
			} = loadedImage }); // lol destructure works
	};

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

	const getSourceFromStorage = () => {
		console.log(savedPhotos);
		return savedPhotos.length ? savedPhotos[1].src : "";
	}

	return (
		<div className="App">
			<div className={ loadedPhoto.src ? "App__image-preview-wrapper" : "App__image-preview-wrapper hidden"}>
				<img className={ getImagePreviewAspectRatioClass() } ref={ photoPreview } onLoad={ () => setLoadedImageMeta(photoPreview.current) } />
			</div>
			<input type="file" ref={ fileInput } onChange={ () => { cameraCallback(fileInput.current) } } id="test-camera" />
			<button type="button" onClick={ openCamera }>Take Picture</button>
			<button type="button" className={ loadedPhoto.src ? "App__image-save" : "App__image-save hidden" } onClick={ savedPhotos.length ? loadImage : saveImage }>{
				savedPhotos.length ? "Load image" : "Save Image To Device"
			}</button>
			<img class={ savedPhotos.length ? "App__loaded-string-img" : "App__loaded-string-img hidden"} src={ getSourceFromStorage() } />
		</div>
	);
}

export default App;

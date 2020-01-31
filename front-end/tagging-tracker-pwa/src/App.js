import React, { useRef, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
import Dexie from 'dexie';
import axios from 'axios';

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

	// [REF App1]
	const previewPhoto = (fileInput) => {
		const reader = new FileReader();

        reader.onload = function (e) {
			// file size fileInput.files[0].size
			photoPreview.current.src = e.target.result;
        }

        reader.readAsDataURL(fileInput.files[0]);
	}

	const cameraCallback = (fileInput) => {
		if (fileInput.files.length) {
			previewPhoto(fileInput);
		} else {

		}
	}

	// pulls image from local storage dexie
	const loadImage = () => {

	}

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

	// lol these work wow
	const deviceOffline = () => {
		alert('offline');
	}

	const deviceOnline = () => {
		// need to ping some remote ip to confirm not just connected to AP
		alert('online');
	}

	// check local storage eg. dexie on first run
	useEffect(() => {
		// bind online/offline listeners
		window.addEventListener('online', deviceOnline);
		window.addEventListener('offline', deviceOffline);
		setupOfflineStorage();
	}, []);

	// // when db set
	// useEffect(() => {

	// console.log(savedPhotos.length);

	// }, [offlineStorage]); // listen to this change

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
		return savedPhotos.length ? savedPhotos[0].src : ""; // designed for just 1 for now
	}

	const uploadImage = () => {
		const postUrl = 'http://localhost:5000/upload-tag';
		const formData = new FormData();
		formData.append("image", fileInput.current.files[0]);
		axios.post(postUrl, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log('err', err);
		});
	}

	return (
		<div className="App">
			<div className={ loadedPhoto.src ? "App__image-preview-wrapper" : "App__image-preview-wrapper hidden"}>
				<img className={ getImagePreviewAspectRatioClass() } ref={ photoPreview } onLoad={ () => setLoadedImageMeta(photoPreview.current) } />
			</div>
			<input type="file" name="image" ref={ fileInput } onChange={ () => { cameraCallback(fileInput.current) } } id="test-camera" />
			<button type="button" onClick={ openCamera }>Take Picture</button>
			<button type="button" className={ loadedPhoto.src ? "App__image-save" : "App__image-save hidden" } onClick={ savedPhotos.length ? loadImage : saveImage }>{
				savedPhotos.length ? "Load image" : "Save Image To Device"
			}</button>
			<img className={ savedPhotos.length ? "App__loaded-string-img" : "App__loaded-string-img hidden"} src={ getSourceFromStorage() } />
			<button type="button" onClick={ uploadImage }>Upload Image</button>
		</div>
	);
}

export default App;

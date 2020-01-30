import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.scss';

const App = () => {
	const [camera, setCamera] = useState({ enabled: false }); // not sure if needed
	const [photo, setPhoto] = useState({ src: "" });

	const fileInput = useRef(null);
	const photoPreview = useRef(null);

	const getMedia = async (constraints) => {
		let stream = null;
		try {
		  stream = await navigator.mediaDevices.getUserMedia(constraints);
		  /* use the stream */
		} catch(err) {
			alert('Failed to get camera');
		}
	  }

	const openCamera = () => {
		fileInput.current.click();
	}

	// https://stackoverflow.com/questions/18457340/how-to-preview-selected-image-in-input-type-file-in-popup-using-jquery
	const previewPhoto = (fileInput) => {
		const reader = new FileReader();

        reader.onload = function (e) {
			photoPreview.current.src = e.target.result;
			setPhoto({ src: e.target.result });
        }

        reader.readAsDataURL(fileInput.files[0]);
	}

	const cameraCallback = (fileInput) => {
		if (fileInput.files.length) {
			previewPhoto(fileInput);
		} else {

		}
	}

	return (
		<div className="App">
			<div className={ photo.src ? "App__image-preview-wrapper" : "App__image-preview-wrapper hidden"}>
				<img className="App__image-preview" ref={ photoPreview } />
			</div>
			<input type="file" ref={ fileInput } onChange={ () => { cameraCallback(fileInput.current) } } id="test-camera" />
			<button type="button" onClick={ openCamera }>Take Picture</button>
		</div>
	);
}

export default App;

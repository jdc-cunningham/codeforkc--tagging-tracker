import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Dexie from 'dexie';
// import axios from 'axios';

import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Addresses from './components/addresses/Addresses';
import ViewAddress from './components/view-address/ViewAddress';
import ManageAddress from './components/manage-address/ManageAddress';
import ManageTags from './components/manage-tags/ManageTags';
import BottomNavbar from './components/bottom-navbar/BottomNavbar';
import Page404 from './pages/page404/Page404';


const App = () => {
	const [token, setToken] = useState("");
	const [searchedAddress, updateSearchedAddress] = useState("");
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [appOnline, setAppOnline] = useState(true);
	const [offlineStorage, setOfflineStorage] = useState(null);

	const searchAddress = (searchStr) => {
		updateSearchedAddress(searchStr);
	}

	const toggleAddressModal = (show) => {
		setShowAddressModal(show);
	}

	const clearSearchedAddress = () => {
		updateSearchedAddress("");
	}

	const updateToken = (token) => {
		setToken(token);
	}

	const updateAppOnlineState = (event) => {
		const online = event.type === "online";
		if (appOnline !== online) {
			console.log('update online state', !appOnline);
			setAppOnline(!appOnline);
		}
	}

	const checkOnlineStatus = () => {
		window.addEventListener('online', updateAppOnlineState);
		window.addEventListener('offline', updateAppOnlineState);
		return () => {
			window.removeEventListener('online', updateAppOnlineState);
			window.removeEventListener('offline', updateAppOnlineState);
		};
	}

	const setupOfflineStorage = () => {
		const db = new Dexie("LocalImageDatabase");
		db.version(1).stores({ images: "++id,name,fileSize,width,height" });
		setOfflineStorage(db);
	};

	useEffect(() => {
		checkOnlineStatus();

		if (!offlineStorage) {
			setupOfflineStorage();
		}
	}, []);

	return (
		<div className="tagging-tracker">
			<Router>
				<Route component={ (props) =>
					<Navbar {...props}
						searchAddress={searchAddress}
						searchedAddress={searchedAddress}
						toggleAddressModal={toggleAddressModal}
						checkOnlineStatus={checkOnlineStatus} /> } />
				<div className="tagging-tracker__body">
					<Switch>
						<Route exact path="/" component={ (props) =>
							token
							? <Redirect to="/addresses" />
							: <Login {...props} updateToken={updateToken} token={token} />
						} />
						<Route path="/addresses" component={ (props) =>
							true 
								? <Addresses {...props}
									searchedAddress={searchedAddress}
									showAddressModal={showAddressModal}
									toggleAddressModal={toggleAddressModal}
									clearSearchAddress={clearSearchedAddress}
									token={token} />
								: <Redirect to="/" /> } />
						<Route path={"/view-address"} component={ (props) =>
							true
								? <ViewAddress {...props}
									offlineStorage={offlineStorage} />
								: <Redirect to="/" /> } />
						<Route path="/manage-address">
							token
								? <ManageAddress />
								: <Redirect to="/" />
						</Route>
						<Route path="/manage-tags">
							token
								? <ManageTags />
								: <Redirect to="/" />
						</Route>
						<Route>
							<Page404 />
						</Route>
					</Switch>
				</div>
				<Route component={BottomNavbar} />
			</Router>
		</div>
	)
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Dexie from 'dexie';
// import axios from 'axios';

import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Addresses from './components/addresses/Addresses';
import ViewAddress from './components/view-address/ViewAddress';
import TagInfo from './components/tag-info/TagInfo';
import OwnerInfo from './components/owner-info/OwnerInfo';
import BottomNavbar from './components/bottom-navbar/BottomNavbar';
import Page404 from './pages/page404/Page404';
import AddTag from './components/add-tag/AddTag';
import DeleteTag from './components/delete-tag/DeleteTag';


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
		db.version(1).stores({
			addresses: "++id,address,lat,lng,created,updated",
			tags: "++id,address_id,src,thumbnail_src,meta"
		});
		setOfflineStorage(db);
	};

	useEffect(() => {
		checkOnlineStatus();

		if (!offlineStorage) {
			setupOfflineStorage();
		}
	});

	const getDateTime = () => {
		// from https://stackoverflow.com/questions/8083410/how-can-i-set-the-default-timezone-in-node-js
		process.env.TZ = "America/Chicago";
		let date_ob = new Date();
	
		// current date
		// adjust 0 before single digit date
		let date = ("0" + date_ob.getDate()).slice(-2);
	
		// current month
		let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	
		// current year
		let year = date_ob.getFullYear();
	
		// current hours
		let hours = date_ob.getHours();
	
		// current minutes
		let minutes = date_ob.getMinutes();
	
		// current seconds
		let seconds = date_ob.getSeconds();
	
		// prints date in YYYY-MM-DD format
		// console.log(year + "-" + month + "-" + date);
	
		// prints date & time in YYYY-MM-DD HH:MM:SS format
		return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
	}

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
						<Route
							exact
							path="/"
							component={ (props) =>
								token
									? <Redirect to="/addresses" />
									: <Login {...props} updateToken={updateToken} token={token} />
						} />
						<Route
							path="/addresses"
							component={ (props) =>
								true 
									? <Addresses {...props}
										searchedAddress={searchedAddress}
										showAddressModal={showAddressModal}
										toggleAddressModal={toggleAddressModal}
										clearSearchAddress={clearSearchedAddress}
										token={token}
										offlineStorage={offlineStorage}
										getDateTime={getDateTime} />
									: <Redirect to="/"/> } />
						<Route
							path={"/view-address"}
							component={ (props) =>
								true
								? <ViewAddress {...props}
									offlineStorage={offlineStorage} />
								: <Redirect to="/"/> } />
						<Route
							path="/owner-info"
							component={ (props) =>
								true
									? <OwnerInfo />
									: <Redirect to="/"/> }/>
						<Route
							path="/tag-info"
							component={ (props) =>
								true
									? <TagInfo />
									: <Redirect to="/"/> }/>
						<Route
							path="/add-tag"
							component={ (props) =>
								true
									? <AddTag />
									: <Redirect to="/"/> }/>
							}/>
						<Route
							path="/delete-tag"
							component={ (props) =>
								true
									? <DeleteTag />
									: <Redirect to="/"/> }/>
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

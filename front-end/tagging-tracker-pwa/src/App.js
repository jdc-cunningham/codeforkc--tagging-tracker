import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Dexie from 'dexie';
// import axios from 'axios';

// misc utils
import { getDateTime } from './utils/date';

// components and pages
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Addresses from './components/addresses/Addresses';
import ViewAddress from './components/view-address/ViewAddress';
import TagInfo from './components/tag-info/TagInfo';
import OwnerInfo from './components/owner-info/OwnerInfo';
import BottomNavbar from './components/bottom-navbar/BottomNavbar';
import Page404 from './pages/page404/Page404';
import AddTag from './components/add-tag/AddTag';
import DeleteTag from './components/edit-tags/EditTags';

const App = () => {
	const [token, setToken] = useState("");
	const [searchedAddress, updateSearchedAddress] = useState("");
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [appOnline, setAppOnline] = useState(true);
	const [offlineStorage, setOfflineStorage] = useState(null);
	const [modifyOwnerInfo, toggleModifyOwnerInfo] = useState(false);
	const [modifyTagInfo, toggleModifyTagInfo] = useState(false);
	const [bodyClass, setBodyClass] = useState("tagging-tracker__body"); // this will be removed when UI is updated, it's for AddTag BottomNavbar

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
			tags: "++,fileName,addressId,src,thumbnail_src,meta", // this seems bad to use a fileName for a primary key
			ownerInfo: "++,addressId,formData",
			tagInfo: "++,addressId,formData"
		});
		setOfflineStorage(db);
	};

	useEffect(() => {
		checkOnlineStatus();

		if (!offlineStorage) {
			setupOfflineStorage();
		}
	});

	return (
		<div className="tagging-tracker">
			<Router>
				<Route component={ (props) =>
					<Navbar {...props}
						searchAddress={searchAddress}
						searchedAddress={searchedAddress}
						toggleAddressModal={toggleAddressModal}
						checkOnlineStatus={checkOnlineStatus}
						toggleModifyOwnerInfo={toggleModifyOwnerInfo}
						modifyOwnerInfo={modifyOwnerInfo}
						modifyTagInfo={modifyTagInfo}
						toggleModifyTagInfo={toggleModifyTagInfo} /> } />
				<div className={ bodyClass }>
					<Switch>
						<Route
							exact
							path="/"
							component={ (props) =>
								false // token
									? <Redirect to="/addresses" />
									: <Login {...props} updateToken={updateToken} token={token} />
						} />
						<Route
							path="/addresses"
							component={ (props) =>
								true 
									? <Addresses {...props}
										searchedAddress={searchedAddress}
										setShowAddressModal={setShowAddressModal}
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
									? <OwnerInfo {...props}
										modifyOwnerInfo={modifyOwnerInfo}
										offlineStorage={offlineStorage} />
									: <Redirect to="/"/> }/>
						<Route
							path="/tag-info"
							component={ (props) =>
								true
									? <TagInfo {...props}
										modifyTagInfo={modifyTagInfo}
										offlineStorage={offlineStorage} />
									: <Redirect to="/"/> }/>
						<Route
							path="/add-tag"
							component={ (props) =>
								true
									? <AddTag
										{...props}
										offlineStorage={offlineStorage}
										setBodyClass={setBodyClass}
									/>
									: <Redirect to="/"/> }/>
							}/>
						<Route
							path="/edit-tags"
							component={ (props) =>
								true
									? <DeleteTag
										{...props}
										offlineStorage={offlineStorage} />
									: <Redirect to="/"/> }/>
						<Route>
							<Page404 />
						</Route>
					</Switch>
				</div>
				{/* The explanation here is the AddTag needs to keep its own state so it doesn't
					re-render while adding more images since the initial bridge between bottomNavbar
					and AddTag body was causing the entire app to re-render */}
				<Route component={ (props) =>
					(props.location.pathname !== "/" && props.location.pathname !== "/add-tag")
						? <BottomNavbar
							{...props}
						/>
						: null
					} />
			</Router>
		</div>
	)
}

export default App;

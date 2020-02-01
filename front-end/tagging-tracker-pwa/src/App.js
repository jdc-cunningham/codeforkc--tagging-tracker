import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
// import Dexie from 'dexie';
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

	return (
		<div className="tagging-tracker">
			<Router>
				<Route component={ (props) =>
					<Navbar {...props}
						searchAddress={searchAddress}
						searchedAddress={searchedAddress}
						toggleAddressModal={toggleAddressModal} /> } />
				<div className="tagging-tracker__body">
					<Switch>
						<Route exact path="/" component={ (props) =>
							<Login {...props} updateToken={updateToken} token={token} />
						} />
						<Route path="/addresses" component={ (props) =>
							false ? <Addresses {...props}
								searchedAddress={searchedAddress}
								showAddressModal={showAddressModal}
								toggleAddressModal={toggleAddressModal}
								clearSearchAddress={clearSearchedAddress}
								token={token} /> : <Redirect to="/" /> } />
						<Route path={"/view-address"} component={ (props) =>
							<ViewAddress {...props} /> } />
						<Route path="/manage-address">
							<ManageAddress />
						</Route>
						<Route path="/manage-tags">
							<ManageTags />
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

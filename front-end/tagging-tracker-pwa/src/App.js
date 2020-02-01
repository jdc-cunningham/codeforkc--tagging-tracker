import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
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


const App = () => {
	const [searchedAddress, updateSearchedAddress] = useState({ value: "" });
	const [showAddressModal, setShowAddressModal] = useState(false);

	const searchAddress = (searchStr) => {
		updateSearchedAddress({ value: searchStr });
	}

	const toggleAddressModal = (show) => {
		setShowAddressModal(show);
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
						<Route exact path="/">
							<Login />
						</Route>
						<Route path="/addresses" component={ (props) =>
							<Addresses {...props}
								searchedAddress={searchedAddress}
								showAddressModal={showAddressModal}
								toggleAddressModal={toggleAddressModal} />} />
						<Route path="/view-address">
							<ViewAddress />
						</Route>
						<Route path="/manage-address">
							<ManageAddress />
						</Route>
						<Route path="/manage-tags">
							<ManageTags />
						</Route>
					</Switch>
				</div>
				<Route component={BottomNavbar} />
			</Router>
		</div>
	)
}

export default App;

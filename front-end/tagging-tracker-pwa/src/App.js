import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
// import './App.scss';
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
	return (
		<div className="tagging-tracker">
			<Router>
				{/* <Route render={(props) => (
					<Navbar />
				)} /> */}
				<Route component={Navbar} />
				<Switch>
					<Route exact path="/">
						<Login />
					</Route>
					<Route path="/addresses">
						<Addresses />
					</Route>
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
				<BottomNavbar />
			</Router>
		</div>
	)
}

export default App;

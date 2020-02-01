import React, { useRef, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import './Navbar.scss';

import backArrow from './../../assets/icons/svgs/chevron-blue.svg'; // rotated by CSS

const Navbar = (props) => {
    const searchAddressInput = useRef(null);

    // let searchInputTimeout;

    const searchAddresses = (searchStr) => {
        // clearTimeout(searchInputTimeout);
        // searchInputTimeout = setTimeout(() => { // this timeout delays state set, meant to delay search not visual
        props.searchAddress(searchStr);
        // }, 80);
    }

    const renderNavbar = (routeLocation) => {
        switch(routeLocation.pathname) {
            case '/addresses':
                return <>
                    <div className="tagging-tracker__navbar-top addresses">
                        <button onClick={  () => {props.toggleAddressModal(true)}  } />
                        <h2>Addresses</h2>
                    </div>
                    <input type="text" value={props.searchedAddress} placeholder="search" ref={ searchAddressInput } onChange={ (e) => { searchAddresses(e.target.value)} }></input>
                </>;
            case '/view-address':
                return <>
                    <div className="tagging-tracker__navbar-top view-address">
                        <Link to={{ pathname: "/addresses", state: { clearSearch: true }}} className="view-address__back">
                            <img src={ backArrow } alt="back arrow" />
                            <h4>Addresses</h4>
                        </Link>
                    </div>
                </>;
            default:
                return "";
        }
    };

    // focus
    useEffect(() => {
        console.log('n', props);
        if (!props.showAddressModal && props.location.pathname === "/addresses") {
            searchAddressInput.current.focus();
        }
    });

    return(
        <div className="tagging-tracker__navbar">
            { renderNavbar(props.location) }
        </div>
    )
}

export default Navbar;
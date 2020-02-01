import React, { useRef, useEffect } from 'react';
import './Navbar.scss';

const Navbar = (props) => {
    const searchAddressInput = useRef(null);

    const addAddress = () => {

    }

    let searchInputTimeout;

    const searchAddresses = (searchStr) => {
        clearTimeout(searchInputTimeout);
        searchInputTimeout = setTimeout(() => {
            props.searchAddress(searchStr);
        }, 80);
    }

    const renderNavbar = (routeLocation) => {
        switch(routeLocation.pathname) {
            case '/addresses':
                return <>
                    <div className="tagging-tracker__navbar-top">
                        <button onClick={ addAddress } />
                        <h2>Addresses</h2>
                    </div>
                    <input type="text" value={props.searchedAddress.value} placeholder="search" ref={ searchAddressInput } onChange={ (e) => { searchAddresses(e.target.value)} }></input>
                </>;
            default:
                return "";
        }
    };

    // focus
    useEffect(() => {
        searchAddressInput.current.focus();
    }, []);

    return(
        <div className="tagging-tracker__navbar">
            { renderNavbar(props.location) }
        </div>
    )
}

export default Navbar;
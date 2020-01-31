import React, { useRef } from 'react';
import './Navbar.scss';

const Navbar = (props) => {
    const searchAddressInput = useRef(null);

    const addAddress = () => {

    }

    const renderNavbar = (routeLocation) => {
        switch(routeLocation.pathname) {
            case '/addresses':
                return <>
                    <div class="tagging-tracker__navbar-top">
                        <button onClick={ addAddress } />
                        <h2>Addresses</h2>
                    </div>
                    <input type="text" placeholder="search" ref={ searchAddressInput }></input>
                </>;
            default:
                return "";
        }
    };

    return(
        <div className="tagging-tracker__navbar">
            { renderNavbar(props.location) }
        </div>
    )
}

export default Navbar;
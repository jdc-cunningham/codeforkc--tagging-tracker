import React, { useRef } from 'react';
import './BottomNavbar.scss';

import sync from './../../assets/icons/svgs/upload.svg';
import logout from './../../assets/icons/svgs/switch.svg';

const BottomNavbar = (props) => {
    const syncBtn = useRef(null);
    const logoutBtn = useRef(null);

    const renderBottomNavbar = (routeLocation) => {
        switch(routeLocation.pathname) {
            case '/huh':
                return <>
                </>;
            default:
                return <>
                    <button ref={ syncBtn } className="bottom-navbar__btn half sync" type="button">
                        <img src={ sync } alt="sync button" />
                        <span>Sync</span>
                    </button>
                    <button ref={ logoutBtn } className="bottom-navbar__btn half sync" type="button">
                        <img src={ logout } alt="logout button" />
                        <span>Logout</span>
                    </button>
                </>;
        }
    }

    return(
        <div className="tagging-tracker__bottom-navbar">
            { renderBottomNavbar(props.location) }
        </div>
    )
}

export default BottomNavbar;
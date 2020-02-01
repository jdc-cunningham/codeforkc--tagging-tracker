import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './BottomNavbar.scss';

import sync from './../../assets/icons/svgs/upload.svg';
import logout from './../../assets/icons/svgs/switch.svg';
import property from './../../assets/icons/svgs/property.svg';
import textDocument from './../../assets/icons/svgs/text-document.svg';
import addSquare from './../../assets/icons/svgs/add-square.svg';

const BottomNavbar = (props) => {
    const syncBtn = useRef(null);
    const logoutBtn = useRef(null);

    const renderBottomNavbar = (routeLocation) => {
        const address = props;
        console.log(props);
        switch(routeLocation.pathname) {
            case '/huh':
                return <>
                </>;
            case "/addresses":
                return <>
                    <button ref={ syncBtn } className="bottom-navbar__btn half sync" type="button">
                        <img src={ sync } alt="sync button" />
                        <span>Sync</span>
                    </button>
                    <button ref={ logoutBtn } className="bottom-navbar__btn half" type="button">
                        <img src={ logout } alt="logout button" />
                        <span>Logout</span>
                    </button>
                </>
            case "/view-address":
                return <>
                    <Link
                        to={{ pathname: "/owner-info", state: {
                                address: address.address,
                                addressId: address.id // used for lookup
                        }}}
                        className="bottom-navbar__btn third">
                        <img src={ property } alt="home owner button" />
                        <span>Owner Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/tag-info", state: {
                                address: address.address,
                                addressId: address.id // used for lookup
                        }}}
                        className="bottom-navbar__btn third">
                        <img src={ textDocument } alt="tag info button" />
                        <span>Tag Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/add-tag", state: {
                            address: address.address,
                            addressId: address.id // used for lookup
                        }}}
                        className="bottom-navbar__btn third">
                        <img src={ addSquare } alt="add tag" />
                        <span>Add Tag</span>
                    </Link>
                </>
            case "/add-tags":
                return <>
                    <button ref={ syncBtn } className="bottom-navbar__btn third" type="button">
                        <img src={ property } alt="home owner button" />
                        <span>Owner Info</span>
                    </button>
                    <button ref={ logoutBtn } className="bottom-navbar__btn third" type="button">
                        <img src={ textDocument } alt="tag info button" />
                        <span>Tag Info</span>
                    </button>
                    <button ref={ syncBtn } className="bottom-navbar__btn third" type="button">
                        <img src={ addSquare } alt="add tag" />
                        <span>Add Tag</span>
                    </button>
                </>
            default:
                return null;
        }
    }

    return(
        <div className="tagging-tracker__bottom-navbar">
            { renderBottomNavbar(props.location) }
        </div>
    )
}

export default BottomNavbar;
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './BottomNavbar.scss';

import sync from './../../assets/icons/svgs/upload.svg';
import logoutIcon from './../../assets/icons/svgs/switch.svg';
import property from './../../assets/icons/svgs/property.svg';
import textDocument from './../../assets/icons/svgs/text-document.svg';
import addSquare from './../../assets/icons/svgs/add-square.svg';

const BottomNavbar = (props) => {
    const syncBtn = useRef(null);
    const logoutBtn = useRef(null);
    const cameraBtn = useRef(null);
    const uploadBtn = useRef(null);

    console.log(props);

    const logout = () => {
        window.location.href = "/"; // token is wiped out as it's set by state not in storage
    }

    const saveToDevice = () => {
        props.saveToDevice();
    }

    // propogates upward click intent to then be received by AddTag body
    const openCamera = () => {
        props.triggerFileUpload(true);
    }

    const renderBottomNavbar = (routeLocation) => {
        const address = props.location.state;

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
                    <button ref={ logoutBtn } onClick={ logout } className="bottom-navbar__btn half" type="button">
                        <img src={ logoutIcon } alt="logout button" />
                        <span>Logout</span>
                    </button>
                </>
            case "/view-address":
            case "/edit-tags":
                return <>
                    <Link
                        to={{ pathname: "/owner-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn third">
                        <img src={ property } alt="home owner button" />
                        <span>Owner Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/tag-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn third">
                        <img src={ textDocument } alt="tag info button" />
                        <span>Tag Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/add-tag", state: {
                            address: address.address,
                            addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn third">
                        <img src={ addSquare } alt="add tag" />
                        <span>Add Tag</span>
                    </Link>
                </>
            case "/add-tag":
                return <>
                    <button ref={ cameraBtn } onClick={ openCamera } className="bottom-navbar__btn quarter caps-blue border small-font" type="button">
                        <span>Use Camera</span>
                    </button>
                    <button ref={ uploadBtn } className="bottom-navbar__btn quarter caps-blue border small-font" type="button">
                        <span>Upload</span>
                    </button>
                    <button
                        onClick={ saveToDevice }
                        className="bottom-navbar__btn quarter caps-blue border small-font"
                        type="button"
                        disabled={ props.savingToDevice ? true : false }>
                        <span>Save To Device</span>
                    </button>
                    <Link
                        to={{ pathname: "/view-address", state: {
                            address: address.address,
                            addressId: address.id // used for lookup
                        }}}
                        className="bottom-navbar__btn quarter caps-blue small-font">
                        <span>Cancel</span>
                    </Link>
                </>
            case "/tag-info":
            case "/owner-info":
                const tagPath = props.location.pathname === "/tag-info";

                return <>
                    <Link
                        to={{ pathname: "/owner-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className={"bottom-navbar__btn toggled " + (!tagPath ? "active" : "") }>
                        <img src={ property } alt="home owner button" />
                        <span>Owner Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/tag-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className={"bottom-navbar__btn toggled " + (tagPath ? "active" : "") }>
                        <img src={ textDocument } alt="tag info button" />
                        <span>Tag Info</span>
                    </Link>
                </>
            default:
                return null;
        }
    }

    const getBottomNavbarClasses = () => {
        const floatingBtnPaths = [
            "/owner-info",
            "/tag-info"
        ];

        const floatingBtns = floatingBtnPaths.indexOf(props.location.pathname) !== -1;

        if (floatingBtns) {
            return "tagging-tracker__bottom-navbar floating-btns";
        }

        return "tagging-tracker__bottom-navbar";
    }

    return(
        <div className={ getBottomNavbarClasses() }>
            { renderBottomNavbar(props.location) }
        </div>
    )
}

export default BottomNavbar;
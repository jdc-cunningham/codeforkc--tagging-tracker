import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

import backArrow from './../../assets/icons/svgs/chevron-blue.svg'; // rotated by CSS

const Navbar = (props) => {
    const searchAddressInput = useRef(null);

    // let searchInputTimeout;
    console.log(props);

    const searchAddresses = (searchStr) => {
        // clearTimeout(searchInputTimeout);
        // searchInputTimeout = setTimeout(() => { // this timeout delays state set, meant to delay search not visual
        props.searchAddress(searchStr);
        // }, 80);
    }

    const getNavTitle = (path, address) => {
        let navTitle = "";

        if (path === "/tag-info") {
            navTitle = "Tag Information";
        } else if (path === "/owner-info") {
            navTitle = "Owner Information";
        } else {
            navTitle = address;
        }

        return navTitle;
    }

    const getBackButtonTitle = (path, address) => {
        if (path === "/tag-info" || path === "owner-info") {
            let addressOutput = address.substring(0, 10);

            if (address.length > 10) {
                addressOutput += "...";
            }

            return addressOutput;
        } else {
            return "Addresses";
        }
    }

    const getBackPathname = (path) => {
        if (path === "/tag-info" || path === "owner-info") {
            return "/view-address";
        } else {
            return "/addresses"
        }
    }

    const editSaveOwnerInfo = () => {
        props.toggleModifyOwnerInfo(!props.modifyOwnerInfo);
    }

    const editTagInfo = () => {
        props.toggleModifyTagInfo(!props.modifyTagInfo);
    }

    const generateEditBtn = () => {
        const pathname = props.location.pathname;
        const isEditTagsPath = pathname.indexOf('edit') !== -1;

        if (pathname === "/owner-info") {
            return (
                <button
                    type="button"
                    className="manage-address__edit-cancel"
                    onClick={ editSaveOwnerInfo }
                >{ props.modifyOwnerInfo ? "SAVE" : "EDIT" }</button> // TODO: this should flex between save/edit/cancel if changes occurred
            );
        } 
        else if (pathname === "/tag-info") {
            return (
                <button
                    type="button"
                    className="manage-address__edit-cancel"
                    onClick={ editTagInfo }
                >{ props.modifyTagInfo ? "SAVE" : "EDIT" }</button> // TODO: this should flex between save/edit/cancel if changes occurred
            );
        } else {
            return (
                <Link to={{ pathname: isEditTagsPath ? "view-address" : "/edit-tags", state: { 
                    address: props.location.state.address,
                    addressId: props.location.state.addressId
                }}} className="manage-address__edit-cancel">{ isEditTagsPath ? "Cancel" : "Edit" }</Link>
            );
        }
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
            case '/edit-tags':
            case '/add-tag':
            case '/tag-info':
            case '/owner-info':
                return <>
                    <div className="tagging-tracker__navbar-top view-address edit-tags add-tags">
                        <Link to={{ pathname: getBackPathname(routeLocation.pathname), state: { clearSearch: true }}} className="manage-address__back">
                            <img src={ backArrow } alt="back arrow" />
                        <h4>{ getBackButtonTitle(routeLocation.pathname, props.location.state.address) }</h4>
                        </Link>
                        <h2 className="manage-address__name">
                            { getNavTitle(routeLocation.pathname, props.location.state.address) }
                        </h2>
                        { generateEditBtn() }
                    </div>
                </>;
            default:
                return "";
        }
    };

    // focus
    useEffect(() => {
        console.log('render nav', props.modifyOwnerInfo);
        if (!props.showAddressModal && props.location.pathname === "/addresses") {
            searchAddressInput.current.focus();
        }

        // update online/offline status
        props.checkOnlineStatus();
    });

    return(
        <div className="tagging-tracker__navbar">
            { renderNavbar(props.location) }
        </div>
    )
}

export default Navbar;
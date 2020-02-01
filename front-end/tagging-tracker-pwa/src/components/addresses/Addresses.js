import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Addresses.scss';
import rightArrow from './../../assets/icons/svgs/chevron.svg';
import axios from 'axios';

const Addresses = (props) => {
    const newAddressInput = useRef(null);
    const cancelAddAddressBtn = useRef(null);
    const createAddressBtn = useRef(null);
    const [addAddressProcessing, setAddAddressProcessing] = useState(false);
    const [recentAddresses, setRecentAddresses] = useState(null);

    const searchAddresses = (searchStr) => {
        return null;

        // return (
        //     <Link to={{ pathname: "/view-address", state: {
        //             address: "2113 Prospect Ave",
        //             addressId: 1 // used for lookup
        //         }}} className="tagging-tracker__address">
        //         <h4>2113 Propsect Ave</h4>
        //         <img src={ rightArrow } alt="right arrow" />
        //     </Link>
        // )

        // if (!addresses) {
        //     return (
        //         <div className="tagging-tracker__body-no-results">No Matching Addresses Found</div>
        //     )
        // }

        // addresses.map(() => {

        // })
    }

    const saveAddress = () => {
        const addressStr = newAddressInput.current.value;
        if (!addressStr) {
            alert('Please enter an address');
            return;
        }

        setAddAddressProcessing(true);

        axios.post('/add-address', {
            address: addressStr
        })
        .then((res) => {
            if (res.status === 201) {
                console.log('create', res);
            } else {
                setAddAddressProcessing(false);
            }
        })
        .catch((err) => {
            alert('failed to save address'); // 401 goes through here too
            setAddAddressProcessing(false);
        });
    }

    const renderRecentAddresses = () => {
        if (recentAddresses) {
            return (recentAddresses.map((address, index) => {
                return <Link
                    key={index}
                    to={{ pathname: "/view-address", state: {
                            address: address.address,
                            addressId: address.id // used for lookup
                    }}}
                    className="tagging-tracker__address">
                        <h4>{ address.address }</h4>
                        <img src={ rightArrow } alt="right arrow" />
                </Link>}));
        }
    }

    const loadRecentAddresses = () => {
        // returns last 10 addresses used by updated date sorted descending
        if (!recentAddresses) {
            axios.get('/get-recent-addresses')
                .then((res) => {
                    if (res.status === 200) {
                        setRecentAddresses(res.data);
                    } else {
                        alert('Failed to load recent addresses');
                    }
                })
                .catch((err) => {
                    alert('failed to load recent addresses'); // 401 goes through here too
                });
        }
    }

    const addNewAddressModal = (showModal) => {
        return showModal ? (
            <div className="tagging-tracker__address-input-modal">
                <h3>Create New Address</h3>
                <p>Please enter a new address that you want to create</p>
                <input type="text" ref={ newAddressInput } />
                <div className="tagging-tracker__address-input-modal-btns">
                    <button type="button" ref={ cancelAddAddressBtn } onClick={ () => {props.toggleAddressModal(false)} } >CANCEL</button>
                    <button type="button" ref={ createAddressBtn } onClick={ saveAddress } disabled={ addAddressProcessing ? true : false }>CREATE</button>
                </div>
            </div>
        ) : null;
    }

    // focus
    useEffect(() => {
        if (!Array.isArray(recentAddresses)) {
            loadRecentAddresses();
        }

        if (props.showAddressModal) {
            newAddressInput.current.focus();
        }

        // this detects when route changed from a single address back to addresses and clears the search input
        // there are no hard routes eg. using Link so the parent state does not change
        if (typeof props.location.state !== "undefined" &&
            typeof props.location.state.clearSearch !== "undefined") {
            delete props.location.state.clearSearch; // lol without this non-ending loop
            props.clearSearchAddress();
        }
    });

    useEffect(() => {
        setAddAddressProcessing(false);
    }, [addAddressProcessing]);

    return(
        <div className="tagging-tracker__addresses">
            { renderRecentAddresses(recentAddresses) }
            { searchAddresses(props.searchedAddres) }
            { addNewAddressModal(props.showAddressModal) }
        </div>
    )
}

export default Addresses;
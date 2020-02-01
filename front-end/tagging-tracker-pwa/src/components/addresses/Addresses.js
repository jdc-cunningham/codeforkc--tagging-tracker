import React, { useRef, useEffect } from 'react';
import './Addresses.scss';
import rightArrow from './../../assets/icons/svgs/chevron.svg';

const Addresses = (props) => {
    const newAddressInput = useRef(null);
    const cancelAddAddressBtn = useRef(null);
    const createAddressBtn = useRef(null);

    const searchAddresses = (searchStr) => {
        return (
            <div className="tagging-tracker__address">
                <h4>2113 Propsect Ave</h4>
                <img src={ rightArrow } alt="right arrow" />
            </div>
        )

        // if (!addresses) {
        //     return (
        //         <div className="tagging-tracker__body-no-results">No Matching Addresses Found</div>
        //     )
        // }

        // addresses.map(() => {

        // })
    }

    const addNewAddressModal = (showModal) => {
        return showModal ? (
            <div className="tagging-tracker__address-input-modal">
                <h3>Create New Address</h3>
                <p>Please enter a new address that you want to create</p>
                <input type="text" ref={ newAddressInput } />
                <div className="tagging-tracker__address-input-modal-btns">
                    <button type="button" ref={ cancelAddAddressBtn } onClick={ () => {props.toggleAddressModal(false)} } >CANCEL</button>
                    <button type="button" ref={ createAddressBtn } >CREATE</button>
                </div>
            </div>
        ) : null;
    }

    // focus
    useEffect(() => {
        if (props.showAddressModal) {
            newAddressInput.current.focus();
        }
    }, []);

    return(
        <div className="tagging-tracker__addresses">
            { searchAddresses(props.searchAddres) }
            { addNewAddressModal(props.showAddressModal) }
        </div>
    )
}

export default Addresses;
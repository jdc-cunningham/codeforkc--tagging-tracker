import React from 'react';
import './Addresses.scss';
import rightArrow from './../../assets/icons/svgs/chevron.svg';

const Addresses = (props) => {
    const searchAddresses = (searchStr) => {
        return (
            <div className="tagging-tracker__address">
                <h2>2113 Propsect Ave</h2>
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

    return(
        <div className="tagging-tracker__addresses">
            { searchAddresses(props.searchAddres) }
        </div>
    )
}

export default Addresses;
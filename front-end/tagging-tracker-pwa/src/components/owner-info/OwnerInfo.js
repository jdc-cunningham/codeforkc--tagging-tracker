import React from 'react';
import './OwnerInfo.scss';

const OwnerInfo = (props) => {
    // TODO: this will need to be reworked the striping in particular, it's just coincidence
    // it works regarding the sub-group variant
    const formLabels = [
        "Name",
        "Phone",
        "Email",
        "Tenant Name",
        "Tenant Contact Number",
        "Waiver Completed",
        "Need To Follow Up",
        {
            "Building Survey": [
                "Would you continue service if you had to pay for it?"
            ]
        }
    ];

    const renderOwnerInfoFormFields = () => {
        return formLabels.map((formField, index) => {
            const isString = typeof formField === "string";
            return (isString
                ? <div key={index} className="owner-info-form__row">
                        <span>{ formField }:</span>
                        <input type="text" readOnly={ props.modifyOwnerInfo ? false : true } />
                    </div>
                : <div className="owner-info-form__row group" key={index}>
                    <div className="owner-info-form__row white">
                        <span>{ Object.keys(formField) }:</span>
                    </div>
                    {
                        Object.keys(formField).map((subGroup, subGroupIndex) => {
                            console.log(subGroup);
                            return (
                                <div key={subGroupIndex} className="owner-info-form__sub-row">
                                    <span>{ formField[subGroup] }</span>
                                    <input type="text" className="full" readOnly={ props.modifyOwnerInfo ? false : true } />
                                </div>
                            );
                        })
                    }
                </div>
            );
        });
    }

    return(
        <div className="tagging-tracker__owner-info">
            <div className="tagging-tracker__owner-info-form">
                { renderOwnerInfoFormFields() }
            </div>
        </div>
    )
}

export default OwnerInfo;
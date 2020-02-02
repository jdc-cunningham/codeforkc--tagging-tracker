import React, { createRef, useState, useRef, useEffect } from 'react';
import './OwnerInfo.scss';

const OwnerInfo = (props) => {
    const [ownerInfo, setOwnerInfo] = useState(null);
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

    // from Dexie structure
    const fieldKeys = [
        "name",
        "phone",
        "email",
        "tenantName",
        "tenantPhoneNumber",
        "waiverCompleted",
        "needFollowUp",
        "buildingSurveyQuestionAnswer"
    ];

    const inputElements = useRef(formLabels.map(() => createRef()));
    let updateDone = true; // bad

    const updateInfo = (inputValue) => {
        // these match Dexie store
        const offlineStorage = props.offlineStorage;
        const ownerInfoValues = {
            addressId: props.location.state.addressId
        };

        if (inputValue) {
            inputElements.current.forEach((input, index) => {
                // this is terrible should have been part of way the content is generated so it's set in the input names
                ownerInfoValues[fieldKeys[index]] = input.current.value;
            });
        }

        if (updateDone) {
            updateDone = false;
        
            offlineStorage.transaction('rw', offlineStorage.ownerInfo, async() => {
                let newRowId;
    
                if (
                    await offlineStorage.ownerInfo.put({
                        address_id: ownerInfoValues.addressId,
                        name: ownerInfoValues.name,
                        phone: ownerInfoValues.phone,
                        email: ownerInfoValues.email,
                        tenantName: ownerInfoValues.tenantName,
                        tenantPhoneNumber: ownerInfoValues.tenantPhoneNumber,
                        waiverCompleted: ownerInfoValues.waiverCompleted,
                        needFollowUp: ownerInfoValues.needFollowUp,
                        buildingSurveyQuestionAnswer: ownerInfoValues.buildingSurveyQuestionAnswer
                    }, ownerInfoValues.addressId).then((insertedId) => {
                        newRowId = insertedId;
                        return true;
                    })
                ) {
                    updateDone = true;
                    setOwnerInfo(ownerInfoValues);
                } else {
                    alert('Failed to update owner information 1');
                }
            })
            .catch(e => {
                alert('Failed to update owner information', e);
            });
        }
    }

    const getOwnerInfo = async () => {
        const addressId = 1; // props.location.addressId;
        const offlineStorage = props.offlineStorage;

        if (addressId && offlineStorage) {
            console.log(offlineStorage);
            await offlineStorage.ownerInfo.get(addressId, (ownerInfo) => {
                setOwnerInfo(ownerInfo);
            }).catch (function (err) {
                // handle this failure correctly
                alert('failed to open local storage');
                console.log(err);
            });
        }
    }

    const renderOwnerInfoFormFields = () => {
        return formLabels.map((formField, index) => {
            const isString = typeof formField === "string";
            return (isString
                ? <div key={index} className="owner-info-form__row">
                        <span>{ formField }:</span>
                        <input defaultValue={ ownerInfo ? ownerInfo[fieldKeys[index]] : "" } onBlur={ (e) => updateInfo(e.target.value) } ref={inputElements.current[index]} type="text" readOnly={ props.modifyOwnerInfo ? false : true } />
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
                                    <input defaultValue={ ownerInfo ? ownerInfo[fieldKeys[index]] : "" } id="target-me" onChange={ updateInfo } ref={inputElements.current[index]} type="text" className="full" readOnly={ props.modifyOwnerInfo ? false : true } />
                                </div>
                            );
                        })
                    }
                </div>
            );
        });
    }

    useEffect(() => {
        getOwnerInfo();
    }, []);

    // TODO: fix the communication between navbar save and saving here so saving isn't based on onblur
    // eg. get all fields at once one time, not every time you change inputs
    // useEffect(() => {
    //     console.log(document.getElementById('target-me').value);
    // }, [props.modifyOwnerInfo]);

    return(
        <div className="tagging-tracker__owner-info">
            <div className="tagging-tracker__owner-info-form">
                { renderOwnerInfoFormFields() }
            </div>
        </div>
    )
}

export default OwnerInfo;
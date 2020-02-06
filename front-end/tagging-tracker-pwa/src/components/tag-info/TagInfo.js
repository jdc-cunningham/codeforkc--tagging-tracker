import React, { createRef, useState, useRef } from 'react';
import './TagInfo.scss';

import { getDateTime } from './../../utils/date';
import { tagInfoFields } from './../../utils/tagFields';

// TODO: there is this functionality of "Others: type here" but that will take some work to make a dynamic input field

const TagInfo = (props) => {
    const [tagInfo, setTagInfo] = useState(null);
    const tagInfoFieldKeys = {
        "Date of picture:": "", // TODO - change to type date
        "Date of abatement:": "", // TODO - change to type date, picker is extra but format guarding would be good
        "Number of tags:": "",
        "Tag text:": "",
        "Small tag text:": "",
        "Square footage covered:": "",
        "Racial or hate tone?": "",
        "Gang related": "",
        "Crossed out tag": "",
        "Vacant property": "",
        "Land bank property": "",
        "Surface:": "",
        "Need other code enforcement?": ""
    }

    // this is really bad, just a result of poor planning and brain dead
            //             needOtherCodeEnforcement:
    const nameValueMap = {
        "option-0": "dateOfPicture",
        "option-1": "dateOfAbatement",
        "option-2": "numberOfTags",
        "option-3": "tagText",
        "option-4": "smallTagText",
        "option-5": "squareFootageCovered",
        "option-6-0": "racialOrHateTone",
        "option-6-1": "racialOrHateTone",
        "option-6-2": "racialOrHateTone",
        "option-7-0": "gangRelated",
        "option-7-1": "gangRelated",
        "option-7-2": "gangRelated",
        "option-8-0": "crossedOutTag",
        "option-8-1": "crossedOutTag",
        "option-8-2": "crossedOutTag",
        "option-9-0": "vacantProperty",
        "option-9-1": "vacantProperty",
        "option-9-2": "vacantProperty",
        "option-10-0": "landBankProperty",
        "option-10-1": "landBankProperty",
        "option-10-2": "landBankProperty",
        "option-11-0": "surface",
        "option-11-1": "surface",
        "option-11-2": "surface",
        "option-11-3": "surface",
        "option-11-4": "surface",
        "option-11-5": "surface",
        "option-12-0": "needOtherCodeEnforcement",
        "option-12-1": "needOtherCodeEnforcement",
        "option-12-2": "needOtherCodeEnforcement",
        "option-12-3": "needOtherCodeEnforcement",
        "option-12-4": "needOtherCodeEnforcement",
        "option-12-5": "needOtherCodeEnforcement"
    };

    // damn this is brutal but it works
    const tagInfoInputElements = useRef(Object.keys(tagInfoFieldKeys).map(
        // these are manually mapped based on tagFields.js not great, mainly for the nested inputs eg. radio/checkbox
        (fieldKey) => {
            const fieldType = tagInfoFields[fieldKey].type;
            if (fieldType === "input" || fieldType === "number") {
                return createRef();
            } else {
                const subFields = tagInfoFields[fieldKey].options;

                return {subRefs: 
                    Object.keys(subFields).map((subFieldKey) => {
                        return createRef();
                    })
                };
            }
        }
    ));
    let updateDone = true; // bad

    const updateTagInfo = () => {
        const mappedFieldValues = {}

        tagInfoInputElements.current.map((element) => {
            if (typeof element.subRefs !== "undefined" && Array.isArray(element.subRefs)) {
                element.subRefs.map((subElement) => {
                    mappedFieldValues[subElement.current.name] = subElement.current.checked;
                });
            } else {
                mappedFieldValues[element.current.name] = element.current.checked;
            }
        });

        // console.log(mappedFieldValues);

        // group the mapped fields, this is kind of band I'll admit hindsight
        const groupedTagInputFields = Object.keys(mappedFieldValues).forEach((inputPair) => {
            // console.log('>>>', inputPair);
            
        });

        if (updateDone) {
            updateDone = false;
        
            // offlineStorage.transaction('rw', offlineStorage.tagInfo, async() => {
            //     let newRowId;
    
            //     if (
            //         await offlineStorage.ownerInfo.put({
            //             address_id: ownerInfoValues.addressId,
            //             dateOfPicture: ,
            //             dateOfAbatement: ,
            //             numberOfTags: ,
            //             tagText: ,
            //             smallTagText: ,
            //             squareFootageCovered: ,
            //             racialOrHateTone: ,
            //             gangRelated: ,
            //             crossedOutTag: ,
            //             vacantProperty: ,
            //             landBankProperty: ,
            //             surface: ,
            //             needOtherCodeEnforcement:
            //         }, ownerInfoValues.addressId).then((insertedId) => {
            //             newRowId = insertedId;
            //             return true;
            //         })
            //     ) {
            //         updateDone = true;
            //         setOwnerInfo(ownerInfoValues);
            //     } else {
            //         alert('Failed to update owner information 1');
            //     }
            // })
            // .catch(e => {
            //     alert('Failed to update owner information', e);
            // });
        }
    }

    const generateInputType = (fieldGroup, mainIndex, field) => {
        const fieldType = fieldGroup.type;

        if (fieldType === "input") {
            nameValueMap[`option-${mainIndex}`] = null;
            return (
                <input name={ `option-${mainIndex}`} onBlur={ updateTagInfo } ref={tagInfoInputElements.current[mainIndex]} className="grow" type="text" disabled={ props.modifyTagInfo ? false : true } />
            )
        } else if (fieldType === "number") {
            nameValueMap[`option-${mainIndex}`] = null;
            return (
                <input name={ `option-${mainIndex}`} placeholder="0" onBlur={ updateTagInfo } ref={tagInfoInputElements.current[mainIndex]} className="grow" type="number" min="0" disabled={ props.modifyTagInfo ? false : true } />
            )
        } else if (fieldType === "radio" || fieldType === "checkbox") {
            const optionKeys = Object.keys(fieldGroup.options);

            if (optionKeys.length) {
                // TODO: redundant code here
                if (fieldType === "checkbox") {
                    return (
                        <div className="padding-left">
                            {
                                optionKeys.map((optionKey, index) => {
                                    nameValueMap[`option-${mainIndex}-${index}`] = null;
                                    return (
                                        <span key={index} className="option-group">
                                            <input onChange={ updateTagInfo } ref={tagInfoInputElements.current[mainIndex].subRefs[index]} id={`option-${mainIndex}-${index}`}
                                                name={ `option-${mainIndex}-${index}`} type={ fieldType } disabled={ props.modifyTagInfo ? false : true } />
                                            <label htmlFor={`option-${mainIndex}-${index}`}>{ fieldGroup.options[optionKey] }</label>
                                        </span>
                                    )
                                })
                            }
                        </div>
                    )
                } else {
                    return optionKeys.map((optionKey, index) => {
                        nameValueMap[`option-${mainIndex}-${index}`] = null;
                        return (
                            <span key={index} className="option-group">
                                <input onChange={ updateTagInfo } id={`option-${mainIndex}-${index}`} name={ `option-${mainIndex}-${index}`}
                                    ref={tagInfoInputElements.current[mainIndex].subRefs[index]}type={ fieldType } disabled={ props.modifyTagInfo ? false : true } />
                                <label htmlFor={`option-${mainIndex}-${index}`}>{ fieldGroup.options[optionKey] }</label>
                            </span>
                        )
                    });
                }
            }
        } else {
            return "[unknown field type]";
        }
    }

    const getSpanClass = (fieldType) => {
        if (fieldType === "radio") {
            return "option-group-label";
        } 
        if (fieldType === "checkbox") {
            return "full";
        } else {
            return "input-label";
        }
    }

    const renderTagInfo = () => {
        return Object.keys(tagInfoFields).map((field, index) => {
            return (
                // bad
                <div key={index} className={"tag-info-field-row" + (tagInfoFields[field].type === "checkbox" ? " checkbox" : " box") }>
                    <span className={ getSpanClass(tagInfoFields[field].type) }>{ field }</span>
                    { generateInputType(tagInfoFields[field], index, field) }
                </div>
            )
        });
    };

    // useEffect(() => {
    //     getTagInfo();
    // }, []);

    return(
        <div className="tagging-tracker__tag-info">
            { renderTagInfo() }
        </div>
    )
}

export default TagInfo;
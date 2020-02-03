import React from 'react';
import './TagInfo.scss';

import { getDateTime } from './../../utils/date';
import { tagInfoFields } from './../../utils/tagFields';

const TagInfo = () => {


    const generateInputType = (fieldGroup, mainIndex) => {
        const fieldType = fieldGroup.type;

        if (fieldType === "input") {
            return (
                <input className="grow" type="text" />
            )
        } else if (fieldType === "number") {
            return (
                <input className="grow" type="number" min="0" />
            )
        } else if (fieldType === "radio" || fieldType === "checkbox") {
            const optionKeys = Object.keys(fieldGroup.options);

            if (optionKeys.length) {
                // redundant code here
                if (fieldType === "checkbox") {
                    return (
                        <div className="padding-left">
                            {
                                optionKeys.map((optionKey, index) => {
                                    return (
                                        <span className="option-group">
                                            <input id={`option-${mainIndex}-${index}`} name={ `option-${mainIndex}`} type={ fieldType } />
                                            <label for={`option-${mainIndex}-${index}`}>{ fieldGroup.options[optionKey] }</label>
                                        </span>
                                    )
                                })
                            }
                        </div>
                    )
                } else {
                    return optionKeys.map((optionKey, index) => {
                        return (
                            <span className="option-group">
                                <input id={`option-${mainIndex}-${index}`} name={ `option-${mainIndex}`} type={ fieldType } />
                                <label for={`option-${mainIndex}-${index}`}>{ fieldGroup.options[optionKey] }</label>
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
            console.log(field);
            return (
                // bad
                <div className={"tag-info-field-row" + (tagInfoFields[field].type === "checkbox" ? " checkbox" : " box") }>
                    <span className={ getSpanClass(tagInfoFields[field].type) }>{ field }</span>
                    { generateInputType(tagInfoFields[field], index) }
                </div>
            )
        });
    };

    return(
        <div className="tagging-tracker__tag-info">
            { renderTagInfo() }
        </div>
    )
}

export default TagInfo;
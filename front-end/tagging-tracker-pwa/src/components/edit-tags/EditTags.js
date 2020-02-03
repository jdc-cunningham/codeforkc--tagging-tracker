import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './EditTags.scss';
import { getImagePreviewAspectRatioClass } from './../../utils/image';
import closeIcon from './../../assets/icons/svgs/close.svg';

const EditTags = (props) => {
    const offlineStorage = props.offlineStorage;

    const history = useHistory();
    const [localImages, setLocalImages] = useState(null);
    const [deleteTagId, setDeleteTagId] = useState(null);
    const [deletePrompt, toggleDeletePrompt] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    
    if (typeof props.location.state === "undefined") {
        history.push("/addresses");
    }

    const deleteImage = (tagId) => {    
        offlineStorage.transaction('rw', offlineStorage.tags, async() => {
            if (
                await offlineStorage.tags.delete(tagId)
                .then((thing) => {
                    return true;
                })
            ) {
                offlineStorage.tags
                    .where("address_id").equals(props.location.state.addressId)
                    .toArray().then((tags) => {
                        setLocalImages(tags);
                    });
            } else {
                alert('Failed to delete tag');
            }
        })
        .catch(e => {
            alert('Failed to delete tag', e);
        });
    }

    const showDeletePrompt = () => {

    }

    const renderDeletePrompt = (tagId) => {
        return (
            <div className={"tagging-tracker__edit-tags-delete-prompt" + (deletePrompt ? "" : " hidden")}>
                <h4>Delete Tag {tagId}</h4>
                <p>This will delete all information and photos of the tag</p>
                <div className="edit-tags-delete-prompt__delete-btns">
                    <button className="delete-btns__delete" type="button">Delete</button>
                    <button className="delete-btns__cancel" type="button">Cancel</button>
                </div>
            </div>
        )
    }

    const renderTags = () => {
        if (offlineStorage && !localImages) {
            offlineStorage.open().then(function (offlineStorage) {
                offlineStorage.tags.toArray().then((tags) => {
                    !tags.length
                        ? setLocalImages([])
                        :  offlineStorage.tags
                        .where("address_id").equals(props.location.state.addressId)
                        .toArray().then((tags) => {
                            setLocalImages(tags);
                        });
                });
            }).catch (function (err) {
                // handle this failure correctly
                alert('failed to open local storage');
            });
        }
        
        if (Array.isArray(localImages)) {
            return localImages.map((image, index) => {
                console.log(image);
                return <div key={ index }
                    style={{
                        backgroundImage: `url(${image.src})`
                    }} alt="address thumbnail"
                    onClick={ () => { showDeletePrompt(image.address_id) } }
                    className={ "address__tag-image delete " + getImagePreviewAspectRatioClass(localImages[index]) }>
                    <div style={{ backgroundImage: `url(${closeIcon})` }} className="tagging-tracker__edit-tags-close-btn"></div>
                </div>
            });
        }
    }
    
    // TODO this code is almost an exact copy of ViewAddress may have flexed states
    // I used same class to steal styling
    return(
        <div className="tagging-tracker__edit-tags tagging-tracker__view-address">
            { renderTags() }
            { renderDeletePrompt() }
        </div>
    )
}

export default EditTags;
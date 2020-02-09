import { syncUp } from './syncUp';
import { syncDown } from './syncDown';

const isLocalStorageEmpty = async (props) => {
    const localStorage = props.offlineStorage;

    if (!localStorage) {
        return;
    }

    // you should only have to check addresses because every other table is tied to an address
    // so an address has to exist before you can add photos/owner/tag info
    return new Promise(resolve => {
        localStorage.addresses.count().then((count) => {
            if (count > 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
        .catch((err) => {
            console.log('sync addresses err', err);
            resolve(true); // technically could be an error not empty
        });
    });
}

export const syncUserData = async (props) => {
    const localStorageEmpty = await isLocalStorageEmpty(props);

    if (localStorageEmpty) {
        // pull down
        const bundledData = await syncDown(props);
        if (bundledData) {
            updateLocalStorageFromSync(props, bundledData);
            return true;
        } else {
            return({msg: 'No data to sync'});
        }
    } else {
        // push up
        console.log('sync up');
        return await syncUp(props);
    }
}

const updateLocalAddresses = (props, remoteData) => {
    const offlineStorage = props.offlineStorage;
    return new Promise(resolve => {
        remoteData.addresses.forEach((addressRow, index) => {
            offlineStorage.transaction('rw', offlineStorage.addresses, () => {
                if (
                    offlineStorage.addresses.add({
                        address: addressRow.address,
                        lat: addressRow.lat,
                        lng: addressRow.lng,
                        created: addressRow.created,
                        updated: addressRow.updated
                    }).then((insertedId) => {
                        return true;
                    })
                ) {
                    if (index === remoteData.addresses.length - 1) {
                        resolve(true);
                    }
                } else {
                    resolve(false);
                }
            })
            .catch(e => {
                resolve(false);
            });
        });
    });
}

const updateLocalTags = (props, remoteData) => {
    const offlineStorage = props.offlineStorage;
    return new Promise(resolve => {
        remoteData.tags.forEach((tagRow, index) => {
            offlineStorage.transaction('rw', offlineStorage.tags, () => {
                const tagMeta = JSON.parse(tagRow.meta);
                if (
                    offlineStorage.tags.add({
                        addressId: tagRow.address_id,
                        fileName: tagMeta.name,
                        src: tagRow.src,
                        thumbnail_src: tagRow.thumbnail_src,
                        meta: tagMeta
                    }).then((insertedId) => {
                        return true;
                    })
                ) {
                    if (index === remoteData.tags.length - 1) {
                        resolve(true);
                    }
                } else {
                    resolve(false);
                }
            })
            .catch(e => {
                resolve(false);
            });
        });
    });
}

const updateLocalOwnerInfo = (props, remoteData) => {
    const offlineStorage = props.offlineStorage;
    return new Promise(resolve => {
        remoteData.tagInfo.forEach((tagInfoRow, index) => {
            offlineStorage.transaction('rw', offlineStorage.tagInfo, () => {
                if (
                    offlineStorage.tagInfo.add({
                        addressId: tagInfoRow.address_id,
                        formData: JSON.parse(tagInfoRow.form_data)
                    }).then((insertedId) => {
                        return true;
                    })
                ) {
                    if (index === remoteData.tagInfo.length - 1) {
                        resolve(true);
                    }
                } else {
                    resolve(false);
                }
            })
            .catch(e => {
                resolve(false);
            });
        });
    });
}

const updateLocalTagInfo = (props, remoteData) => {
    const offlineStorage = props.offlineStorage;
    return new Promise(resolve => {
        remoteData.ownerInfo.forEach((ownerInfoRow, index) => {
            offlineStorage.transaction('rw', offlineStorage.ownerInfo, () => {
                if (
                    offlineStorage.ownerInfo.add({
                        addressId: ownerInfoRow.address_id,
                        formData: JSON.parse(ownerInfoRow.form_data)
                    }).then((insertedId) => {
                        return true;
                    })
                ) {
                    if (index === remoteData.ownerInfo.length - 1) {
                        resolve(true);
                    }
                } else {
                    resolve(false);
                }
            })
            .catch(e => {
                resolve(false);
            });
        });
    });
}

export const updateLocalStorageFromSync = async (props, remoteData) => {
    let updateErr = false;
    updateErr = await updateLocalAddresses(props, remoteData);
    updateErr = await updateLocalTags(props, remoteData);
    updateErr = await updateLocalOwnerInfo(props, remoteData);
    updateErr = await updateLocalTagInfo(props, remoteData);

    if (updateErr) {
        return true;
    } else {
        return false;
    }
}
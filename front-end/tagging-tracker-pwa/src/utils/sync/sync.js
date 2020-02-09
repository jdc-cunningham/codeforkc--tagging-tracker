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
    console.log('sync ran');
    const localStorageEmpty = await isLocalStorageEmpty(props);
    console.log('empty', localStorageEmpty);

    if (localStorageEmpty) {
        // pull down
        const bundledData = await syncDown(props);
        console.log('remote', bundledData);
    } else {
        // push up
        syncUp(props);
    }
}
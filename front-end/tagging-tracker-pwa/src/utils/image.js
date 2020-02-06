// TODO: investigate issue with state and image meta not getting set
export const getImagePreviewAspectRatioClass = (loadedPhoto) => {
    const imageMetaSet = Object.keys(loadedPhoto.meta).length;

    console.log(loadedPhoto.meta);
    console.log(imageMetaSet);
    console.log(loadedPhoto.meta.width);
    console.log(typeof loadedPhoto.meta.width !== "undefined");

    if (imageMetaSet && typeof loadedPhoto.meta.width !== "undefined") {
        const imageMeta = loadedPhoto.meta;
        console.log(imageMeta.height);
        return (imageMeta.width >= imageMeta.height) // flipped
            ? "landscape"
            : "portrait";	
    } else {
        console.log('else ran');
        return "";
    }
}
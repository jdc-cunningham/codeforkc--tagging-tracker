// skipping this for now, using CSS contain to fit image, does the same thing
// TODO: investigate issue with state and image meta not getting set
export const getImagePreviewAspectRatioClass = (loadedPhoto) => {
    const imageMetaSet = Object.keys(loadedPhoto.meta).length;

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
export const getImagePreviewAspectRatioClass = (loadedPhoto) => {
    const imageMetaSet = Object.keys(loadedPhoto.meta).length;

    if (imageMetaSet) {
        const imageMeta = loadedPhoto.meta;
        return (imageMeta.width >= imageMeta.height) // flipped
            ? "landscape"
            : "portrait";	
    } else {
        return "";
    }
}
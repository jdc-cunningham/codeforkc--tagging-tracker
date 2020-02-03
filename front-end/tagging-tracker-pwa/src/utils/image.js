export const getImagePreviewAspectRatioClass = (loadedPhoto) => {
    // TODO: investigate issue with state and image meta not getting set
    return "";
    
    // const imageMetaSet = Object.keys(loadedPhoto.meta).length;

    // if (imageMetaSet && typeof loadedPhoto.meta.width !== "undefined") {
    //     const imageMeta = loadedPhoto.meta;
    //     return (imageMeta.width >= imageMeta.height) // flipped
    //         ? "landscape"
    //         : "portrait";	
    // } else {
    //     return "";
    // }
}
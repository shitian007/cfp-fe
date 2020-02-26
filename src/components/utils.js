export const urlInfo = (windowUrl) => {
    let paths = windowUrl.split("/");
    let id = paths.splice(-1).pop();
    let type = paths.splice(-1).pop();
    return [type, id]
}
function decode(dataURI) {
  if (!/data:image\//.test(dataURI)) {
    console.log('ImageDataURI :: Error :: It seems that it is not an Image Data URI. Couldn\'t match "data:image/"');
    return null;
  }

  const regExMatches = dataURI.match("data:(image/.*);base64,(.*)");
  if (!regExMatches) {
    console.log('ImageDataURI :: Error :: It seems that it is not an Image Data URI. Couldn\'t match "data:image/.*;base64,"');
    return null;
  }

  return {
    imageType: regExMatches[1],
    dataBase64: regExMatches[2],
    dataBuffer: new Buffer(regExMatches[2], "base64"),
  };
}

function encode(data, mediaType) {
  if (!data || !mediaType) {
    console.log("ImageDataURI :: Error :: Missing some of the required params: data, mediaType ");
    return null;
  }

  mediaType = /\//.test(mediaType) ? mediaType : "image/" + mediaType;
  const dataBase64 = Buffer.isBuffer(data) ? data.toString("base64") : new Buffer(data).toString("base64");
  const dataImgBase64 = "data:" + mediaType + ";base64," + dataBase64;

  return dataImgBase64;
}

module.exports = {
  decode: decode,
  encode: encode,
};

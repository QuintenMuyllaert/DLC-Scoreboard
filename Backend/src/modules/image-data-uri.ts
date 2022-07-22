//Patched version of https://github.com/DiegoZoracKy/image-data-uri/blob/master/lib/image-data-uri.js
// License: MIT

// Also been translated to .ts by Quinten Muyllaert

"use strict";
import fs from "fs";
import path from "path";
import mimeTypes from "mime-types";

export function decode(dataURI: string) {
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

export function encode(data: any, mediaType: string) {
	if (!data || !mediaType) {
		console.log("ImageDataURI :: Error :: Missing some of the required params: data, mediaType ");
		return null;
	}

	mediaType = /\//.test(mediaType) ? mediaType : "image/" + mediaType;
	const dataBase64 = Buffer.isBuffer(data) ? data.toString("base64") : new Buffer(data).toString("base64");
	const dataImgBase64 = "data:" + mediaType + ";base64," + dataBase64;

	return dataImgBase64;
}

export function encodeFromFile(filePath: string) {
	return new Promise((resolve, reject) => {
		if (!filePath) {
			reject("ImageDataURI :: Error :: Missing some of the required params: filePath");
			return null;
		}

		const mediaType = mimeTypes.lookup(filePath);
		if (!mediaType) {
			return reject("ImageDataURI :: Error :: Couldn't recognize media type for file");
		}

		fs.readFile(filePath, (err, data) => {
			if (err) {
				return reject("ImageDataURI :: Error :: " + JSON.stringify(err, null, 4));
			}

			return resolve(encode(data, mediaType));
		});
	});
}

export function outputFile(dataURI: string, filePath: string) {
	filePath = filePath || "./";
	return new Promise((resolve, reject) => {
		const imageDecoded = decode(dataURI);
		if (!imageDecoded) {
			reject("ImageDataURI :: Error :: Couldn't decode image");
			return null;
		}
		filePath = !!path.extname(filePath) ? filePath : filePath + "." + mimeTypes.extension(imageDecoded?.imageType);
		fs.writeFileSync(filePath, imageDecoded?.dataBuffer?.toString("base64"), "base64");
		resolve(filePath);
	});
}

export default {
	decode: decode,
	encode: encode,
	encodeFromFile: encodeFromFile,
	outputFile: outputFile,
};

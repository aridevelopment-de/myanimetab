import { useState } from "react";
import { IFolder, IImage, metaDb, ROOT_FOLDER } from "./db";

export const useImageSearch = () => {
	const [results, setResults] = useState<IImage[]>([]);

	const search = async (term: string) => {
		if (!term) {
			setResults([]);
			return;
		}

		const results = await getImagesRecursive(ROOT_FOLDER);

		const filteredResults = results.filter((image: IImage) => {
			return image.name.toLowerCase().includes(term.toLowerCase());
		});
		setResults(filteredResults);
	};

	return { results, search };
};

const getImagesRecursive = async (folder: IFolder) => {
	const rootSubFolders = await metaDb.getSubFolders(folder.id);
	const subImages = await metaDb.getImages(folder.id);

	let imageCollection: IImage[] = [];
	imageCollection = imageCollection.concat(subImages);

	if (rootSubFolders.length > 0) {
		for (let i = 0; i < rootSubFolders.length; i++) {
			const subFolderImages = await getImagesRecursive(rootSubFolders[i]);
			imageCollection = imageCollection.concat(subFolderImages);
		}
		return imageCollection;
	}

	return imageCollection;
};

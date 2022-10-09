import { useEffect, useState } from "react";
import { IFolder, IImage, metaDb, ROOT_FOLDER } from "./db";

export const useSearch = (term: string) => {
	const [results, setResults] = useState<IImage[]>([]);

	const search = async (term: string) => {
		if (term === "") return;

		const results = await getImagesRecur(ROOT_FOLDER);

		const filteredResults = results.filter((image: IImage) => {
			return (
				image.name !== undefined &&
				image.name.toLowerCase().includes(term)
			);
		});

		setResults(filteredResults);
	};

	useEffect(() => {
		search(term);
	}, [results]);

	return { results, search };
};

const getImagesRecur = async (folder: IFolder) => {
	const rootSubFolders = await metaDb.getSubFolders(folder.id);
	const subImages = await metaDb.getImages(folder.id);

	let imageCollection: IImage[] = [];
	imageCollection = imageCollection.concat(subImages);

	if (rootSubFolders.length > 0) {
		for (let i = 0; i < rootSubFolders.length; i++) {
			const subFolderImages = await getImagesRecur(rootSubFolders[i]);
			imageCollection = imageCollection.concat(subFolderImages);
		}
		return imageCollection;
	}

	return imageCollection;
};

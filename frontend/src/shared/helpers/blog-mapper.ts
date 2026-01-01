export type UploadedImage = {
  id?: string;
  url: string;
};

export const mapImageUrlToUploaded = (url: string): UploadedImage => ({
  url,
});

export const mapImageUrlsToUploaded = (urls: string[] = []): UploadedImage[] =>
  urls.map(mapImageUrlToUploaded);

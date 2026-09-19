const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogv'];

// site_images stores both photos and videos; the storage path keeps the
// original extension, so the URL is enough to tell them apart.
export const isVideoUrl = (url: string): boolean => {
  const path = url.split('?')[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => path.endsWith(ext));
};

export const isVideoFile = (file: File | null | undefined): boolean =>
  !!file && (file.type.startsWith('video/') || isVideoUrl(file.name));

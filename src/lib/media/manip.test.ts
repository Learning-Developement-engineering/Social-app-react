import { compressIfNeeded, getImageDim, saveImageToMediaLibrary, shareImageModal } from './manip';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as RNImage from 'react-native';

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve(undefined)),
}))

jest.mock('expo-media-library', () => ({
  getAlbumAsync: jest.fn(() => Promise.resolve(null)),
  createAssetAsync: jest.fn(() => Promise.resolve(true)),
  createAlbumAsync: jest.fn(() => Promise.resolve(true)),
}))

describe('Image Utils', () => {
  describe('getImageDim', () => {
    it('should return image dimensions', async () => {
      const path = 'mocked-path';
      jest.spyOn(RNImage.Image, 'getSize').mockImplementation((_, success) => {
        success(100, 200);
      });

      const dims = await getImageDim(path);
      expect(dims).toEqual({ width: 100, height: 200 });
    });
  });

  describe('compressIfNeeded', () => {
    it('should return the same image if size is below threshold', async () => {
      const img = { path: 'file://mock.jpg', width: 100, height: 100, size: 1024 };
      const result = await compressIfNeeded(img, 2048);
      expect(result).toEqual(img);
    });
  });
});

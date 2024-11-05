import { describe, it, expect } from 'vitest';
import generateHtmlPictureTag from '../src/helpers/html-handling'; // Update the path accordingly

describe('generateHtmlPictureTag', () => {
  it('should generate correct <picture> tag with multiple sources', () => {
    const imageFileName = 'image.jpg';
    const originalImgTag = '<img src="fallback.jpg" alt="Fallback Image">';
    const fileTypes = ['.webp', '.avif', '.jpg'];
    const sizes = [240, 480, 768];
    const relativeImgDir = 'images';

    const expectedOutput = `<picture>`
        + `<source type="image/webp" srcset="images/image.jpg-240.webp 240w,images/image.jpg-480.webp 480w,images/image.jpg-768.webp 768w">`
        + `<source type="image/avif" srcset="images/image.jpg-240.avif 240w,images/image.jpg-480.avif 480w,images/image.jpg-768.avif 768w">`
        + `<source type="image/jpg" srcset="images/image.jpg-240.jpg 240w,images/image.jpg-480.jpg 480w,images/image.jpg-768.jpg 768w">`
        + `${originalImgTag}`
      + `</picture>`
      .trim();

    const result = generateHtmlPictureTag(imageFileName, originalImgTag, fileTypes, sizes, relativeImgDir);
    expect(result).toBe(expectedOutput);
  });

  it('should handle an empty array of file types gracefully', () => {
    const imageFileName = 'image.jpg';
    const originalImgTag = '<img src="fallback.jpg" alt="Fallback Image">';
    const fileTypes: string[] = [];
    const sizes = [240, 480, 768];
    const relativeImgDir = 'images';

    const expectedOutput = `<picture>${originalImgTag}</picture>`.trim();

    const result = generateHtmlPictureTag(imageFileName, originalImgTag, fileTypes, sizes, relativeImgDir);
    expect(result).toBe(expectedOutput);
  });
});
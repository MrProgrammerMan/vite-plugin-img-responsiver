import fs from 'fs';
import path from 'path';
import { expect, it, vi } from 'vitest';
import processHtml from '../src/helpers/html-handling';
import hash from '../src/helpers/hash';

// Helper mock setup
vi.mock('../src/helpers/image-handling', () => ({
  capSizes: vi.fn().mockResolvedValue([240, 480, 768]),
}));

// Helper function to create a temporary HTML file
const createTestHtmlFile = (dir: string, fileName: string, content: string) => {
  const filePath = path.join(dir, fileName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
};

// Test case
it('processes HTML and replaces img tags with picture tags', async () => {
  // Step 1: Prepare the HTML input
  const htmlDir = './testHtml1489761945';
  const htmlFile = 'test.html';
  const imgTagRegex = /<img src="([^"]+)"[^>]*>/g; // Regex to match img tags in HTML
  const allHashes: string[] = [];
  const pathToHash = './' + path.join(htmlDir, 'images/test-image.jpg').replace(/\\/g, '/');
  allHashes.push(hash(pathToHash).toString());
  const imageDir = './images';
  const conversionSizes = [240, 480, 768];
  const outputFileTypes = ['.webp', '.avif', '.jpg'];

  // HTML content with an image tag
  const htmlContent = `
    <html>
      <head><title>Test Page</title></head>
      <body>
        <h1>Test</h1>
        <img src="./images/test-image.jpg" alt="Test Image">
      </body>
    </html>
  `;

  // Create the test HTML file
  const htmlFilePath = createTestHtmlFile(htmlDir, htmlFile, htmlContent);

  // Step 2: Process the HTML file
  await processHtml(
    htmlDir,
    htmlFile,
    imgTagRegex,
    allHashes,
    imageDir,
    conversionSizes,
    outputFileTypes
  );

  // Step 3: Verify that the image was replaced with the <picture> tag
  const processedHtml = fs.readFileSync(htmlFilePath, 'utf8');

  // Expected <picture> tag based on the generateHtmlPictureTag logic
  const expectedPictureTag = '<picture>' +
    '<source type="image/webp" srcset="./../images/212289413-240.webp 240w,./../images/212289413-480.webp 480w,./../images/212289413-768.webp 768w">' +
    '<source type="image/avif" srcset="./../images/212289413-240.avif 240w,./../images/212289413-480.avif 480w,./../images/212289413-768.avif 768w">' +
    '<source type="image/jpg" srcset="./../images/212289413-240.jpg 240w,./../images/212289413-480.jpg 480w,./../images/212289413-768.jpg 768w">' +
    '<img src="./images/test-image.jpg" alt="Test Image"></picture>';

  // Check that the HTML content contains the expected picture tag
  expect(processedHtml).toContain(expectedPictureTag);

  // Cleanup (optional)
  fs.rmSync(htmlDir, { recursive: true, force: true });
});

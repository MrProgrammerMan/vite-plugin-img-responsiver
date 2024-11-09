import { describe, it, expect, vi, beforeEach } from "vitest";
import processImages from "../src/helpers/image-handling";
import getFiles from "../src/helpers/getFiles";
import hash from "../src/helpers/hash";
import path from "path";

/**
 * This test file is used to test the `processImages` function.
 * It probably has pretty bad coverage, as well as bugs I don't know about.
 * The problem is that I don't actually know a lot about testing, specifically mocking.
 * So since I can't figure out how to mock the functions implemented in the same file as the one I'm testing,
 * i.e.: `capSizes` and `generateImageVariants`, I'm just going to test taht the `processImages` function calls
 * 'getFiles' and 'hash' with the correct arguments.
 * This is not a good test, but it's the best I can do right now.
 *
 * I wish all developers of Vitest a good day and a very die.
 *
 * - A very tired developer
 */

vi.mock("../src/helpers/getFiles", () => ({
  default: vi.fn().mockReturnValue(["image1.jpg", "image2.png"]),
}));

vi.mock("../src/helpers/hash", () => ({
  default: vi.fn().mockReturnValue("12345"),
}));

vi.mock("sharp", () => {
  return {
    default: vi.fn().mockReturnThis(),
    metadata: vi.fn().mockResolvedValue({
      width: 800,
      height: 600,
      format: "jpeg",
    }),
    resize: vi.fn().mockReturnThis(),
    toFile: vi.fn().mockResolvedValue({
      width: 100,
      height: 75,
      format: "jpeg",
    }),
  };
});

describe("processImages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process all images in a directory and return the hashed filepaths", async () => {
    const imageDir = "./images";
    const extensions = [".jpg", ".png"];
    const sizes = [100, 200];
    const outputFileTypes = [".avif", ".webp"];
    const outputDir = "./output";

    await processImages(
      imageDir,
      extensions,
      sizes,
      outputFileTypes,
      outputDir
    );

    expect(getFiles).toHaveBeenCalledWith(imageDir, extensions);
    expect(hash).toHaveBeenCalledWith(path.normalize(path.join(imageDir, "image1.jpg")));
    expect(hash).toHaveBeenCalledWith(path.normalize(path.join(imageDir, "image2.png")));
  });

  it("should return an array of unique hashes representing the filenames of all processed images", async () => {
    const imageDir = "./images";
    const extensions = [".jpg", ".png"];
    const sizes = [100, 200];
    const outputFileTypes = [".avif", ".webp"];
    const outputDir = "./output";

    const hashes = await processImages(
      imageDir,
      extensions,
      sizes,
      outputFileTypes,
      outputDir
    );

    expect(hashes).toEqual(["12345", "12345"]);
  });
});

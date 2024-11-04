import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { generateImageVariants } from "../src/helpers/image-handling";
import fs from "fs";
import sharp from "sharp";

// Mock `sharp` and `fs` for controlled testing
vi.mock("sharp");
vi.mock("fs");

const mockSharpInstance = {
  resize: vi.fn().mockReturnThis(),
  toFile: vi
    .fn()
    .mockResolvedValue({ width: 100, height: 100, format: "jpeg" }),
};

beforeEach(() => {
  vi.clearAllMocks();
  (sharp as unknown as Mock).mockReturnValue(mockSharpInstance);
});

describe("generateImageVariants", () => {
  it("should skip processing if the output file already exists", async () => {
    const inputPath = "input.jpg";
    const sizes = [100, 200];
    const extensions = [".jpg", ".png"];
    const outputFileName = "output";
    const outputDir = "./output";

    // Mock `fs.existsSync` to return `true`, indicating the file already exists
    vi.spyOn(fs, "existsSync").mockReturnValue(true);

    await generateImageVariants(
      inputPath,
      sizes,
      extensions,
      outputFileName,
      outputDir
    );

    // Since files exist, `sharp` should not be called at all
    expect(sharp).not.toHaveBeenCalled();
  });

  it("should process images if the output file does not exist", async () => {
    const inputPath = "input.jpg";
    const sizes = [100, 200];
    const extensions = [".jpg", ".png"];
    const outputFileName = "output";
    const outputDir = "./output";

    // Mock `fs.existsSync` to return `false`, indicating the file does not exist
    vi.spyOn(fs, "existsSync").mockReturnValue(false);

    await generateImageVariants(
      inputPath,
      sizes,
      extensions,
      outputFileName,
      outputDir
    );

    // Since files don't exist, `sharp` should be called for each size/extension combination
    expect(sharp).toHaveBeenCalledWith(inputPath);
    expect(mockSharpInstance.resize).toHaveBeenCalledTimes(
      sizes.length * extensions.length
    );
    expect(mockSharpInstance.toFile).toHaveBeenCalledTimes(
      sizes.length * extensions.length
    );

    // Verify `toFile` was called with the correct output paths
    sizes.forEach((size) => {
      extensions.forEach((extension) => {
        expect(mockSharpInstance.toFile).toHaveBeenCalledWith(
          `${outputDir}/${outputFileName}-${size}${extension}`
        );
      });
    });
  });

  it("should throw an error if image processing fails", async () => {
    const inputPath = "input.jpg";
    const sizes = [100];
    const extensions = [".jpg"];
    const outputFileName = "output";
    const outputDir = "./output";

    // Mock `fs.existsSync` to return `false`, so processing is attempted
    vi.spyOn(fs, "existsSync").mockReturnValue(false);

    // Simulate an error in `sharp.toFile`
    mockSharpInstance.toFile.mockRejectedValueOnce(
      new Error("Processing failed")
    );

    await expect(
      generateImageVariants(
        inputPath,
        sizes,
        extensions,
        outputFileName,
        outputDir
      )
    ).rejects.toThrow("Error generating image variants");
  });
});

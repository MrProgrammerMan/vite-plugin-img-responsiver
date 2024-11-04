import { describe, it, expect, vi } from "vitest";
import { capSizes } from "../src/helpers/image-handling"; // Update this with the actual path to your module
import sharp from "sharp";

vi.mock("sharp"); // Mock the sharp module

describe("capSizes", () => {
  it("should cap sizes to the maximum dimension of the image if any size exceeds it", async () => {
    const mockedMetadata = { width: 800, height: 600 };
    (sharp as any).mockReturnValue({
      metadata: vi.fn().mockResolvedValue(mockedMetadata),
    });

    const sizes = [300, 500, 1000];
    const cappedSizes = await capSizes(sizes, "path/to/image.jpg");

    // Max dimension is 800, so 1000 should be capped to 800 and added
    expect(cappedSizes).toEqual([300, 500, 800]);
  });

  it("should return sizes unmodified if they are all within image dimensions", async () => {
    const mockedMetadata = { width: 1200, height: 800 };
    (sharp as any).mockReturnValue({
      metadata: vi.fn().mockResolvedValue(mockedMetadata),
    });

    const sizes = [300, 500, 700];
    const cappedSizes = await capSizes(sizes, "path/to/image.jpg");

    // All sizes are within max dimension (1200), so no capping or additions
    expect(cappedSizes).toEqual([300, 500, 700]);
  });

  it("should cap all sizes above max dimension and add the max dimension only once", async () => {
    const mockedMetadata = { width: 900, height: 900 };
    (sharp as any).mockReturnValue({
      metadata: vi.fn().mockResolvedValue(mockedMetadata),
    });

    const sizes = [800, 1000, 1200];
    const cappedSizes = await capSizes(sizes, "path/to/image.jpg");

    // Max dimension is 900; 1000 and 1200 should be capped, max dimension added only once
    expect(cappedSizes).toEqual([800, 900]);
  });

  it("should handle an empty sizes array and return an empty array", async () => {
    const mockedMetadata = { width: 1000, height: 800 };
    (sharp as any).mockReturnValue({
      metadata: vi.fn().mockResolvedValue(mockedMetadata),
    });

    const sizes: number[] = [];
    const cappedSizes = await capSizes(sizes, "path/to/image.jpg");

    // Empty input array should return an empty output array
    expect(cappedSizes).toEqual([]);
  });
});

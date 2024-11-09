# img-responsiver

*NOTE*: This tool generates image files, folders and modifies markup files.
It creates and also deletes files.
Use it as intended and described.

`img-responsiver` is a Vite plugin that generates images at different sizes and file formats, replacing HTML `<img>` tags with `<picture>` tags for responsiveness. This ensures that your web application serves the most appropriate image for the user's device, improving load times and user experience.

The plugin utilizes the `configResolved` Vite hook (hence why this is not a Rollup plugin).

## Features

- Automatically generates responsive images in multiple sizes and formats.
- Replaces `<img>` tags with `<picture>` tags in your HTML.
- Supports various image formats including JPEG, PNG, and WebP.

## Who this tool is for

This tool allows automatically generating responsive images in smaller projects.
It's designed to improve responsiveness of a web project with minimal setup and effort from the developer.
It offloads the tedious task of manually generating responsive images.

## Who this tool is NOT for

This tool performs a function usually handled by content delivery networks(CDNs) in larger deployed projects.
If you are developing such a system, this tool should not replace that functionality.
Some web development frameworks also perform a similar task, so this tool may not be suitable if you are using one of those.

## Installation

To install the plugin, add it to your project using npm or yarn:

```sh
npm install vite-plugin-img-responsiver --save-dev
# or
yarn add vite-plugin-img-responsiver --dev
```

## Configuration
To customize img-responsiver for your project, you can pass a configuration object with various options.
*All fields are optional*, and default values will be used if fields are not specified.

### Example configuration
Here is an example configuration with descriptions of each available option:
```javascript
import imgResponsiver from 'vite-plugin-img-responsiver';

export default {
  imagesDirs: './src/assets/images', // Specifies one or more directories for source images
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg'], // File types to process
  conversionSizes: [320, 480, 768, 1024, 1280], // Target sizes in pixels for responsive images
  outputFileTypes: ['.webp', '.jpeg', '.png'], // Output formats in priority order
  outputDir: './dist/images', // Directory for saving generated images
  htmlDirs: './src', // Specifies directories containing HTML files to process
  htmlFileType: '.html', // Extension of HTML files
  imgTagRegex: /<img[^>]*src=["'][^"']+["'][^>]*>/g // Regex to match <img> tags for replacement
};
```

### Configuration options
- `imagesDirs`: Specifies one or more directories containing source images. Can be a string or an array.
- `imageExtensions`: Array of image file extensions to process. Supports `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`, `.tiff`, and `.svg`.
- `conversionSizes`: Array of target dimensions in pixels. Images are resized proportionally, with the largest dimension scaled to match each specified size.
- `outputFileTypes`: Array of output file formats in priority order. Use this to specify preferred image formats for different browsers.
- `outputDir`: Directory where generated responsive images will be saved.
- `htmlDirs`: Specifies directories with HTML files to process. Can be a string or an array.
- `htmlFileType`: File extension for HTML files, e.g., `.html`.
- `imgTagRegex`: Regular expression to match `<img>` tags for replacement. The default regex targets common HTML `<img>` tags.

## Example
Want to see an example of the plugin?
Clone the repo and run the example folder as a vite project:

https://github.com/MrProgrammerMan/vite-plugin-img-responsiver.git

It works both in dev and in preview!

## Feedback
This is the first time I have created a Vite plugin, or any plugin for that matter.
It has been a learning experience, and I am very pleased to have an actually working plugin.
I have done my best to make this plugin functional, easy to use adn bug-free. Even so, I have no doubt there are problems with it and there are certainly things that are not standard or not standardized. You are more than welcome to submit a pull request or contact me with any suggestions or questions!
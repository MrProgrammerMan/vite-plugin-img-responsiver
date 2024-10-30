# img-responsiver

NOTE: This tool in not yet finished, and is unusable in its current state.

`img-responsiver` is a Vite plugin that generates images at different sizes and file formats, replacing HTML `<img>` tags with `<picture>` tags for responsiveness. This ensures that your web application serves the most appropriate image for the user's device, improving load times and user experience.

## Features

- Automatically generates responsive images in multiple sizes and formats.
- Replaces `<img>` tags with `<picture>` tags in your HTML.
- Supports various image formats including JPEG, PNG, and WebP.

## Whi this tool is for

This tool allows automatically generating responsive images in smaller projects.
It's designed to improve responsiveness of a web project with minimal setup and effort from the developer.
It offloads the tedious task of generating such responsive images manually.

## Who this tool is NOT for

This tool performs a function usually handled by content delivery networks(CDNs) on larger deployed projects.
If you are developing such a system, this tool should not replace this function.

## Installation

To install the plugin, add it to your project using npm or yarn:

```sh
npm install img-responsiver --save-dev
# or
yarn add img-responsiver --dev
```

## TBA Configuration
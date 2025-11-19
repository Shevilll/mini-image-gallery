# Mini Image Gallery

A full-stack application for uploading and viewing images, built with Next.js.

## Features

- **Single Image Upload**: Upload one image at a time.
- **Format Support**: Supports JPEG and PNG formats.
- **Size Limit**: Enforces a maximum file size of 3MB.
- **Real-time Progress**: Visual progress bar during upload.
- **Instant Gallery**: Uploaded images appear immediately in the grid.
- **Delete Functionality**: Remove images from the gallery.
- **In-Memory Storage**: Backend stores images in memory (data persists until server restart).
- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop.
- **Unit Tests**: Comprehensive backend testing using Vitest.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes
- **Language**: TypeScript
- **Testing**: Vitest

## Getting Started

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Run the development server**:

    ```bash
    npm run dev
    ```

3.  **Open the application**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

The project includes unit tests for the backend logic and API routes.

1.  **Run tests**:

    ```bash
    npm test
    ```

2.  **Run tests in watch mode**:
    ```bash
    npm run test:watch
    ```

## Design Choices

- **Next.js App Router**: Used for both frontend and backend to keep the project unified and simple.
- **In-Memory Store**: Implemented a simple global store (`lib/store.ts`) to satisfy the requirement of storing images in memory without an external database.
- **Client-Side Validation**: File type and size are validated on the client side for immediate feedback, with fallback validation on the server.
- **XMLHttpRequest**: Used for the upload function to leverage the `progress` event for a real-time progress bar, which `fetch` does not natively support.
- **Responsive Grid**: The gallery uses CSS Grid with Tailwind breakpoints to ensure it looks good on all device sizes.
- **Testing Strategy**: Used Vitest for unit testing the backend logic and API routes to ensure reliability of the core features (upload, retrieval, deletion).

## API Endpoints

- `POST /api/upload`: Accepts `multipart/form-data` with a single `file` field.
- `GET /api/images`: Returns a list of all stored images metadata.
- `GET /api/view/[id]`: Returns the raw image data.
- `DELETE /api/images/[id]`: Deletes an image by ID.

## Constraints

- **Max File Size**: 3MB
- **Allowed Types**: `image/jpeg`, `image/png`

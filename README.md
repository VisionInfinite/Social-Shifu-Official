# Project Documentation

## Overview

This is a modern web application built with Next.js 13+, featuring a responsive design with a dark theme and AI-powered script generation capabilities.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Components](#components)
- [Styling](#styling)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Tabler Icons
- **AI Integration**: Google Gemini API
- **Form Handling**: React Hook Form
- **Notifications**: Sonner
- **State Management**: Local Storage for script persistence

## Features

### AI Script Generation

The application includes a powerful AI script generator with:

- Structured script format (Hook, Intro, Main Content, CTA)
- Camera angle suggestions
- Emphasis points and pacing notes
- Tone customization
- Duration optimization
- Keyword integration

### Script Display

- Section-based layout
- Color-coded elements
- Copy to clipboard
- Download as text file
- Share functionality
- Mobile-responsive design

## Project Structure

The project structure is organized as follows:

/social-shifu-official
├── /components # Reusable React components
├── /pages # Next.js pages
├── /public # Static assets
├── /styles # Global styles
├── /utils # Utility functions
├── /hooks # Custom React hooks
├── /api # API routes
├── /docs # Documentation files
└── package.json # Project metadata and dependencies

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo-url.git
   cd your-repo-name
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:

```env
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Components

### GenerateScript

The `GenerateScript` component handles the script generation form with:

- Topic input
- Description with character counter
- Keywords input
- Tone selection
- Duration selection
- Real-time validation
- Loading states

### GeneratedScript

The `GeneratedScript` page displays the generated script with:

- Section-based layout
- Color-coded elements
- Action buttons (Copy, Download, Share)
- Navigation back to generator

## Styling

The application uses Tailwind CSS for styling. Tailwind provides utility-first CSS classes that allow for rapid UI development.

## Deployment

The application can be deployed using Vercel or any other hosting service that supports Next.js. Follow the respective documentation for deployment instructions.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

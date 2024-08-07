# nexus

## Description

This project is built using React with TypeScript and ShadCN. It includes features for user authentication, and the creation and listing of posts.

## Features

- User authentication
- Post creation
- Post listing

## Tech Stack

- React
- TypeScript
- ShadCN

## Dependencies

- `@radix-ui/react-label`: ^2.1.0
- `@radix-ui/react-select`: ^2.1.1
- `@radix-ui/react-slot`: ^1.1.0
- `@radix-ui/react-toast`: ^1.2.1
- `@types/react-router-dom`: ^5.3.3
- `axios`: ^1.7.3
- `class-variance-authority`: ^0.7.0
- `clsx`: ^2.1.1
- `lucide-react`: ^0.424.0
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-icons`: ^5.2.1
- `react-router-dom`: ^6.26.0
- `tailwind-merge`: ^2.4.0
- `tailwindcss-animate`: ^1.0.7

## Installation

To get started with this project, follow these steps:

1. **Clone the repository:**

2. Install dependencies:
Make sure you have Node.js installed, then run:
```
npm install
```
4. Start the development server:
 ```
npm run dev
```


##  Usage
Authentication:

Implement user authentication using the provided authentication routes.
Post Creation:

Create new posts using the provided post creation feature.
Post Listing:

View a list of all posts using the provided post listing feature.
## Folder Structure
```
└── 📁front-end
    └── .eslintrc.cjs
    └── .gitignore
    └── components.json
    └── index.html
    └── package-lock.json
    └── package.json
    └── postcss.config.js
    └── 📁public
        └── vite.svg
    └── README.md
    └── 📁src
        └── App.css
        └── App.tsx
        └── 📁assets
            └── react.svg
        └── 📁components
            └── 📁ui
                └── button.tsx
                └── input.tsx
                └── label.tsx
                └── select.tsx
                └── toast.tsx
                └── toaster.tsx
                └── use-toast.ts
        └── 📁hooks
            └── useAuth.tsx
        └── index.css
        └── 📁lib
            └── utils.ts
        └── main.tsx
        └── 📁pages
            └── Acceuil.tsx
            └── Dashboard.tsx
            └── SheetIn.tsx
            └── SignIn.tsx
            └── SignUp.tsx
        └── vite-env.d.ts
    └── tailwind.config.js
    └── tsconfig.app.json
    └── tsconfig.json
    └── tsconfig.node.json
    └── vite.config.ts
```


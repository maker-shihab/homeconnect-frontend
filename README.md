# 🖥️ HomeConnect - Frontend

Project Link

Live Demo: [Pending]

Backend Repository: https://github.com/maker-shihab/homeconnect-backend

HomeConnect is a performant and aesthetically modern web application designed for the real estate and property management market. It provides a seamless experience for property owners to list and manage their properties, and for renters to find, apply for, and manage rental agreements. Built with the Next.js framework, the frontend is optimized for speed, SEO, and developer experience.

## ✨ Key Features

This application focuses on user experience and accessibility, providing a rich set of features:

- ⚡️ Performance & SEO: Utilizes Next.js features like Server-Side Rendering (SSR) and Static Site Generation (SSG) for fast initial loads and optimal search engine visibility.
- 🗺 Interactive Property Map: Integrates react-leaflet to display property locations on an interactive map, allowing users to browse listings geographically.
- 🎨 Accessible & Composable UI: Built using Radix UI primitives to ensure all interface components are highly accessible (WCAG compliant) and fully customizable.
- ✍️ Robust Form Handling: Implements react-hook-form with schema validation (e.g., Zod) for efficient, controlled, and error-proof form submissions across authentication, property listings, and rent payments.
- 🔍 Advanced Filtering & Search: Intuitive search interface to filter properties by location, price, type, and rental status.
- 📱 Fully Responsive Design: Fluid layout implemented using Tailwind CSS for optimal viewing and interaction on all device sizes (desktop, tablet, and mobile).
- 👤 Role-Based UI: Dynamically displays features and navigation links based on user roles (e.g., owner dashboards vs. renter dashboards).

## 🛠 Tech Stack

The frontend is a testament to modern web development best practices, emphasizing speed, modularity, and type safety.

| Category | Technology       | Purpose                       |
| :-------- | :--------- | :-------------------------------- |
| Framework  | Next.js | Production-ready React framework with powerful rendering features. |
| Core Library | React | Core library for building UI components. |
| Styling & UI           | Radix UI | Accessible, unstyled component primitives for custom UI.|
| Styling Utility | Tailwind CSS | Utility-first CSS framework for rapid, customizable design.|
| Forms | react-hook-form | High-performance form validation and state management. | Mapping | react-leaflet | Declarative mapping library for interactive maps. | Icons | react-icons | Comprehensive icon library for UI elements. | State Management | (Implied) | Context API or Zustand/Redux for global state (Auth, notifications). | 

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

###1. Clone the Repository:

```bash 
git clone [https://github.com/maker-shihab/homeconnect-frontend.git](https://github.com/maker-shihab/homeconnect-frontend.git)
cd homeconnect-frontend
```

### 2. Install Dependencies:

```bash 
npm install
# or
yarn install
```
### 3. Environment Variables:
Create a file named `.env.local` in the root directory and add the following variable, pointing to your running backend API (e.g., the `homeconnect-backend` repository):

```bash
# The URL where your backend Express server is running
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/v1
```

### 4.Run the Development Server:

```bash
npm run dev
# or
yarn dev
```
The application will now be running on `http://localhost:3000.`

## 📂 Folder Structure

The project structure adheres to Next.js conventions for maximum scalability and clarity:

```bash
├── public/                # Static assets (images, favicon)
├── src/
│   ├── app/               # Next.js App Router (pages/routes)
│   │   ├── (auth)/        # Route groups for authentication
│   │   ├── properties/    # Property listing and detail pages
│   │   └── rentals/       # Rent management pages
│   ├── components/        # Reusable UI components (buttons, cards, inputs)
│   │   ├── ui/            # Radix UI wrapper components
│   │   └── layout/        # Navigation, Header, Footer
│   ├── hooks/             # Custom React Hooks (e.g., useAuth, useFetch)
│   ├── services/          # API communication logic (e.g., axios instances)
│   ├── styles/            # Global styles and Tailwind config
│   └── utils/             # Utility functions (date formatting, currency)
└── package.json
```


## 🤝 Contact

This project was developed by Shihab, a freelance web application and MERN Stack Developer.

- Portfolio/Contact: [Insert Your Portfolio/LinkedIn Link Here]
- GitHub: https://github.com/maker-shihab

I specialize in building modern, high-performing web solutions that combine clean design with efficient backend logic.
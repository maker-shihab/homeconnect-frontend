# 🖥️ HomeConnect (Frontend)

> 🏆 **University Academic Project | Next.js 14 + TypeScript + ShadCN UI | Modular Architecture**

A modern, responsive, and scalable frontend interface for the **HomeConnect Smart Home System**, built with Next.js App Router, TypeScript, and ShadCN UI — designed to integrate seamlessly with the Express.js backend. Perfectly structured for academic evaluation, team collaboration, and future portfolio 展示.

---

## 🎓 Project Overview

**Course**: Advanced Web Development / Software Engineering  
**Institution**: European University of Bangladesh  
**Submitted By**: Md.Shihab Uddin  
**Student ID**: 220322055  
**Supervisor**: Jannatun Ferdows

> 💡 This project demonstrates mastery of:
>
> - Modern React architecture with Next.js App Router
> - TypeScript strict typing & component design
> - ShadCN UI + Tailwind CSS for professional styling
> - JWT Authentication Flow & Protected Routes
> - React Query for efficient data fetching & caching
> - Modular, feature-based folder structure mirroring backend
> - Responsive UI Design & Accessibility (a11y)
> - Environment-based API configuration

---

## 🌐 Live Demo (Optional)

🔗 **Frontend**: `http://localhost:3000`  
🔗 **Backend API**: `http://localhost:5000/api/v1`  
🔗 **Swagger Docs**: `http://localhost:5000/api-docs`

> 🖼️ _(Add deployed URL before final submission — e.g., Vercel/Netlify)_

---

## 🧩 Features

✅ **User Authentication** — Login, Register, Forgot Password  
✅ **Smart Device Dashboard** — View, Control, Add Devices (Lights, Plugs, ACs)  
✅ **Rental Marketplace** — Browse, Post, Book Rental Items  
✅ **Payment Simulation** — Checkout Flow with Success Screen  
✅ **User Dashboard** — Manage Devices, Rentals, Profile  
✅ **Responsive Design** — Mobile, Tablet, Desktop Ready  
✅ **Protected Routes** — Role-based access control  
✅ **Loading States & Error Boundaries** — Professional UX  
✅ **Dark Mode Support** — (Optional — easy to add with ShadCN)  
✅ **API Integration** — Axios + React Query + Centralized Client

---

## 🚀 Tech Stack

| Layer            | Technology                           |
| ---------------- | ------------------------------------ |
| Framework        | Next.js 14 (App Router)              |
| Language         | TypeScript (Strict Mode)             |
| Styling          | Tailwind CSS + ShadCN UI Components  |
| State Management | React Query + Zustand (Optional)     |
| Form Handling    | React Hook Form + Zod Validation     |
| Routing          | Next.js App Router                   |
| HTTP Client      | Axios                                |
| Auth             | JWT (Stored in localStorage)         |
| Icons            | Lucide Icons / Heroicons             |
| Code Quality     | ESLint + Prettier + Husky            |
| Responsive       | Mobile-first, Flex/Grid, Breakpoints |

---

## 📂 Architecture Diagram (Conceptual)

```bash
src/
├── app/ → Pages & Layouts (Next.js App Router)
│ ├── auth/ → Login, Register, Forgot Password
│ ├── devices/ → Device List, Detail, Add
│ ├── rentals/ → Browse, Post, Book
│ └── dashboard/ → User Analytics & Controls
│
├── components/ → Reusable UI
│ ├── ui/ → ShadCN Base Components (Button, Card, etc.)
│ ├── modules/ → Feature-specific Components (DeviceCard, RentalForm)
│ └── shared/ → Loading, ErrorBoundary, ProtectedRoute
│
├── hooks/ → Custom Hooks (useAuth, useDevices, useApi)
├── lib/ → API Client, Utils, Constants
├── types/ → Shared TypeScript Interfaces (matches backend!)
└── stores/ → Zustand Stores (optional for global state)
```

> 🖼️ _(Add actual diagram image later — e.g., draw.io or Mermaid)_

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- npm / yarn / pnpm
- Running backend at `http://localhost:5000`

### Installation

```bash
git clone https://github.com/yourusername/homeconnect-frontend.git
cd homeconnect-frontend
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_KEY= # optional
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production build
npm run lint      # Check code quality
npm run format    # Format with Prettier
```

## 📖 Component Design Philosophy

We use ShadCN UI — a collection of re-usable components built using Radix UI and Tailwind CSS.

**✅ Why ShadCN?**

- No external dependencies — components live in your codebase
- Fully customizable via Tailwind classes
- Accessible by default (a11y compliant)
- Perfect for academic projects — shows deepunderstanding of component architecture
  Example usage:

```js
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to HomeConnect</CardTitle>
      </CardHeader>
      <Button variant="primary">Get Started</Button>
    </Card>
  );
}
```

## 🔗 Backend Integration

All API calls are made through `src/lib/api/client.ts` → which injects JWT token automatically.

```ts
// src/hooks/useDevices.ts
const { data, isLoading } = useQuery({
  queryKey: ["devices"],
  queryFn: () => apiClient.get("/devices").then((res) => res.data.data),
});
```

## 🧪 Testing Strategy (Future Scope)

Unit & Integration tests can be added using:

- Jest + React Testing Library
- Cypress / Playwright for E2E
- Mock Service Worker (MSW) for API mocking

## 🤝 Contribution Guidelines

This is an academic project — but structured for open collaboration:

1. Fork the repo
2. Create feature branch (git checkout -b feature/module-name)
3. Commit changes (git commit -m 'feat: add device control panel')
4. Push to branch (git push origin feature/module-name)
5. Open Pull Request

## 📸 Screenshots (Placeholder)

🖼️ Add screenshots of:

> Login Page
> Device Dashboard
> Rental Listing
> Payment Flow
> Mobile Responsiveness
> Swagger API Docs Integration
> (Drag & drop images into /public/images/screenshots/ and link here)

## 📚 References & Credits

- Next.js Documentation
- TypeScript Handbook
- ShadCN UI Docs
- Tailwind CSS Guide
- React Query Documentation
- “Clean Code” by Robert C. Martin
- University Course Materials

## 📄 License

MIT License — For academic use and portfolio 展示 only.

## 🙋‍♂️ Contact

- Developer: MD. Shihab Uddin
- Email: shihabud696@gmail.com
- LinkedIn: linkedin.com/in/maker-shiahb
- GitHub: github.com/makershihab
- Portfolio: [Let's Checkout Protfolios](https://makershihab.netlify.app/)

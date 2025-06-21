# PED (Public Entry Device)

A Next.js application for IIT Ropar’s digitized entry/exit system.  
Built with React, Firebase, PWA support and a rich component library.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Getting Started](#getting-started)  
4. [Available Scripts](#available-scripts)  
5. [Project Structure](#project-structure)  
6. [Deployment](#deployment)  
7. [Contributing](#contributing)  

---

## Features

- User authentication (Firebase Auth)  
- QR-code generation & scanning (`qr-scanner`, `qrcode`)  
- Real-time data via Firebase Realtime Database  
- Admin dashboard with swipeable image carousel  
- PWA manifest & offline support  
- Responsive UI using Chakra UI, TailwindCSS & Emotion  
- Charts & data visualization (Chart.js, Recharts)  
- Notifications & email via Nodemailer  
- Socket.IO for real-time communication  

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15.1.4  
- **Language:** JavaScript (React 19.0.0)  
- **Authentication & Database:** Firebase (`firebase`, `firebase-admin`)  
- **UI Libraries:**  
  - [Chakra UI](https://chakra-ui.com/)  
  - [Tailwind CSS](https://tailwindcss.com/)  
  - Emotion (`@emotion/react`, `@emotion/styled`)  
  - [Shadcn UI](https://github.com/shadcn/ui)  
  - [Font Awesome](https://fontawesome.com/)  
- **QR & Data:**  
  - [`qr-scanner`](https://github.com/nimiq/qr-scanner)  
  - [`qrcode`](https://github.com/soldair/node-qrcode)  
- **Charts:**  
  - Chart.js & react-chartjs-2  
  - Recharts  
- **Real-time:** Socket.IO  
- **Email:** Nodemailer  
- **Utilities:** `uuid`, `nookies`  
- **Linting:** ESLint (`eslint-config-next`)  
- **Build & Deployment:** Vercel  
- **Bundler:** Turbopack (Next.js dev)  

---

## Getting Started

1. Clone the repo  
   ```bash
   git clone https://github.com/your-org/ped.git
   cd ped
Here’s a ready-to-paste `PROJECT_STRUCTURE.md` snippet:

```markdown
## Project Structure

```

.
├── public/              # Static assets & images
├── src/
│   ├── app/
│   │   ├── admin/       # Admin dashboard & carousel
│   │   ├── scanQR/      # QR-scanner page
│   │   ├── gate/        # Entry-gate UI
│   │   ├── genQR/       # QR-code generator
│   │   ├── Data\_charts/ # Charts & analytics
│   │   ├── auth/        # Auth flows
│   │   ├── styles/      # Global CSS
│   │   ├── layout.js    # Root layout & metadata
│   │   └── manifest.js  # PWA manifest
│   ├── components/      # Shared React components
│   └── lib/             # Firebase client & utils
├── .eslint.config.mjs   # ESLint config
├── next.config.mjs      # Next.js config
├── tailwind.config.mjs  # TailwindCSS config
├── tsconfig.json        # TypeScript config (JSX support)
└── package.json         # Project metadata & dependencies

```

Made with ❤️ for IIT Ropar’s entry/exit system.
```


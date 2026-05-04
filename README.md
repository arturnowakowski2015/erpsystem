# ERP System

A modern, full-featured ERP (Enterprise Resource Planning) system built specifically for furniture manufacturing and retail businesses. This comprehensive solution manages everything from inventory and purchase orders to sales, invoicing, and customer portals.
 

## 🌟 Features

### 📊 **Core ERP Modules**
- **Dashboard**: Real-time analytics and KPI tracking
- **Inventory Management**: Track stock levels, products, and warehouses
- **Purchase Orders**: Complete procurement workflow
- **Sales Orders**: End-to-end sales management
- **Invoicing**: Automated invoice generation and tracking
- **Customer Portal**: Self-service portal for customers
- **Budget Tracking**: Financial planning and monitoring

### 🎨 **Premium UI/UX**
- **Medium-Dark Theme**: Eye-friendly, modern dark interface
- **Animated Gradients**: Smooth, attractive background animations
- **Glassmorphism Effects**: Premium card designs with depth
- **Responsive Design**: Works perfectly on all devices
- **Accessible**: WCAG compliant with high contrast ratios

### 🔐 **Authentication & Security**
- **Multi-step Signup**: Email verification with OTP
- **Secure Login**: Password strength validation
- **Role-based Access**: Admin and Portal user roles
- **Session Management**: Secure authentication with Supabase

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Step-by-Step Installation

#### Step 1: Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd project-navigator-main
```

#### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React & React Router
- TypeScript
- Tailwind CSS
- shadcn-ui components
- Supabase client
- Recharts for analytics
- And more...

#### Step 3: Environment Setup

Create a `.env` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Other configurations
VITE_APP_NAME=Shiv Furniture ERP
```

> **Note**: Contact your administrator for the Supabase credentials.

#### Step 4: Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:8080`

#### Step 5: Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

#### Step 6: Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
project-navigator-main/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # shadcn-ui components
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── purchase/      # Purchase order pages
│   │   └── ...            # Other modules
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── index.css          # Global styles & theme
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies & scripts
```

## 🎨 Theme Customization

The application uses a **premium medium-dark theme** with customizable colors defined in `src/index.css`:

### Color Palette

- **Background**: Rich dark indigo `hsl(230 35% 12%)`
- **Cards**: Medium-dark `hsl(230 25% 20%)`
- **Primary**: Vibrant purple-blue `hsl(250 75% 60%)`
- **Accent**: Bright cyan `hsl(180 70% 50%)`
- **Text**: Soft white `hsl(210 40% 98%)`

### Customizing Colors

Edit the CSS variables in `src/index.css`:

```css
:root {
  --background: 230 35% 12%;
  --primary: 250 75% 60%;
  --accent: 180 70% 50%;
  /* ... more variables */
}
```

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.3.1 |
| **TypeScript** | Type Safety | 5.6.2 |
| **Vite** | Build Tool | 6.0.1 |
| **Tailwind CSS** | Styling | 3.4.1 |
| **shadcn-ui** | Component Library | Latest |
| **Supabase** | Backend & Auth | Latest |
| **React Router** | Routing | 7.1.1 |
| **Recharts** | Charts & Analytics | 2.15.0 |
| **Lucide React** | Icons | 0.468.0 |
| **Sonner** | Toast Notifications | 1.7.1 |

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
 
 
  

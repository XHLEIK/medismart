# MediSmart - Smart Hospital Management System

MediSmart is a comprehensive hospital management system built with React, Vite, and Tailwind CSS. It offers a variety of features including user authentication, appointment scheduling, AI chatbot, video consultations, AI-generated diet plans, and emergency ambulance services.

## Features

- **User Authentication**: Sign in with email/password, Google, or Facebook using Clerk Auth
- **Dashboard**: View health metrics, upcoming appointments, and recent activities
- **Appointment Scheduling**: Book and manage appointments with healthcare professionals
- **Smart Chatbot**: Get instant health information and guidance through an AI assistant
- **Video Consultation**: Connect with doctors through video calls
- **AI Diet Plans**: Generate personalized nutrition plans based on health profile
- **Ambulance Service**: Request emergency medical transportation with one click

## Technology Stack

- **Frontend**: React with Vite
- **Styling**: Tailwind CSS with DaisyUI components
- **Authentication**: Clerk Auth
- **UI Components**: Headless UI and Heroicons
- **Charts**: Chart.js with React-Chartjs-2
- **Routing**: React Router DOM
- **HTTP Requests**: Axios
- **Real-time Communication**: Socket.IO Client
- **Calendar**: React Calendar

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd medismart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
medismart/
├── public/               # Static assets
├── src/
│   ├── api/              # API service files
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable components
│   │   ├── ambulance/    # Ambulance-related components
│   │   ├── appointment/  # Appointment-related components 
│   │   ├── auth/         # Authentication components
│   │   ├── chat/         # Chatbot components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── diet/         # Diet plan components
│   │   ├── layout/       # Layout components
│   │   ├── ui/           # UI components
│   │   └── videocall/    # Video call components
│   ├── context/          # Context providers
│   ├── features/         # Feature-specific modules
│   ├── hooks/            # Custom hooks
│   ├── layouts/          # Page layouts
│   ├── pages/            # Page components
│   │   ├── ambulance/    # Ambulance service pages
│   │   ├── appointment/  # Appointment pages
│   │   ├── auth/         # Authentication pages
│   │   ├── chat/         # Chatbot pages
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── diet/         # Diet plan pages
│   │   └── videocall/    # Video call pages
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.js        # Vite configuration
```

## Responsive Design

MediSmart is fully responsive and optimized for both desktop and mobile devices.

## License

[MIT License](LICENSE)

## Acknowledgements

- Icons: [Heroicons](https://heroicons.com/)
- UI Components: [Headless UI](https://headlessui.dev/)
- Styling: [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/)
- Charts: [Chart.js](https://www.chartjs.org/) and [React-Chartjs-2](https://react-chartjs-2.js.org/)

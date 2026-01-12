# LastMinuteEngineering

**Your Tech Interview Hub** - A comprehensive platform for engineering students to excel in exams and technical interviews with free resources, concise notes, MAKAUT PYQs, and AI-powered interview practice.

## 🚀 Features

- **Interview Preparation**: AI-powered mock interview practice
- **Coding Resources**: Curated coding sheets and problem sets
- **Communication Skills**: Practice and improve technical communication
- **Study Materials**: Free resources and concise notes for engineering students
- **MAKAUT PYQs**: Previous year questions for exam preparation
- **Smart Suggestions**: Topic-focused recommendations for efficient learning

## 🛠️ Technologies Used

This project is built with modern web technologies:

- **React** - UI library for building interactive interfaces
- **Vite** - Fast build tool and development server
- **JavaScript** - Programming language (converted from TypeScript)
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn-ui** - Re-usable component library built on Radix UI
- **Framer Motion** - Animation library for smooth interactions
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and state management

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

Install Node.js using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (recommended)

### Getting Started

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd enchanted-landing
   ```

2. **Navigate to the client directory**
   ```sh
   cd client
   ```

3. **Install dependencies**
   ```sh
   npm install
   ```

4. **Start the development server**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```sh
   npm run build
   ```

6. **Preview production build**
   ```sh
   npm run preview
   ```

## 📁 Project Structure

```
enchanted-landing/
├── client/             # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Index, CodingSheet, Communication)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── data/           # Static data and constants
│   │   ├── App.jsx         # Main app component with routing
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/             # Backend application (if applicable)
└── README.md           # Project documentation
```

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🌐 Routes

- `/` - Home page with hero section and features
- `/coding-sheet` - Coding practice resources
- `/communication` - Communication skills practice
- `*` - 404 Not Found page

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is private and not licensed for public use.

---

Built with ❤️ for engineering students by TEAM S

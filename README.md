# InterviewAI 🧠

InterviewAI is a cutting-edge, AI-powered interview platform designed to evaluate candidates with precision, speed, and fairness. By simulating real-world technical and behavioral interviews, it provides an immersive, end-to-end evaluation experience for tech roles ranging from Frontend Developers to ML Engineers.

## ✨ Key Features

### 1. Dynamic Role-Based Interviewing
- **Tailored Questions:** Generates behavioral and technical questions specific to the candidate's chosen role (e.g., DevOps, Full Stack, Data Science) and experience level.
- **Skill-Specific Filtering:** Asks targeted questions based on the exact skills/technologies the candidate inputs during setup (e.g., Docker, Kubernetes, React).
- **Mandatory Introductions:** Always starts with a "Tell me about yourself" question to simulate a natural interview flow.

### 2. Live Coding Environment
- **Integrated Code Editor:** Features a fully functional, syntax-highlighted code editor for technical screening.
- **Role-Specific Challenges:** Assigns specialized coding challenges based on the applied role (e.g., Log Processing for DevOps, Two Sum for Software Engineers).
- **Automated Validation:** Includes real-time test case validation and performance scoring.

### 3. Immersive AI Interviewer
- **Text-to-Speech (TTS):** Utilizes the Web Speech API to provide a natural voice to the robotic interviewer.
- **Live System Checks:** Enforces camera, microphone, and network system checks before the interview begins to ensure a seamless experience.
- **Micro-Animations & Visual Polish:** Features a highly responsive, premium dark-mode aesthetic with glassmorphism, dynamic gradients, and smooth state transitions.

### 4. Comprehensive Evaluation
- **Real-Time Confidence Tracking:** Simulates AI analyzing the candidate's confidence and focus during the interview.
- **Detailed Summary Report:** Generates a post-interview summary detailing time taken, questions attempted, performance score, and coding accuracy.

### 5. Production-Ready Responsiveness
- **Adaptive Layouts:** Built with a centralized container architecture that looks stunning on ultra-wide monitors.
- **Mobile-Optimized:** Fluidly adapts to mobile devices and tablets (including ultra-narrow screens like the Galaxy Z Fold) using responsive media queries and touch-friendly UI components.

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Library:** [React 18](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** Vanilla CSS Modules (Custom Design System with CSS Variables)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

To run this project locally on your machine:

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd interview-ai
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Future Roadmap

- **Database Integration:** Connect to Supabase or MongoDB to persistently save candidate profiles and interview transcripts.
- **Resume Parsing:** Implement PDF parsing to automatically extract and validate candidate skills.
- **Premium TTS:** Upgrade from the native Web Speech API to a premium service like ElevenLabs for ultra-realistic interviewer voices.

---
*Built for the future of hiring.*

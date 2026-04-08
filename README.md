# Interactive Wall Calendar

A polished, fully interactive React/Next.js component inspired by a physical wall calendar aesthetic. Built for the TUF Frontend Engineering Challenge.

## Features
- **Wall Calendar Aesthetic**: Large hero image, dynamic Month/Year typography formatting. Integrated blue geometric overlays similar to real-life hangable calendars.
- **Day Range Selector**: Click dates on the CSS-grid based calendar to select Date Ranges. Provides immediate visual feedback, handling start dates, end dates, and intermediate hover days dynamically.
- **Integrated Notes**: A dynamic and persistent notes area. It adapts automatically, storing and loading memos specifically for the individual day, range, or month currently being observed. All managed gracefully via `localStorage`.
- **Vanilla CSS Excellence**: TailwindCSS was actively removed and strictly avoided to demonstrate mastery of standard CSS. Achieved flawless layout control using pure CSS Modules, flexbox rules, pure gradients (lined paper effect), and modern CSS `clip-path` styling.
- **Fully Responsive**: Elegantly collapses into a vertical stack on mobile devices.

## How to Run Locally
1. Clone the repository and navigate to the project root folder (`TUF-Assignment`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Navigate to `http://localhost:3000` to interact with the responsive wall calendar in action.

## Technologies Used
- React & Next.js 15 (App Router, Strict Mode)
- Vanilla CSS + CSS Modules
- `date-fns` for lightweight date interpolation
- `lucide-react` for interactive icons

## Architectural Thought Process
- **Design Strategy**: Instead of mimicking standard software web date-pickers, the UI specifically honors the physical spatial layout: The top is visual anchoring acting as the hero block, the bottom left serves as textual "memo paper" padding, and the bottom right is structured numerical layout.
- **Component Separation**: Responsibilities are strictly segregated:
  - `Calendar.tsx`: The primary state container directing logic between children.
  - `Hero.tsx`: Visual layout, utilizing native CSS polygon clipping.
  - `Grid.tsx`: Complex interpolation logic converting standard objects to a 2D calendar array.
  - `Notes.tsx`: Abstracting persistent client-storage interactions.

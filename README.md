# Trello Clone - Frontend Engineering Task

A highly interactive, performant, and scalable Trello clone built as a frontend engineering assessment. This project focuses on clean code, solid architectural decisions, and a pixel-perfect user experience that closely mimics the native Trello feel.

## ✨ Key Features
- **Advanced Drag & Drop:** Smooth reordering of lists and cards using `@hello-pangea/dnd`.
- **Rapid Data Entry:** Continuous addition of lists and cards without losing focus, prioritizing core UX workflows.
- **Inline Editing:** Quick title edits for both lists and cards directly from the board view.
- **Interactive Task Modal:** Detailed card view with a fully functional, chronologically ordered commenting system.
- **Persistent State:** Local storage integration ensures board data is never lost upon page refresh.

## 🛠 Tech Stack
- **Framework:** [Next.js](https://nextjs.org)
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** SCSS (Sass)
- **Icons:** Lucide React
- **Utilities:** clsx

## 🧠 Architectural Decisions & Best Practices

To demonstrate production-ready engineering, several deliberate architectural decisions were made during development:

### 1. State Management (Zustand)
Instead of using heavy libraries like Redux or prop-drilling with React Context, **Zustand** was chosen for its minimal boilerplate and unopinionated nature.
- **Performance:** Prevents the unnecessary cascading re-renders often seen with the Context API.
- **Modularity:** Allowed separating complex nested state updates (like mutating deep arrays for comments and cards) with clean, early-return patterns rather than "nesting hell".
- **Persistence:** Effortless integration with `localStorage` via Zustand's `persist` middleware while handling hydration safely via custom hooks (`useHasMounted`).

### 2. Styling Architecture (SCSS Partials & Mixins)
This project strictly utilizes **SCSS Partials and Mixins** following a modular architecture (inspired by the 7-1 pattern) to demonstrate deep CSS architecture knowledge.
- **Scalability:** Styles are broken down into logical partials (`_variables.scss`, `_board.scss`, `_card.scss`, etc.) and unified in `globals.scss`, keeping the global namespace clean and maintainable.
- **Reusability (Mixins):** Implemented SCSS mixins (e.g., for custom scrollbars) to adhere to the DRY principle and ensure consistent UI components without duplicating vendor prefixes or complex CSS rules.
- **Accessibility & Consistency:** Utilizing `rem` units globally for typography and spacing, alongside Sass variables for consistent coloring.

### 3. Component Design (SOLID & Clean Code)
- **Single Responsibility Principle (SRP):** Complex components were broken down logically. For example, the `CardModal` delegates its comment logic entirely to a standalone `CommentSection` component, preventing massive files and isolating re-renders.
- **DRY (Don't Repeat Yourself):** Reusable utility components like `AddAction` smartly handle both List and Card creation logic (adapting between `<input>` and `<textarea>`) dynamically using `clsx` for conditional styling.
- **YAGNI (You Aren't Gonna Need It):** Avoided over-engineering premature UI kits, focusing directly on the core functionality while keeping the component tree open for extension.

## 🚀 Getting Started

First, install the dependencies. This project uses `pnpm` (but `npm` or `yarn` work as well):

```bash
pnpm install
```
Then, run the development server:

```bash
pnpm dev
```
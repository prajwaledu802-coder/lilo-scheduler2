# Lilo Scheduler - Design Guidelines

## Design Approach
**Reference-Based Approach**: Draw inspiration from modern productivity tools (Notion, Linear, Todoist, Google Calendar) while incorporating vibrant, startup-grade aesthetics. Balance professional utility with visual appeal through strategic use of gradients and modern UI patterns.

## Core Design Principles
1. **Premium Minimalism**: Clean, spacious layouts with purposeful color accents
2. **Hierarchy Through Color**: Use gradients to guide attention, not overwhelm
3. **Contextual Density**: Dense information in calendar views, breathing room in dashboards
4. **Smooth Interactivity**: Subtle transitions that feel responsive without distraction

## Typography System
- **Headings**: Inter or DM Sans, weights 600-700 for section headers
- **Body**: Inter or System UI, weight 400-500 for readability
- **UI Elements**: Medium weight (500) for buttons, tabs, menu items
- **Calendar/Time**: Tabular numbers for alignment, weight 600 for emphasis
- **Sizes**: Scale from text-sm (12px) for metadata to text-4xl (36px) for dashboard greetings

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section margins: mb-6, mb-8, mb-12
- Card gaps: gap-4, gap-6
- Container max-width: max-w-7xl for main content area

## Visual Treatment

### Gradient Strategy
- **Primary Gradient**: Blue to purple (from-blue-600 to-purple-600) for hero sections and primary CTAs
- **Accent Gradient**: Teal to blue (from-teal-500 to-blue-500) for secondary elements
- **Subtle Backgrounds**: Very light gradients (from-slate-50 to-blue-50) for sections
- **Glass Effect**: Backdrop blur with subtle gradients for floating panels and the Lilo chatbot

### Background Approach
- **Main Dashboard**: Clean white/light gray base with gradient accents in header/hero area
- **Calendar Views**: White cards on subtle gradient background
- **Authentication Pages**: Full-screen gradient (blue/purple/teal) with centered frosted glass card
- **Modals/Panels**: Backdrop blur with white/translucent backgrounds

## Component Library

### Navigation & Structure
- **Top Navigation Bar**: Fixed header with logo left, user profile right, gradient background or white with shadow
- **Hamburger Menu**: Right-side slide-out drawer (w-80) with schedule links, smooth transform transition
- **User Profile Dropdown**: Appears below avatar/email, rounded corners, shadow-lg

### Calendar Components
- **View Switcher**: Pill-style tabs (Year/Month/Week/Day) with gradient active state
- **Calendar Grid**: Clean borders, hover states on dates, gradient accents for current day
- **Event Cards**: Compact cards with left color-coded border, time on left, title and details stacked
- **Time Slots**: Clear hour markers, grid lines, drag-and-drop friendly spacing

### Task & To-Do Elements
- **Task Cards**: White cards with shadow-sm, checkbox left, time badge right, title and notes stacked
- **Completed State**: Strikethrough text, reduced opacity, subtle green checkmark
- **Priority Indicators**: Color-coded left border (red/orange/blue/gray)
- **Add Task Button**: Gradient background, rounded-full, fixed position or prominent placement

### Lilo AI Chatbot
- **Position**: Fixed bottom-right corner (bottom-6 right-6)
- **Bubble**: Circular gradient button (w-14 h-14) when collapsed, expands to chat window (w-96 h-[500px])
- **Chat Window**: Frosted glass effect (backdrop-blur-xl), rounded-2xl, shadow-2xl
- **Messages**: User messages aligned right with gradient background, Lilo responses left with white background
- **Input Field**: Bottom of chat with gradient border on focus

### Forms & Inputs
- **Text Inputs**: Border-gray-300, rounded-lg, focus:ring-2 ring-blue-500
- **Dropdowns**: Custom styled with gradient active states
- **Date/Time Pickers**: Inline calendar widgets, clear action buttons
- **Repeat Pattern Toggle**: Pill buttons for one-time/daily/weekly/monthly/yearly

### Buttons
- **Primary**: Gradient background (blue to purple), white text, rounded-lg, shadow on hover
- **Secondary**: White background, gradient border, gradient text
- **Ghost**: Transparent, hover gradient background
- **Icon Buttons**: Square or circular, subtle hover background

## Page-Specific Layouts

### Authentication Pages
- Centered card (max-w-md) on full-screen gradient background
- Logo/branding at top
- Form fields with generous spacing (space-y-4)
- Social login buttons below divider
- Link to alternate action (login ↔ signup) at bottom

### Dashboard (Main View)
- Greeting section with user name and date (gradient background, py-8)
- Two-column layout: Left (60%) for today's schedule/tasks, Right (40%) for upcoming and quick actions
- Prominent "Add Task" button (gradient, floating or top-right)
- Empty states with friendly illustrations and gradient "Get Started" CTAs

### Calendar Views
- Full-width calendar grid with proper responsive breakpoints
- Top bar with view switcher, today button, navigation arrows
- Side panel for event details when clicked (slide-in from right)
- Mini calendar in sidebar for month view

### Profile Panel
- Slide-down or modal overlay
- Avatar at top center, editable
- Form fields for personal info with subtle backgrounds
- Save/cancel buttons with gradient primary

## Animations & Interactions
- **Page Transitions**: Fade-in (opacity + translate-y) on load, duration-300
- **Menu Open/Close**: Slide transform, duration-200, ease-out
- **Task Completion**: Scale bounce effect, duration-150
- **Hover States**: Subtle scale (scale-105) or shadow increase
- **No autoplaying animations**: User-triggered only

## Images
**Hero/Dashboard Header**: Optional gradient abstract illustration or productivity-themed graphic (calendar, checkmarks, time concepts) as a background accent—not full-bleed, but integrated into the gradient header section

## Accessibility
- High contrast text on gradient backgrounds (ensure WCAG AA minimum)
- Focus states with visible rings (ring-2 ring-offset-2)
- Keyboard navigation for all interactive elements
- ARIA labels for icon-only buttons
- Consistent tab order
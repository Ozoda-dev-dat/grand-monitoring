# Design Guidelines: PDP University Monitoring Platform & CRM

## Design Approach: Enterprise Data Management System

**Selected Approach:** Carbon Design System with educational platform influences (Canvas, Google Classroom)

**Justification:** This utility-focused platform requires efficient data management, clear information hierarchy, and professional aesthetics suitable for an academic institution. Carbon Design's data-centric approach paired with educational platform patterns ensures optimal usability across multiple user roles.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 210 100% 45% (Trust-inspiring academic blue)
- Secondary: 210 15% 25% (Professional charcoal)
- Success: 145 65% 42% (Grant approval, positive metrics)
- Warning: 38 92% 50% (Approaching deadlines, grade concerns)
- Error: 0 72% 51% (Retakes, violations)
- Background: 0 0% 98% (Clean canvas)
- Surface: 0 0% 100% (Card/panel backgrounds)
- Border: 210 20% 90% (Subtle separation)

**Dark Mode:**
- Primary: 210 100% 60%
- Secondary: 210 15% 85%
- Success: 145 65% 50%
- Warning: 38 92% 60%
- Error: 0 72% 60%
- Background: 210 15% 8%
- Surface: 210 15% 12%
- Border: 210 20% 20%

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - UI elements, body text, data tables
- Monospace: 'JetBrains Mono' (Google Fonts) - Code editor, technical data

**Hierarchy:**
- Display: 32px/700 (Dashboard headers)
- H1: 24px/600 (Page titles)
- H2: 20px/600 (Section headers)
- H3: 16px/600 (Card titles, subsections)
- Body: 14px/400 (Standard content)
- Small: 12px/400 (Metadata, timestamps)
- Code: 14px/400 monospace (Code editor, technical fields)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 1, 2, 4, 6, 8, 12, 16 for consistent rhythm
- Micro spacing: p-1, p-2 (tight components, badges)
- Component spacing: p-4, p-6 (cards, form fields)
- Section spacing: p-8, p-12, p-16 (major layout areas)
- Page margins: Container max-w-7xl with px-4 md:px-6 lg:px-8

**Grid System:**
- Dashboard: 12-column responsive grid
- Main content area: 2/3 width (8 columns)
- Sidebar/panels: 1/3 width (4 columns)
- Mobile: Single column stack

### D. Component Library

**Navigation:**
- Top bar: University branding, role indicator, notifications, user profile dropdown
- Side navigation: Collapsible with icons, grouped by function (Academic, Student Affairs, Grants, Reports)
- Breadcrumbs: For deep navigation within modules

**Data Display:**
- Tables: Sortable headers, row hover states, pagination, filter controls, fixed header on scroll
- Cards: Elevated surfaces (shadow-sm), 16px border radius, consistent padding (p-6)
- Stats panels: Large numbers with trend indicators (↑↓), progress bars for grant percentage
- Timeline: Vertical timeline for student academic journey, assignment progression

**Forms & Inputs:**
- Text fields: Outlined style with floating labels, clear error states
- Dropdowns: Searchable select for faculty/student selection
- Date pickers: Calendar overlay with range selection for academic periods
- File upload: Drag-and-drop zones for document submissions
- Code editor: Monaco editor integration with JavaScript syntax highlighting, line numbers, dark theme support

**Grant Management Specific:**
- Grant eligibility tracker: Circular progress indicators showing percentage (0-100%)
- Criteria checklist: Visual checkmarks/crosses for each requirement (retakes, grades, attendance)
- Dynamic status badges: Color-coded (green=eligible, yellow=at risk, red=ineligible)
- Comparison view: Side-by-side Golden Minds vs Unicorn grant requirements

**Student Portal Components:**
- Assignment cards: Due date, status (pending/in-progress/submitted), coding hours counter
- Grade overview: Subject grid with performance indicators
- Code submission interface: Split view (editor left, instructions/output right)
- Attendance calendar: Heat map visualization of attendance patterns

**Teacher Portal Components:**
- Student roster: Filterable data table with quick actions (grade entry, comments)
- Grade entry forms: Batch operations, dropdown selectors, save/submit workflows
- Student performance dashboard: Charts showing class trends, individual progress

**Administrative Panels:**
- Faculty management: Add/edit/assign teachers to subjects
- Grant committee interface: Review queue, approval workflow, bulk actions
- Reports generator: Customizable filters, export options (PDF/Excel)

### E. Interaction Patterns

**Minimal Animations:**
- Micro-interactions: Button press feedback (scale 0.98), checkbox check animation
- State transitions: Smooth color changes (200ms), subtle slide-ins for panels (300ms)
- Loading states: Skeleton screens for data tables, spinner for form submissions
- NO decorative animations, NO scroll effects

**Responsive Behavior:**
- Desktop (lg): Full multi-panel layout, data tables with all columns
- Tablet (md): Collapsed sidebar (icon-only), tables with horizontal scroll
- Mobile: Bottom navigation, stacked cards, simplified tables (key columns only)

### F. Accessibility & Quality Standards

- WCAG 2.1 AA compliance: 4.5:1 contrast ratios for text
- Keyboard navigation: Tab order, focus indicators (2px blue outline)
- Screen reader support: Semantic HTML, ARIA labels for complex widgets
- Dark mode: Full implementation including code editor, forms, all data visualizations

### G. Dashboard Layouts

**Student Dashboard:**
- Top: Grant eligibility percentage (large circular progress), quick stats (current GPA, attendance %, coding hours)
- Middle: Upcoming assignments (card grid), recent submissions timeline
- Bottom: Academic performance chart, attendance calendar

**Teacher Dashboard:**
- Top: Class overview cards (total students, average grades, pending reviews)
- Middle: Recent student submissions (table), grade entry quick access
- Bottom: Performance analytics (charts), attendance tracking

**Student Affairs Dashboard:**
- Top: Active students count, grade distribution chart, faculty assignments summary
- Middle: Quick actions (add grades, assign faculty, generate reports)
- Bottom: Recent activities feed, system notifications

**Grant Committee Dashboard:**
- Top: Grant applications overview (Golden Minds vs Unicorn counts), approval pipeline
- Middle: Pending reviews queue (detailed table with all criteria)
- Bottom: Historical grant statistics, eligibility trends

**Code Editor Interface:**
- Header: Assignment title, timer display (coding hours), auto-save indicator
- Main area: Monaco editor (70% width) with JavaScript syntax highlighting
- Sidebar: Instructions/requirements (30% width), test cases, submission button
- Footer: Previous submissions history, time tracking log

This design creates a professional, data-centric platform optimized for efficiency, clarity, and role-specific workflows while maintaining visual consistency across all modules.
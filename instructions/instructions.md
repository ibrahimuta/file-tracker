Project: Modern File Processing Dashboard

Project Description:
Create a sleek, modern web dashboard using Next.js 15 that tracks files through a processing pipeline. The application visualizes file progress through five stages (Ordered → Shipped → Invoiced → Remitted → Complete) using an interactive timeline and detailed data table. Users need a clean, intuitive interface to track files, view details, and access documents at each stage.

Technical Stack:
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for base components
- TanStack Table v8 (React Table) for advanced table features
- TanStack Query (React Query) for data management
- Framer Motion for animations
- React Hot Toast for notifications
- Lucide React for icons

Component Libraries Usage:
1. shadcn/ui:
  - Button, Card, Input components
  - Dialog for modals
  - DropdownMenu for actions
  - Form components
  - Tabs for organization
  - Toast for notifications

2. TanStack Table:
  - Sorting
  - Pagination
  - Filters
  - Row selection
  - Column resizing
  - Virtual scrolling

3. TanStack Query:
  - Data fetching
  - Cache management
  - Real-time updates
  - Optimistic updates

4. Framer Motion:
  - Timeline animations
  - Status transitions
  - Loading states
  - Page transitions

Implementation Steps:

STEP 1: Project Foundation
- Setup Next.js 15 with provided technical stack. This step is complete.
- Install and configure all required libraries
- Setup TanStack Query provider
- Create theme configuration
- Basic layout using shadcn/ui components
- Configure Framer Motion animations

STEP 2: Timeline Component
Use existing libraries:
- shadcn/ui Progress for progress bars
- Lucide React for status icons
- Framer Motion for animations
- shadcn/ui Tooltip for hover states
- shadcn/ui Card for stage containers

Timeline Features:
- Interactive timeline showing 5 stages
- Color-coded stages using Tailwind classes:
 * Complete: text-green-500
 * Ordered: text-purple-500
 * Shipped: text-orange-500
 * Invoiced: text-pink-500
 * Remitted: text-yellow-500
- Animated transitions between states
- Document links with hover effects

STEP 3: Data Table Implementation
Use TanStack Table with features:
- Built-in pagination
- Column sorting
- Global search
- Filter controls
- Row selection
- Responsive design
- Virtual scrolling for performance

Table Enhancements:
- shadcn/ui DataTable wrapper
- Status badges using shadcn/ui Badge
- Progress bar using shadcn/ui Progress
- Action menu using DropdownMenu
- Custom filters using shadcn/ui Select
- Search using shadcn/ui Command

STEP 4: Data & State Management
TanStack Query implementation:
- Setup query client
- Define query hooks
- Implement mutations
- Handle cache updates
- Real-time subscriptions
- Optimistic updates
- Error boundaries

Features:
- Automatic background refreshing
- Loading states
- Error handling
- Retry logic
- Data prefetching
- Cache persistence

STEP 5: Timeline and Table Integration
Integrate the table component with the timeline component to provide seamless interaction.

Features:
- Clicking a row in the table dynamically updates the timeline to show the current stage (ordered, shipped, invoiced, remitted, complete) of the selected file.
-	Use the FileEvent interface to fetch file-specific timeline data, including the status, date, and document URL.
-	Highlight the selected row in the table for better visibility.
-	Utilize TanStack Query for fetching and caching timeline data specific to the selected file.
-	Use Framer Motion to animate the timeline transitions, such as sliding effects for horizontal timelines or fade-in effects during updates.
-	Display a “No file selected” placeholder message in the timeline by default, with an animated fade-in effect.
- Ensure the timeline displays vertically on mobile devices and horizontally on laptops/desktops using responsive design with Tailwind CSS.

STEP 6: UI/UX Enhancement
Integration features:
- Toast notifications using React Hot Toast
- Loading skeletons using shadcn/ui Skeleton
- Modal dialogs using shadcn/ui Dialog
- Keyboard shortcuts using shadcn/ui Command
- Form validation using shadcn/ui Form
- Tooltips using shadcn/ui Tooltip
- Context menus using shadcn/ui DropdownMenu

STEP 7: Top Navigation Bar
Implement a sleek, responsive top navigation bar for global app navigation and branding.

Features:
- Add a branding section on the left side of the navigation bar, displaying the app logo or name prominently.
-	Include primary navigation links (e.g., Home, Dashboard, Settings) styled with shadcn/ui Tabs or Tailwind CSS for smooth navigation between pages.
-	Add a user profile menu on the right side with a DropdownMenu for user actions like Profile and Logout. Use Lucide React icons for modern design.
- Integrate a search bar in the navigation bar for quick access to files or data using shadcn/ui Input or Command.
-	Ensure responsive design:
- On mobile, collapse links into a hamburger menu using Lucide React.
- Show the full menu on wider screens.
- Use Framer Motion for smooth animations, such as dropdown transitions and hamburger menu toggle.
- Add hover and focus effects to navigation items using Tailwind’s utility classes for an interactive user experience.

STEP 8: Side Navigation Menu
Add a collapsible, sleek side navigation menu to improve usability and navigation between app sections.

Features:
- Include structured menu items for app sections (e.g., Files, Analytics, Settings), highlighting the currently active section with distinct styling (e.g., bold text, borders).
- Implement a collapsible sidebar:
- Collapse into an icon-only view to save space.
- Use shadcn/ui Button and Tailwind CSS to create a collapse/expand button.
- Animate the collapse/expand action using Framer Motion for smooth transitions.
- Add icons and labels for menu items, using Lucide React for icons. Ensure labels are hidden in collapsed mode but accessible via tooltips (shadcn/ui Tooltip).
- Ensure responsive design:
- On mobile, use a sliding drawer that opens and closes on toggle with shadcn/ui Dialog.
- On larger screens, display the sidebar as a persistent component.
- Keep the sidebar fixed to the left side of the app, ensuring it remains visible during scrolling.
- Add hover effects for menu items and transitions for collapse/expand states using Framer Motion for a polished UI.

Data Interfaces:

```typescript
interface TimelineStatus {
 status: 'ordered' | 'shipped' | 'invoiced' | 'remitted' | 'complete';
 date: string;
 isComplete: boolean;
 documentUrl: string;
}

interface FileEvent {
 eventId: string;
 eventType: string;
 eventStatus: string;
 eventDateTime: string;
 fileId: string;
 fileName: string;
 producer: string;
 consumer: string;
 progress: number;
}
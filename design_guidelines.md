# Neighborhood Micro-Events Finder - Design Guidelines

## Design Approach

**Hybrid Strategy**: Combine Material Design's information density with community-focused inspiration from Nextdoor (trust/verification UI) and Airbnb (event discovery cards). This approach balances utility (quick event discovery, clear verification) with an engaging community experience.

**Core Principles**:
- Trust through transparency (visible confidence scores and sources)
- Information clarity over decoration
- Community warmth with professional reliability
- Accessibility-first for diverse neighborhoods

## Color Palette

**Light Mode**:
- Primary: 210 85% 45% (Trust blue - credibility and civic engagement)
- Primary Hover: 210 85% 38%
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 215 25% 15%
- Text Secondary: 215 15% 45%
- Success (Verified): 145 65% 42%
- Warning (Unverified): 35 85% 55%
- Error: 355 75% 52%

**Dark Mode**:
- Primary: 210 75% 55%
- Primary Hover: 210 75% 48%
- Background: 222 25% 10%
- Surface: 222 20% 14%
- Text Primary: 210 15% 92%
- Text Secondary: 210 10% 70%
- Success: 145 55% 48%
- Warning: 35 75% 60%
- Error: 355 65% 58%

**Accent Colors** (use sparingly):
- Community Orange: 25 90% 55% (CTAs, badges for organizer verified)
- Info Blue: 200 80% 50% (tooltips, info cards)

## Typography

**Families**: 
- Headings: Inter (600, 700 weights) - modern, civic clarity
- Body: Inter (400, 500 weights) - excellent readability
- Monospace: JetBrains Mono (confidence scores, data)

**Scale**:
- Hero/H1: text-4xl md:text-5xl font-bold
- H2: text-3xl md:text-4xl font-semibold
- H3: text-2xl font-semibold
- H4: text-xl font-semibold
- Body Large: text-lg
- Body: text-base
- Small: text-sm
- Tiny (metadata): text-xs

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistency
- Card padding: p-6
- Section padding: py-12 md:py-16 lg:py-20
- Component gaps: gap-4 or gap-6
- Element spacing: space-y-4 or space-y-6

**Container Widths**:
- Map view: w-full (no constraint)
- Content sections: max-w-7xl
- Event cards grid: max-w-7xl
- Text content: max-w-4xl
- Forms: max-w-2xl

**Grid Layouts**:
- Event cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Filter sidebar: Fixed left sidebar (280px) on desktop, drawer on mobile
- Map + List: Split view 60/40 or full-width toggle

## Core Components

**Event Cards**:
- Image at top (16:9 aspect ratio, object-cover)
- Confidence badge (top-right corner with blur backdrop)
- Title (font-semibold, text-lg)
- Time/Date with icon
- Distance badge with location icon
- Tags (rounded-full pills, max 3 visible)
- Organizer name with verified checkmark if applicable
- Source count indicator (small icon cluster)
- Hover: subtle scale (1.02) and shadow increase
- Click: Navigate to detail page

**Confidence Score Badge**:
- Circular or rounded rectangle
- Color-coded: Green (80-100), Yellow (50-79), Gray (0-49)
- Display number + "Verified" or "Unverified" text
- Backdrop blur when overlaying images
- Tooltip on hover explaining score

**Provenance Section** (Event Details):
- Collapsible accordion or always-visible card
- List of sources with favicon/icon + domain
- Timestamp of verification
- "View cached snapshot" links
- Clean, tabular presentation

**Map Integration**:
- Custom markers with confidence color-coding
- Cluster markers for dense areas
- Popup cards on marker click (mini event card)
- User location indicator
- Radius circle visualization

**Filters Panel**:
- Sticky sidebar on desktop (w-72)
- Slide-out drawer on mobile
- Grouped sections: Date, Distance, Type, Tags, Verified Only
- Clear all button
- Active filter chips below search

**Navigation**:
- Top nav: Logo, Search bar (prominent), Map/List toggle, Profile/Login
- Mobile: Bottom tab bar (Discover, Map, Submit Event, Profile)
- Breadcrumbs on detail pages

**Forms** (Submit Event):
- Single column, generous spacing
- Clear field labels above inputs
- Inline validation feedback
- Multi-step for complex flows (Basic Info → Details → Verification)
- Progress indicator for multi-step
- Helpful placeholder text and examples

**Moderation Dashboard**:
- Queue table with sortable columns
- Quick action buttons inline (Verify, Flag, Review)
- Filter by confidence range, status, date
- Event preview pane (split view)
- Audit trail timeline for each event

**Notification Preferences**:
- Toggle switches for each notification type
- Neighborhood/radius selector with map preview
- Frequency options (instant, daily digest, weekly)
- Quiet hours time picker

## Animations

Use sparingly for functional feedback only:
- Card hover: transform scale-105 duration-200
- Loading states: Simple spinner (border-4 border-t-transparent animate-spin)
- Modal/drawer entrance: slide-in from right (translate-x-full → translate-x-0)
- Success feedback: Checkmark fade-in with scale
- NO parallax, NO excessive scroll animations

## Images

**Event Images**:
- Primary event photo in cards and hero of detail page
- Fallback gradients with event category icon if no image
- Consistent aspect ratios (16:9 for cards, 21:9 for detail hero)
- Lazy loading with blur-up placeholder

**Hero Section** (Homepage):
- Large hero image showing Charlotte community event (families, neighborhood gathering)
- Image dimensions: Full viewport width, 60vh height
- Overlay gradient (from transparent to dark) for text legibility
- Hero content: White text, centered or left-aligned
  - H1: "Discover Your Neighborhood's Hidden Gems"
  - Subtitle: Brief value prop
  - Search bar (location + "Events near you")
  - Quick filter chips (Today, This Weekend, Free, Family-Friendly)

**Map View**:
- No decorative images, focus on functionality
- Custom marker icons (color-coded by confidence)

**About/Trust Pages**:
- Team photos (if available)
- Charlotte landmark images for credibility
- Verification process diagram/illustration

## Accessibility

- WCAG 2.1 AA compliance minimum
- Focus indicators: ring-2 ring-primary ring-offset-2
- Keyboard navigation for all interactions
- ARIA labels for icons and interactive elements
- Color contrast ratios: 4.5:1 for text, 3:1 for UI elements
- Screen reader announcements for dynamic content updates
- Skip-to-content link
- Language toggle (English/Spanish) in header

## Mobile Considerations

- Touch targets minimum 44x44px
- Bottom navigation bar (not top-only)
- Swipeable event cards
- Full-screen map mode
- Drawer-based filters (not sidebar)
- Sticky search bar at top
- FAB for "Submit Event" (bottom-right corner)
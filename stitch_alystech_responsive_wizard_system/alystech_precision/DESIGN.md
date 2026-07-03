---
name: AlysTech Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#4b566a'
  on-tertiary: '#ffffff'
  tertiary-container: '#636e83'
  on-tertiary-container: '#ecf1ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  ink-navy: '#0d1f3c'
  ink-secondary: '#475569'
  ink-muted: '#94a3b8'
  border-slate: '#e2e8f0'
  success: '#16a34a'
  warning: '#d97706'
  danger: '#dc2626'
  accent-soft: '#eff6ff'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-medium:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.15em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 16px
  margin-desktop: 40px
  max-width-content: 1024px
---

## Brand & Style

The design system for AlysTech is built upon a foundation of **Technical Authority** and **Focused Clarity**. It draws heavily from **Minimalism** and **Modern Corporate** aesthetics, optimized for high-stakes decision-making environments like cybersecurity and enterprise infrastructure. 

The core experience is "Typeform-like": a focused, wizard-driven flow that reduces cognitive load by presenting information in digestible, high-contrast chunks. The interface utilizes a **Dual-Theme Split-Screen** approach where a dark, protective outer shell (Corporate/Modern) encloses a pristine, paper-like interactive canvas (Minimalism). 

Visual interest is maintained through **Glassmorphism** in overlays and high-end micro-interactions that provide tactile feedback. The overall emotional response should be one of absolute reliability, premium quality, and effortless control.

## Colors

The palette is strategically divided into functional roles:

- **Primary & Interactive:** Royal Blue (`#2563eb`) is the color of action. It is used for primary buttons, selected states, and progress indicators.
- **Surface Architecture:** The "Outer Shell" uses Deep Slate (`#0f172a`) to create a sense of security and depth. The "Interactive Canvas" uses pure White (`#FFFFFF`) to ensure maximum readability.
- **Typography Hierarchy:** Navigation and primary headings use Deep Ink Navy (`#0d1f3c`) for authority, while body text uses `#0f172a`. Technical secondary text uses `#475569`.
- **Semantic Feedback:** Success, Warning, and Danger colors are paired with ultra-soft background tints (e.g., `#f0fdf4` for success) to create accessible, non-aggressive status banners.

## Typography

This design system uses **Plus Jakarta Sans** exclusively to maintain a modern, geometric, and friendly technical feel. 

- **Display & Headlines:** Use heavy weights (800) and tight tracking to create a "punchy" display presence. This is critical for the "Typeform" welcome and step-intro screens.
- **Body & Technical:** Use medium (500) or normal (400) weights with relaxed line heights (1.6x) to ensure technical descriptions remain legible during long reading sessions.
- **Labels & Badges:** Use bold, uppercase styling with generous letter spacing (0.15em) to differentiate metadata from actionable text.

## Layout & Spacing

The layout follows a **Fixed-Width Content Track** nested within a fluid, responsive container. 

- **The Shell:** The application is contained in a 1440px max-width wrapper. On desktop, this often appears as a floating "app" with a 2rem margin from the viewport edges.
- **The Content Canvas:** Interactive elements are restricted to a `max-w-5xl` (approx 1024px) track to prevent eye fatigue across wide monitors.
- **Grid:** A strict 8px-based spacing system governs all margins and gutters. 
- **Rhythm:** Use generous vertical padding (`py-16`) for "Focus Steps" to emulate the airy feel of a premium survey. Desktop layouts often utilize a 2-column split for comparisons, reflowing to a single column on mobile.

## Elevation & Depth

Visual hierarchy is established using a combination of **Tonal Layers** and **Glassmorphism**:

- **Layer 0 (Backdrop):** Deep Navy (`#0f172a`) creates the foundational "protective" layer.
- **Layer 1 (Containers):** The main interactive surface uses pure white with a very soft, diffused shadow (`shadow-xs` or `shadow-sm`) and a 1px border (`#e2e8f0`).
- **Layer 2 (Overlays):** Modals and detail sheets use a semi-transparent slate backdrop (`#0f172a` at 80%) with a `backdrop-blur-sm` (4px to 8px blur) to maintain context while focusing the user.
- **Interactive Focus:** Selected cards or active inputs use a "glow" effect rather than high elevation, achieved through a `2px` primary blue border and a soft blue background tint (`#eff6ff`).

## Shapes

The shape language is consistently **Rounded (Level 2)** to soften the technical nature of the content and make it feel more approachable.

- **Primary Elements:** Buttons and standard cards use a `0.5rem` (8px) radius.
- **Large Containers:** The main app shell and major content cards use `rounded-xl` (1.5rem / 24px) to emphasize the "contained" app-like feel.
- **Micro-elements:** Badges and selection indicators (radios) use "Full" (Pill) rounding to differentiate them from structural containers.

## Components

### Buttons
- **Primary:** Rounded-xl (12px), Royal Blue background, white text. Use a subtle `shadow-lg shadow-accent/25`. Incorporate scale micro-animations on hover (1.02x).
- **Secondary:** Transparent or soft-slate background with a 1px border. Height should be a minimum of 44px (11 units) for touch accessibility.

### Cards & Selection
- **Interactive Cards:** Standard state has a 1px slate border. Active/Selected state transitions to a 2px Royal Blue border with an `#eff6ff` background glow.
- **Radio Indicators:** Custom circular dials (22px diameter). Transition from a muted border to a solid blue fill with a central white dot when active.

### Modals (Detail Sheets)
- **Structure:** Restricted to 85% of viewport height. Uses a sticky footer for primary actions and totals.
- **Glassmorphism:** Apply a backdrop-blur and a semi-transparent dark overlay to the page content behind the modal.

### Feedback & Badges
- **Status Badges:** Small, uppercase labels with 20% opacity backgrounds of their respective semantic color (Success/Warning/Danger).
- **Progress:** Use a horizontal "Dot" or "Segment" indicator in the header to track wizard completion. Active segments should be Primary Blue; inactive should be Muted Slate.
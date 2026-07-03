---
name: ui-ux-pro-max
description: Generate comprehensive design systems, typography pairings, color palettes, and UX guidelines across technology stacks.
allowed-tools:
  - "Read"
  - "Write"
---

# UI/UX Pro Max - Design Intelligence

## Rule Categories by Priority

| Priority | Category | Impact | Domain |
|----------|----------|--------|--------|
| 1 | Accessibility | CRITICAL | `ux` |
| 2 | Touch & Interaction | CRITICAL | `ux` |
| 3 | Performance | HIGH | `ux` |
| 4 | Layout & Responsive | HIGH | `ux` |
| 5 | Typography & Color | MEDIUM | `typography`, `color` |
| 6 | Animation | MEDIUM | `ux` |

## Quick Reference

### 1. Accessibility (CRITICAL)
- `color-contrast` - Minimum 4.5:1 ratio for normal text.
- `focus-states` - Visible focus rings on interactive elements.
- `alt-text` - Descriptive alt text for meaningful images.

### 2. Touch & Interaction (CRITICAL)
- `touch-target-size` - Minimum 44x44px touch targets.
- `hover-vs-tap` - Use click/tap for primary interactions.
- `loading-buttons` - Disable button during async operations.

### 3. Layout & Responsive (HIGH)
- `viewport-meta` - `width=device-width initial-scale=1`.
- `readable-font-size` - Minimum 16px body text on mobile.

## How to Use This Skill

### Step 1: Analyze User Requirements
Extract key details: Product type, style keywords, industry, tech stack.

### Step 2: Generate Design System (REQUIRED)
Always start with searching the design system:
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system
```
Use `--persist` to create a `design-system/MASTER.md` and page-specific files under `design-system/pages/`.
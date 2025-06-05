
# Style Deviation Log - QueueFlow Design System Audit

## Executive Summary
This document catalogs design inconsistencies found across Staff and Admin interfaces that deviate from our design system standards.

## Layout Inconsistencies

### Different Layout Patterns
- **Staff Pages**: Use `SidebarProvider` + `SidebarInset` layout pattern
- **Admin Pages**: Use custom header + main content structure without sidebar provider
- **Issue**: Two different layout architectures for similar admin interfaces

### Hardcoded Spacing
- **StaffSidebar.tsx**: Uses hardcoded spacing (`p-4`, `mb-3`, `p-3`) instead of design tokens
- **AdminSidebar.tsx**: Similar hardcoded spacing patterns
- **AdminPage.tsx**: Uses `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8` - should use layout component

## Color System Deviations

### Mixed Color Approaches
- **Custom BC Colors**: `bg-bc-blue`, `bg-bc-teal` (good - following brand)
- **Hardcoded Tailwind**: `bg-gray-50`, `text-gray-700`, `bg-white` (should use semantic tokens)
- **Inconsistent Semantic Usage**: Some components use `bg-muted` while others use `bg-gray-100`

### Status Color Inconsistencies
- **AppointmentActionButtons.tsx**: Hardcoded colors like `text-green-600`, `text-blue-600`, `text-red-600`
- **Should use**: Semantic tokens like `text-success`, `text-primary`, `text-destructive`

## Typography Inconsistencies

### Heading Hierarchy
- **Staff Pages**: Mix of `text-lg font-semibold` and `text-sm font-medium`
- **Admin Pages**: Different heading patterns (`text-2xl font-bold`)
- **Missing**: Consistent typography scale (h1, h2, h3, etc.)

### Font Weight Variations
- Multiple font weights used inconsistently: `font-semibold`, `font-medium`, `font-bold`
- **Should use**: Standardized typography components or classes

## Component Duplication

### Sidebar Components
- **StaffSidebar.tsx** (219 lines) - Getting too long
- **AdminSidebar.tsx** (247 lines) - Getting too long  
- **EmployeeSidebar.tsx** - Third variant
- **Issue**: No shared base sidebar component

### Card Patterns
- Multiple card implementations without shared base
- Inconsistent padding and styling across similar components

### Button Variations
- Mixed button variants and styling approaches
- Some use shadcn/ui Button, others have custom styling

## Responsive Design Gaps

### Breakpoint Inconsistencies
- **AdminPage.tsx**: Uses `sm:px-6 lg:px-8` pattern
- **StaffMainContent.tsx**: Different responsive approach
- **Missing**: Consistent responsive grid system

## Icon Usage

### Icon Size Inconsistencies
- Mix of `h-4 w-4`, `h-5 w-5` without systematic approach
- **Should use**: Standardized icon size tokens

## Specific File Issues

### src/components/admin/AdminPage.tsx
- **Layout**: Custom layout instead of shared component
- **Spacing**: Hardcoded container classes
- **Structure**: Should use consistent page wrapper

### src/components/staff/StaffMainContent.tsx
- **Conditional Rendering**: Complex conditional header rendering
- **Layout**: Inconsistent with admin page structure

### src/components/layout/StaffSidebar.tsx
- **Length**: 219 lines - needs refactoring
- **Spacing**: Hardcoded padding values
- **Colors**: Mix of semantic and hardcoded colors

### src/components/layout/AdminSidebar.tsx
- **Length**: 247 lines - needs refactoring
- **Duplication**: Similar structure to StaffSidebar
- **Styling**: Inconsistent with staff sidebar approach

### src/components/staff/AppointmentActionButtons.tsx
- **Length**: 233 lines - needs refactoring
- **Colors**: Hardcoded status colors
- **Structure**: Complex component that could be split

## Design Token Gaps

### Missing Semantic Tokens
- No semantic color tokens for status states
- Missing typography scale definitions
- No spacing scale beyond Tailwind defaults
- No component-specific design tokens

### Inconsistent Token Usage
- Some components use design tokens, others use hardcoded values
- Mixed approach to color semantics

## Priority Issues for Immediate Fix

1. **High Priority**: Create shared layout component for Admin/Staff pages
2. **High Priority**: Refactor oversized sidebar components (219+ lines)
3. **Medium Priority**: Standardize color usage with semantic tokens
4. **Medium Priority**: Create shared card and button components
5. **Low Priority**: Establish consistent typography scale

## Recommendations

1. Create `src/components/layout/AppLayout.tsx` for shared page structure
2. Create `src/components/layout/BaseSidebar.tsx` for shared sidebar logic
3. Add semantic color tokens to `tailwind.config.js`
4. Establish typography component system
5. Create design token documentation



# Design System Consistency Checklist

## Layout & Structure
- [x] AdminPage.tsx - Create shared AppLayout component -> Use consistent page wrapper
- [x] StaffMainContent.tsx - Unify layout pattern -> Use same layout system as Admin
- [x] Create src/components/layout/AppLayout.tsx -> Shared page layout component

## Sidebar Components (Oversized - Need Refactoring)
- [ ] StaffSidebar.tsx (219 lines) - Extract reusable components -> Create BaseSidebar + SidebarSection components
- [ ] AdminSidebar.tsx (247 lines) - Extract reusable components -> Create BaseSidebar + SidebarSection components  
- [ ] Create src/components/layout/BaseSidebar.tsx -> Shared sidebar foundation

## Color System Standardization
- [ ] StaffSidebar.tsx - Replace hardcoded colors -> Use semantic tokens (bg-muted, text-muted-foreground)
- [ ] AdminSidebar.tsx - Replace hardcoded colors -> Use semantic tokens
- [ ] AppointmentActionButtons.tsx - Replace status colors -> Use semantic tokens (text-success, text-destructive)
- [ ] AdminTopNavigation.tsx - Standardize button colors -> Use consistent variant system

## Spacing & Layout Tokens
- [ ] AdminPage.tsx - Replace hardcoded container -> Use layout component with standard spacing
- [ ] StaffSidebar.tsx - Replace hardcoded padding -> Use design token classes (space-y-6, p-6)
- [ ] AdminSidebar.tsx - Replace hardcoded padding -> Use design token classes

## Component Refactoring (Oversized Files)
- [ ] AppointmentActionButtons.tsx (233 lines) - Split into smaller components -> Create ActionButton + ActionDropdown components
- [ ] StaffSidebar.tsx - Create SidebarNavGroup component -> Extract navigation group logic
- [ ] AdminSidebar.tsx - Create SidebarNavGroup component -> Extract navigation group logic

## Typography Consistency  
- [ ] Create typography component system -> Add Heading, Text, Caption components
- [ ] StaffSidebar.tsx - Use typography components -> Replace hardcoded text classes
- [ ] AdminSidebar.tsx - Use typography components -> Replace hardcoded text classes
- [ ] AdminPage.tsx - Standardize heading hierarchy -> Use typography components

## Button & Interactive Elements
- [ ] Create consistent button variant system -> Extend shadcn/ui Button with custom variants
- [ ] AdminTopNavigation.tsx - Standardize button usage -> Use consistent Button variants
- [ ] Sidebar components - Standardize menu buttons -> Use consistent SidebarMenuButton styling

## Card & Container Components
- [ ] Create shared card component variants -> Extend shadcn/ui Card with app-specific variants
- [ ] Replace custom card implementations -> Use standardized card components

## Design Token Implementation
- [ ] Add semantic color tokens to tailwind.config.js -> Define success, warning, info color scales
- [ ] Add typography scale tokens -> Define heading and text size scales  
- [ ] Add spacing scale tokens -> Define consistent spacing values
- [ ] Create component design tokens -> Define component-specific styling tokens

## Responsive Design
- [ ] Create responsive layout mixins -> Standardize breakpoint usage
- [ ] AdminPage.tsx - Use responsive layout system -> Apply consistent responsive patterns
- [ ] Sidebar components - Improve mobile responsiveness -> Use responsive design tokens

## Icon System
- [ ] Standardize icon sizes -> Create icon size design tokens (sm, md, lg)
- [ ] Create icon component wrapper -> Ensure consistent icon usage across app

## Documentation
- [ ] Create design system documentation -> Document all tokens and components
- [ ] Add component usage examples -> Provide implementation guidance
- [ ] Create design system Storybook stories -> Visual component documentation

## Testing & Quality
- [ ] Add design system tests -> Ensure consistency is maintained
- [ ] Create visual regression tests -> Prevent design inconsistencies
- [ ] Add ESLint rules for design system -> Enforce token usage

---

**Total Items**: 31
**Completed**: 3
**Remaining**: 28

**Next Priority**: Continue with sidebar component refactoring to create shared BaseSidebar component.


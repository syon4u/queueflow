
# QueueFlow Staff/Admin Redundancy Refactor Progress

**Audit Date:** 2025-06-05  
**Branch:** `feature/redundancy-refactor`  
**Mission:** Remove all Staff/Admin redundancies while preserving 100% existing functionality

## Task Checklist

### Component Consolidation
- [ ] Merge StaffTab and EmployeeTab components – Both manage user profiles with similar CRUD operations
- [ ] Consolidate StaffSidebar and EmployeeSidebar – Nearly identical navigation structures
- [ ] Unify StaffFormDialog and EmployeeFormDialog – Same form fields and validation logic
- [ ] Merge StaffTableColumns and EmployeeTableColumns – Similar column definitions with role differences

### Hook Consolidation  
- [ ] Consolidate use-staff-management and use-employee-management – Duplicate profile management logic
- [ ] Merge use-profile-management functionality – Central profile operations for both roles
- [ ] Unify employee-management hooks – Reduce hook fragmentation in admin/employee-management folder

### Route and Page Optimization
- [ ] Consolidate StaffPage and employee routes – Single interface with role-based access control
- [ ] Merge AdminPage staff/employee tabs – Unified user management interface
- [ ] Optimize App.tsx routing – Remove duplicate staff/employee route handling

### Shared Component Creation
- [ ] Create UserManagementTable component – Shared table for staff/employee data display
- [ ] Create UserFormDialog component – Unified form for staff/employee creation/editing  
- [ ] Create UserSidebar component – Role-aware navigation sidebar
- [ ] Create RoleBasedAccess component – Centralized RBAC logic

### Data Layer Optimization
- [ ] Unify profile queries – Single hook for staff/employee data fetching
- [ ] Consolidate mutation operations – Shared create/update/delete logic
- [ ] Optimize form state management – Single form state hook for user management

### Configuration and Types
- [ ] Create unified user management types – Consolidate staff/employee interfaces
- [ ] Add role-based component props – Enable dynamic behavior based on user role
- [ ] Update navigation configurations – Single config with role-based filtering

## Completion Criteria
- [ ] All redundant components removed
- [ ] All tests passing (Jest + Cypress)
- [ ] ESLint + TypeScript checks clean
- [ ] Performance regression test passed
- [ ] Accessibility audit passed
- [ ] Final report generated

---
**Status:** 🚧 In Progress | **Completed:** 0/16 | **Remaining:** 16

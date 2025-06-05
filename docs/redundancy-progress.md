
# QueueFlow Staff/Admin Redundancy Refactor Progress

**Audit Date:** 2025-06-05  
**Branch:** `feature/redundancy-refactor`  
**Mission:** Remove all Staff/Admin redundancies while preserving 100% existing functionality

## Task Checklist

### Component Consolidation
- [x] Merge StaffTab and EmployeeTab components – Created unified UserManagementTab with role-based props
- [x] Consolidate StaffSidebar and EmployeeSidebar – Created shared UserSidebar component with userType prop
- [x] Unify StaffFormDialog and EmployeeFormDialog – Enhanced UserFormDialog with status field support for employees
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
- [x] Create UserManagementTable component – Shared table for staff/employee data display
- [x] Create UserFormDialog component – Unified form for staff/employee creation/editing  
- [x] Create UserSidebar component – Role-aware navigation sidebar
- [ ] Create RoleBasedAccess component – Centralized RBAC logic

### Data Layer Optimization
- [x] Unify profile queries – Single hook for staff/employee data fetching
- [x] Consolidate mutation operations – Shared create/update/delete logic
- [x] Optimize form state management – Single form state hook for user management

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
**Status:** 🚧 In Progress | **Completed:** 11/16 | **Remaining:** 5

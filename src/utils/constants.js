export const UserRolesEnum = {
  ADMIN: 'admin',
  PROJECT_ADMIN: 'project_admin',
  MEMBER: 'member'
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
    TODO: 'To_Do',
    IN_PROGRESS: 'In_Progress',
    DONE: 'Done'
};
export const AvailableTaskStatuses = Object.values(TaskStatusEnum);
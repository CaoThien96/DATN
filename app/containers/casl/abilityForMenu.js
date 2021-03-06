import { AbilityBuilder } from '@casl/ability';

/**
 * Defines how to detect object's type: https://stalniy.github.io/casl/abilities/2017/07/20/define-abilities.html
 */
function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }

  return item.__type;
}
export default function defineAbilitiesFor(user) {
  return AbilityBuilder.define((can, cannot) => {
    if (user.role === 1001) {
      // Quan tri
      can(
        [
          'admin-dashboard',
          'admin-employee',
          'admin-notification',
          'admin-request',
          'admin-config',
          'admin-checker',
          'admin-configuration',
          'admin-test',
          'admin-configuration-model',
          'admin-user',
          'admin-user-change-password'
        ],
        'Menu',
      );
    } else if (user.role === 1000) {
      // Nhan vien
      can(['admin-notification', 'admin-request','admin-dashboard-employee','admin-test','admin-user'], 'Menu');
    } else if (user.role === 1002) {
      // Giam sat vien
      can(['admin-configuration','admin-configuration-model', 'admin-checker','admin-employee'], 'Menu');
    }
  });
}

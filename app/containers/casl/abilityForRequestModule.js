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
      can(['read', 'handle', 'comment'], 'Request');
    } else if (user.role === 1000) {
      can(['read', 'create'], 'Request');
    }
  });
}


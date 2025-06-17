import path from 'node:path';
import type { RspressPlugin } from '@rspress/shared';

export function authPlugin(): RspressPlugin {
  return {
    name: 'auth-plugin',
    globalUIComponents: [path.join(__dirname, 'AuthGuard.tsx')],
  };
}

import { RspressPlugin } from '@rspress/shared';
import path from 'path';

export function authPlugin(): RspressPlugin {
  return {
    name: 'auth-plugin',
    globalUIComponents: [path.join(__dirname, 'AuthGuard.tsx')]
  };
}

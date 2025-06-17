import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  ssg: false,
  root: path.join(__dirname, 'docs'),
  title: 'Cheese Library',
  // icon: '/rspress-icon.png',
  // logo: {
  //   light: '/rspress-light-logo.png',
  //   dark: '/rspress-dark-logo.png',
  // },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/web-infra-dev/rspress',
      },
    ],
  },
  builderConfig: {
    html: {
      meta: {
        robots: 'noindex, nofollow',
      },
    },
  },
});

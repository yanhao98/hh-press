// 路由认证配置文件
export interface RouteAuthConfig {
  password: string;
  redirectUrl: string;
  title?: string;
  description?: string;
}

// 配置需要保护的路由
export const authConfig: Record<string, RouteAuthConfig> = {
  '/gadgets/Burrata.html': {
    password: 'cheese2024',
    redirectUrl: '/gadgets/Burrata.html',
    title: '🧀 Burrata 页面访问受限',
    description: '此页面包含特殊内容，需要密码才能访问。'
  },
  // 可以在这里添加更多受保护的路由
  // '/secret-page.html': {
  //   password: 'my-secret-password',
  //   redirectUrl: '/secret-page.html',
  //   title: '🔐 秘密页面',
  //   description: '这是一个需要特殊权限的页面。'
  // },
};

// 密码提示（用于开发和测试）
export const passwordHints: Record<string, string> = {
  '/gadgets/Burrata.html': 'hint: cheese + year',
};

export default authConfig;

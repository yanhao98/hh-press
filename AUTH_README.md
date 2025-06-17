# RSPress 路由拦截认证功能 🔐

## 功能说明

此功能为 RSPress 添加了自定义路由拦截，用于保护特定页面的访问。当用户尝试访问受保护的页面时，系统会弹出密码验证对话框。

## 实现文件结构

```
plugins/
├── auth-plugin.ts      # 认证插件主文件
├── auth-config.ts      # 路由保护配置文件
└── AuthGuard.tsx       # 认证守卫组件
types/
└── virtual-modules.d.ts # TypeScript 类型声明
rspress.config.ts       # 已更新的配置文件
```

## 核心实现

### 1. 认证插件 (`plugins/auth-plugin.ts`)

```typescript
import { RspressPlugin } from '@rspress/shared';
import path from 'path';

export function authPlugin(): RspressPlugin {
  return {
    name: 'auth-plugin',
    globalUIComponents: [path.join(__dirname, 'AuthGuard.tsx')]
  };
}
```

### 2. 路由配置 (`plugins/auth-config.ts`)

```typescript
export interface RouteAuthConfig {
  password: string;
  redirectUrl: string;
  title?: string;
  description?: string;
}

export const authConfig: Record<string, RouteAuthConfig> = {
  '/gadgets/Burrata.html': {
    password: 'cheese2024',
    redirectUrl: '/gadgets/Burrata.html',
    title: '🧀 Burrata 页面访问受限',
    description: '此页面包含特殊内容，需要密码才能访问。'
  }
};

export const passwordHints: Record<string, string> = {
  '/gadgets/Burrata.html': 'hint: cheese + year',
};
```

### 3. 认证守卫组件 (`plugins/AuthGuard.tsx`)

核心功能：
- ✅ 检测当前路由是否需要保护
- ✅ 显示自定义密码输入对话框
- ✅ 验证用户输入的密码
- ✅ 管理认证状态（使用 sessionStorage）
- ✅ 隐藏/显示页面内容
- ✅ 支持自定义标题、描述和密码提示

## 使用方法

### 启动和测试

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **测试功能**：
   - 访问 http://localhost:3000/test.html（测试页面）
   - 点击 "访问 Burrata 页面" 链接
   - 输入密码 `cheese2024` 来访问页面

### 访问受保护页面

1. 直接访问 http://localhost:3000/gadgets/Burrata.html
2. 输入密码 `cheese2024`
3. 认证成功后，在当前会话中将保持登录状态

## 功能特点

- ✅ **路由级别的访问控制** - 精确控制哪些页面需要密码
- ✅ **密码验证机制** - 安全的密码验证
- ✅ **会话状态保持** - 验证后在当前会话中保持登录
- ✅ **优雅的用户界面** - 美观的模态对话框
- ✅ **支持多个受保护路由** - 可配置多个不同的受保护页面
- ✅ **可配置的密码和重定向URL** - 灵活的配置选项
- ✅ **自定义标题和描述** - 为不同页面定制提示信息
- ✅ **密码提示功能** - 可选的密码提示帮助用户

## 扩展配置

### 添加新的受保护路由

在 `plugins/auth-config.ts` 中添加新的条目：

```typescript
export const authConfig: Record<string, RouteAuthConfig> = {
  '/gadgets/Burrata.html': {
    password: 'cheese2024',
    redirectUrl: '/gadgets/Burrata.html',
    title: '🧀 Burrata 页面访问受限',
    description: '此页面包含特殊内容，需要密码才能访问。'
  },
  // 添加新的受保护路由
  '/secret-docs.html': {
    password: 'my-secret-2024',
    redirectUrl: '/secret-docs.html',
    title: '🔐 机密文档',
    description: '此文档包含机密信息，需要特殊权限访问。'
  }
};

// 为新路由添加密码提示
export const passwordHints: Record<string, string> = {
  '/gadgets/Burrata.html': 'hint: cheese + year',
  '/secret-docs.html': 'hint: my-secret + year'
};
```

### 自定义样式

你可以在 `AuthGuard.tsx` 中修改样式配置来匹配你的网站主题。

### 安全性考虑

- 密码以明文形式存储在客户端代码中，这种方法适用于简单的内容保护
- 对于真正的安全需求，建议使用服务器端认证
- 当前实现主要用于防止偶然访问，而非安全防护

## 技术实现细节

1. **插件系统**：使用 RSPress 的插件 API 来注册全局组件
2. **路由检测**：使用 `react-router-dom` 的 `useLocation` hook 来监听路由变化
3. **DOM 操作**：通过 JavaScript 直接操作 DOM 来隐藏/显示页面内容
4. **状态管理**：使用 React hooks 和 sessionStorage 来管理认证状态
5. **TypeScript 支持**：完整的类型定义和类型安全

## 故障排除

### 常见问题

1. **页面内容仍然可见**：
   - 检查 DOM 选择器 `.rspress-doc` 是否正确
   - 确认组件正确加载

2. **密码验证失败**：
   - 检查 `auth-config.ts` 中的密码配置
   - 确认路由路径匹配正确

3. **组件未加载**：
   - 检查插件是否正确注册在 `rspress.config.ts` 中
   - 查看开发者工具的控制台错误信息

### 开发模式调试

在开发模式下，你可以：
- 打开浏览器开发者工具查看控制台日志
- 检查 sessionStorage 中的认证状态
- 查看网络请求确认组件正确加载

---

## 完成状态

✅ **实现完成！** 

你现在可以：
1. 启动开发服务器：`npm run dev`
2. 访问 http://localhost:3000/gadgets/Burrata.html
3. 输入密码 `cheese2024` 来测试功能

功能已经成功集成到你的 RSPress 项目中，可以正常使用了！

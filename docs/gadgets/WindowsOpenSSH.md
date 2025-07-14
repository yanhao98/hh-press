# Windows OpenSSH 配置指南

## Windows 安装 OpenSSH 服务器

### 在线安装
设置 - 应用 - 可选功能 - 添加功能 - OpenSSH 服务器

### 离线安装
1. [下载离线包](https://github.com/PowerShell/Win32-OpenSSH/releases)
2. OpenSSH-Win64.zip 解压到 `C:\Program Files\OpenSSH` 目录
3. PowerShell (管理员) 执行 `powershell.exe -ExecutionPolicy Bypass -File install-sshd.ps1`

### 启动
```powershell
PS C:\Users\Administrator> net start sshd
OpenSSH SSH Server 服务正在启动 ..
OpenSSH SSH Server 服务已经启动成功。
```

### 开机自启
```powershell
Set-Service sshd -StartupType Automatic
```

## Windows 配置公钥

### 管理员用户配置（推荐）

由于 Windows OpenSSH 默认配置下，管理员组用户需要将公钥放在全局文件中：

```powershell
# 确保 ProgramData\ssh 目录存在
New-Item -Path "C:\ProgramData\ssh" -ItemType Directory -Force

# 添加公钥到管理员专用的 authorized_keys 文件
Add-Content "C:\ProgramData\ssh\administrators_authorized_keys" -Value "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDi6fLhEYp2mmUUBOB/6CA0iQYcwhAUVBwpbJJhK0fZmvmtrCrfkDvFtqw4WH0D/DgRtJNyoDfrQ2gm67FtFzu2ZfH0PtIEI6JWrh432qjQnAT5cuKbN3ghrjTHf08vjh0axxilSFtCXf5Gyv+ZnABil7GZAhJB5K/yBUMr6OD5fp4tvjAYe0t6ZIQb8vgd0dCXDGA3Rak1B7W24vDA1Col+Qvx5I7pfqiebkof7BbkfBYX5KZ/ArK0n1RV7wBjf6g/XkwRPvpCR5rz7s+UnMr2FFYqfQ1wkpKjo74KzAahFyy7UicM3e7OKfZvd8EmWBysIdKCcl9s/H9Z4Q/TDZsmnr68KweCvpqFVHfKS9CZ/7w/7zQhrXDhnysqt6nmp/moQLMax6b62++4X6E0gyopc2nlMT+QjIwRPl+DPC2UicWniOSAuSvpPxt8YXF4Zbpsg0efMQvHDrjQF6Ws9UIKVQeTBqij+TJ3w5aUbLEjPhrP5ia7Dtn7u/3IsosxW00= yanhao@yanhaodeMacBook-Pro.local"

# 设置正确的文件权限（仅管理员和系统可访问）
icacls "C:\ProgramData\ssh\administrators_authorized_keys" /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

### 普通用户配置（备选方案）

如果是普通用户或希望每个管理员账号使用独立密钥，可以使用用户目录：

```powershell
# 确保 .ssh 目录存在
New-Item -Path "$HOME\.ssh" -ItemType Directory -Force

# 强制删除旧的 authorized_keys 文件
Remove-Item "$HOME\.ssh\authorized_keys" -Force -ErrorAction SilentlyContinue

# 添加公钥到用户的 authorized_keys 文件
Add-Content "$HOME\.ssh\authorized_keys" -Value "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDi6fLhEYp2mmUUBOB/6CA0iQYcwhAUVBwpbJJhK0fZmvmtrCrfkDvFtqw4WH0D/DgRtJNyoDfrQ2gm67FtFzu2ZfH0PtIEI6JWrh432qjQnAT5cuKbN3ghrjTHf08vjh0axxilSFtCXf5Gyv+ZnABil7GZAhJB5K/yBUMr6OD5fp4tvjAYe0t6ZIQb8vgd0dCXDGA3Rak1B7W24vDA1Col+Qvx5I7pfqiebkof7BbkfBYX5KZ/ArK0n1RV7wBjf6g/XkwRPvpCR5rz7s+UnMr2FFYqfQ1wkpKjo74KzAahFyy7UicM3e7OKfZvd8EmWBysIdKCcl9s/H9Z4Q/TDZsmnr68KweCvpqFVHfKS9CZ/7w/7zQhrXDhnysqt6nmp/moQLMax6b62++4X6E0gyopc2nlMT+QjIwRPl+DPC2UicWniOSAuSvpPxt8YXF4Zbpsg0efMQvHDrjQF6Ws9UIKVQeTBqij+TJ3w5aUbLEjPhrP5ia7Dtn7u/3IsosxW00= yanhao@yanhaodeMacBook-Pro.local"

# 设置正确的文件权限
icacls "$HOME\.ssh\authorized_keys" /inheritance:r /grant "$env:USERNAME:F"
```

**注意**：使用普通用户配置时，需要注释掉 `sshd_config` 中的管理员组配置。

### `C:\ProgramData\ssh\sshd_config` 文件:
* 在文件末尾，这两行：
  ```
  Match Group administrators
          AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
  ```
  这段配置的意思是：
  **如果登录的用户（`yanhao`）属于 `administrators` (管理员) 组，那么就【不要】去他自己的 `C:\Users\yanhao\.ssh\authorized_keys` 文件里找密钥了，而是要去一个全局的、所有管理员共用的文件 `C:\ProgramData\ssh\administrators_authorized_keys` 里去找。**

## 测试连接

### 检查 SSH 服务状态

```zsh
ssh administrator@10.9.9.12 'netstat -ano | findstr ":22"'
```

这个命令可以远程检查目标主机的 SSH 端口（22）是否正在监听。

### 建立连接

```zsh
ssh -vvv -o StrictHostKeyChecking=accept-new administrator@10.9.9.12
```

**参数说明**：
- `-vvv`：启用最高级别的详细输出（verbose），显示 SSH 连接的详细调试信息，包括：
  - 密钥交换过程
  - 认证方式尝试
  - 连接建立的每个步骤
  - 错误诊断信息
- `-o StrictHostKeyChecking=accept-new`：自动接受新主机的密钥指纹，避免首次连接时的手动确认

## 命令

### 重启 SSH 服务

```powershell
Restart-Service sshd
```

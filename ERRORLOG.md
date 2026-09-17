# 🧯 ERRORLOG · 错误日志

> **记录规则**：每条错误回答四问——**现象、根因、修复、知识点**。
> 编号递增（ERR-001…），面试前通读一遍就是最好的复习资料。
> 排错第一反应：**看终端，不是浏览器**。

---

## 2026-09-16 · Day 1

### ERR-001 · 忘记 `res.end()`，请求永远挂起

- **现象**：浏览器访问 `/health` 一直转圈；`curl -i` 等待后超时（exit 28 = 无任何响应）
- **根因**：`res.end()` 被注释掉，响应没有结束信号，HTTP 连接一直保持打开
- **修复**：每个路由分支必须保证走到 `res.end()`
- **知识点**：一次完整响应 = 写头 + 写体 + `end()` 结束信号，缺一不可。反面应用：大模型流式输出就是故意不 `end`、持续 `write`——同一个特性的两面

### ERR-002 · HTTP 响应头名写错：`contentType`

- **现象**：`/health` 返回的 JSON 被浏览器当纯文本显示
- **根因**：裸 HTTP 头名是 kebab-case（`Content-Type`）；`contentType` 是 axios 等前端库的包装写法，HTTP 层不认识
- **修复**：`res.writeHead(200, { "Content-Type": "application/json" })`
- **知识点**：`curl.exe -i` 直接查看真实响应头，是验证这类问题的最快手段

### ERR-003 · 路由分支不互斥 → `ERR_HTTP_HEADERS_SENT` → 整个进程崩溃

**报错原文：**

```text
Error [ERR_HTTP_HEADERS_SENT]: Cannot write headers after they are sent to the client
```

- **现象**：访问 `/` 浏览器正常显示 hello，服务却悄悄崩了，第二次刷新才"感觉"出事
- **根因**：两个 `if` 是独立语句、不互斥——`/` 先被第一个 if 响应完，又掉进第二个 if 的 `else` 里再次 `writeHead`。而**响应头只能发送一次**（`write` 可以多次，`writeHead`/`end` 各只有一次）
- **修复**：路由写成 `if / else if / else` 完整链，保证一个请求从头到尾只被一个分支处理
- **知识点**：
  - 浏览器 JS 报错只挂一个页面；服务端未捕获异常**挂掉整个服务**——所以 Day 3 要学全局错误中间件
  - "响应已发出" ≠ "处理已安全结束"，发完照样能闯祸
  - 后端排错看终端日志，浏览器只告诉你它收到了什么

### ERR-004 · PowerShell 里的 `curl` 不是真 curl

- **现象**：`curl -i http://...` 报"找不到驱动器。名为 http 的驱动器不存在"
- **根因**：PowerShell 的 `curl` 是 `Invoke-WebRequest` 的别名，不认识真 curl 的参数格式
- **修复**：显式写 `curl.exe -i http://...`，或去 Git Bash 里执行
- **知识点**：网上教程里的 curl 命令都是真 curl 语法，Windows 上养成写 `curl.exe` 的习惯

### ERR-005 · `docker exec` 容器名打错，SQL 敲在了 PowerShell 里

- **现象**：`No such container: mysql-metting`；接着 `SHOW DATABASES` 报"无法将 SHOW 项识别为 cmdlet"
- **根因**：容器实名 `mysql-meeting`（多打了一个 t）；exec 失败根本没进 mysql 客户端，SQL 语句就落在了 PowerShell 里
- **修复**：用 `docker ps` 的 NAMES 列对照正确容器名
- **知识点**：报错信息里已经写明了它找不到的名字——**先读报错再动手**；看到"无法将 xxx 识别为 cmdlet"，第一反应应是"我可能不在我以为的那个程序里"

### ERR-006 · 中间件漏调next()

- **现象**：服务全部挂起
- **根因**：没有再中间件调用netx()，导致代码没法往下执行
- **修复**：再express.use回调里面执行next();
- **知识点**：养成写中间件就调用next()的习惯，执行顺序是`start` 记时间戳 → `next()`（路由在这行里跑完）→ 算差值并打印。

### ERR-007 · 运行时依赖装进devDependencies

- **现象**：会导致后续镜像启动崩溃
- **根因**：没有把express安装进dependencies，dependencies是生产环境也要跑的依赖
- **修复**：把express安装进dependencies
- **知识点**：`--save` 默认进 dependencies,`-D` 才进 dev;Docker 镜像里 `npm ci --omit=dev` 只装生产依赖

### ERR-008 · SQL注入原理为什么execute能防，query不能防

- **现象**：使用db.query()的话，用户拼接一个' OR '1'='1会让整体SQL变成WHERE name = '' OR '1'='1'，这样就变成查全表了。
- **根因**：拼接让用户输入混进 SQL 文本，数据变成了代码
- **修复**：使用db.execute()
- **知识点**：execute会先预处理带？的SQL语句，并进行结构化，然后再将参数放到对应值上面，这样就不会被当作代码执行

### ERR-009 · REST资源导向设计(为什么是PUT /api/rooms/:id 而不是post /api/updateRoom)

- **现象**：思考题答非所问,误以为 PUT 的好处是"不用写 body"(实际 PUT 就带 body)
- **根因**：没建立"URL = 资源地址(名词),HTTP 方法 = 动作"的模型,停留在"URL 是要调用的函数名"的 RPC 思维
- **修复**：/api/rooms/5 表示"5 号会议室这个资源"——GET 读它、PUT 整体替换它、DELETE 删它、POST 到 /api/rooms 新建;动作写在方法里,不写在 URL 里
- **知识点**：方法自带语义红利:PUT/DELETE 幂等、GET 可缓存,网关/代理能按语义工作;404 统一表示"资源不存在";id 放路径(标识哪个资源),修改内容放 body

### ERR-010 · 实验代码及时清理

- **现象**：验证运行代码爆炸
- **根因**：没有及时清理测试的代码，并且后续也没有验证，导致验收的时候直接爆炸
- **修复**：清理多余的**`await db.query()`** 代码
- **知识点**：养成实验代码实验完毕一定要马上清楚的习惯

---

## 📋 新条目模板（复制这段，往下追加）

```markdown
### ERR-0XX · 一句话标题

- **现象**：
- **根因**：
- **修复**：
- **知识点**：
```

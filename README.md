# meeting-room-booking · 会议室预约系统

一个全栈练习项目：会议室的查询、预约、时间冲突校验与取消，支持多用户登录。

## 技术栈

- 后端：Node.js + Express 5 + mysql2 + zod + MySQL 8
- 前端：Vue3 + Element Plus
- 基础设施：Docker / Docker Compose、Nginx

## 目录结构

```
meeting-room/
├── server.js                 # 入口:装配中间件、挂路由、监听端口
├── .env                      # 环境变量(不进 git)
├── .env.example              # 环境变量模板(进 git)
├── sql/init.sql              # 建表 + 种子数据(重灌即可复原)
└── src/
    ├── routes/               # 接线层:URL + 方法 → controller
    ├── controllers/          # 协议层:取参、zod 校验、状态码与响应
    ├── services/             # 业务层:业务规则(不碰 req/res)
    ├── models/               # 数据层:SQL 与连接池(不知道 HTTP 的存在)
    ├── middlewares/          # 横切关注点:日志 / 404 / 全局错误
    └── utils/                # 纯工具:统一响应格式 {code, data, message}
```

依赖只能单向流动:routes → controllers → services → models。

## 功能规划

- [x] 项目初始化
- [ ] 用户注册 / 登录（JWT 鉴权）
- [ ] 会议室管理（CRUD + 权限控制）
- [ ] 会议室预约与时间冲突校验（事务 + 锁）
- [ ] 我的预约（分页 / 取消）
- [ ] Docker Compose 一键启动
- [ ] 前端界面
- [ ] 部署上线

## 本地启动

```powershell
# 1. MySQL 容器(首次)
docker run -d --name mysql-meeting -p 3306:3306 -e MYSQL_ROOT_PASSWORD=你的密码 -e MYSQL_DATABASE=meeting_room mysql:8

# 2. 建表 + 种子数据
Get-Content -Encoding UTF8 sql/init.sql | docker exec -i mysql-meeting mysql -uroot -p你的密码 meeting_room

# 3. 配置:复制 .env.example 为 .env,填入真实连接信息

# 4. 安装依赖并启动(nodemon 热重启)
npm install
npm run dev
```

接口基准地址:http://localhost:3000(Git Bash 下第 2 步可写 `docker exec -i mysql-meeting mysql -uroot -p你的密码 meeting_room < sql/init.sql`)

## 学习过程

- [ERRORLOG.md](./ERRORLOG.md) · 开发过程中的错误记录与复盘（每个错误：现象 / 根因 / 修复 / 知识点）

## 接口文档

（TODO：随开发补充）
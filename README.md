# Vue JSON Render Monorepo

This is a monorepo project using pnpm workspaces.

## Projects

- **api**: Node.js + Express + Prisma (SQLite) backend.
- **render**: Vue 3 frontend for users.
- **workbench**: Vue 3 frontend for admins.
- **shared**: Shared TypeScript types.

## Setup

1.  Install dependencies:
    ```bash
    pnpm install
    ```

2.  Initialize Database (SQLite):
    ```bash
    cd packages/api
    npx prisma generate
    npx prisma migrate dev --name init
    ```
    (This has already been done during setup)

3.  Build Shared Library:
    ```bash
    pnpm --filter shared build
    ```

## Running the Project

You can run each project in separate terminals:

### API Server (Port 3000)
```bash
pnpm --filter api dev
```
*Default Admin Credentials:* `admin` / `123456` (Created on first login)
*Default User Credentials:* `user` / `123456` (Created on first login)

### Workbench (Admin) (Port 3002)
```bash
pnpm --filter workbench dev
```

### Render (User) (Port 3001)
```bash
pnpm --filter render dev
```

## Features

- **API**:
    - Admin Login (`POST /admin/login`)
    - User Login (`POST /user/login`)
    - Activity Management (CRUD)
    - User Info & Activity Query
- **Workbench**:
    - Admin Login
    - Activity List & Edit
- **Render**:
    - User Login
    - User Info Display
    - Activity Config Query

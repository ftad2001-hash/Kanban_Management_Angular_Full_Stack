# TaskFlow — Frontend

Angular 21 frontend for the TaskFlow multi-board Kanban application.
Connects to a Spring Boot backend running on `http://localhost:8080`.

## Prerequisites

- Node.js 20+
- Angular CLI 21 (`npm install -g @angular/cli`)
- Spring Boot backend running on port 8080
- MySQL `taskflow_db` database running

## Setup

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start the dev server
ng serve

# 3. Open in browser
# http://localhost:4200
```

## Routes

| URL | Page |
|-----|------|
| `/boards` | Board list — create and manage boards |
| `/boards/:id` | Board detail — Kanban columns with drag-and-drop |
| `/boards/:id/tasks/new` | Create task form |
| `/boards/:id/tasks/:taskId/edit` | Edit task form |

## API

All calls go to `http://localhost:8080/api/v1`. Configured in `src/environments/environment.ts`.

## Architecture

```
src/app/
├── models/
│   └── board.model.ts              # Board, Column, Task interfaces (matches backend DTOs)
├── core/
│   ├── services/
│   │   ├── board.service.ts        # GET/POST/DELETE /api/v1/boards
│   │   ├── task.service.ts         # POST/PUT/PATCH/DELETE /api/v1/tasks
│   │   └── toast.service.ts        # ngx-toastr facade
│   └── directives/
│       └── flatpickr.directive.ts  # ControlValueAccessor wrapping flatpickr
├── components/
│   └── navbar/                     # Fixed top navbar with "All Boards" link
├── features/
│   ├── board-list/                 # /boards — board grid + create form
│   │   └── board-card/             # Individual board card
│   ├── board-detail/               # /boards/:id — Kanban view
│   │   └── column/                 # CDK drop list column
│   │       └── task-card/          # Draggable task card (edit/delete)
│   └── task-form/                  # /boards/:id/tasks/new + /edit
├── app.routes.ts                   # Route definitions
├── app.config.ts                   # provideHttpClient, provideToastr, provideAnimations
└── environments/
    └── environment.ts              # API base URL
```

## Key Libraries

| Library | Purpose |
|---------|---------|
| `@angular/cdk` | Drag-and-drop between columns |
| `ngx-toastr` | Toast notifications (success/error) |
| `flatpickr` | Date picker on task form |

# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Petti - 반려견 보행 분석 (Mobile App)
- **Type**: Expo (React Native)
- **Path**: `artifacts/petti/`
- **Preview**: `/` (root)
- **Description**: 견주용 반려견 보행 분석 앱. 목업 데이터로 동작하며 실제 API 연결 준비됨.
- **Screens**: 홈, 카메라, 기록, 프로필
- **Mock data**: `artifacts/petti/data/mockData.ts`
- **Design tokens**: `artifacts/petti/constants/colors.ts`

#### Future API Integration (Base URL: https://api.petti.vet/v1)
- `GET /guardian/summary?pet_id={id}` → 홈 요약
- `POST /guardian/videos/upload` → 영상 업로드
- `GET /guardian/analyses/latest?pet_id={id}` → 분석 결과
- `GET /guardian/trend?pet_id={id}` → 경과 그래프

### API Server
- **Type**: Express API
- **Path**: `artifacts/api-server/`
- **Preview**: `/api`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

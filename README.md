# Vyaam — Fitness Trainer Marketplace App

A cross-platform mobile app connecting fitness trainers with clients across India, built as a single unified codebase with role-aware navigation for both customers and trainers.

## Overview

Vyaam is a two-sided marketplace app where customers discover, book, and train with certified fitness trainers, while trainers manage leads, bids, client sessions, and earnings — all from one account that can switch roles without switching apps.

The build follows a complete 117-screen product design, implemented end-to-end in React Native with TypeScript.

## Key Features

- **Onboarding & Authentication** — phone/OTP and social sign-in, guided profile setup, role selection (Customer / Trainer)
- **AI-Generated Plans** — personalized diet and workout plans generated from user intake (goals, experience level, body metrics, dietary preferences, equipment access)
- **Fitness Calculators & Tracking** — body metrics, progress logs, and streak tracking
- **Discover & Search** — location-based trainer discovery with filters and map search
- **Request & Bidding Marketplace** — customers post training requests, trainers submit bids, side-by-side bid comparison, and session scheduling
- **In-App Chat** — real-time messaging between customers and trainers, including shared plan cards
- **Session Management** — booking, check-in, rescheduling, and post-session reviews
- **Trainer Tools** — lead management, client roster, client plan editor, earnings & payouts dashboard, verification workflow (ID + certifications + liveness check)
- **Notifications & Settings** — account, privacy, notification, and language preferences, subscription and payment management

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (React Native) |
| Language | TypeScript (strict, no untyped JS) |
| Navigation | Expo Router (file-based routing, role-aware stacks) |
| State management | Zustand (global/cross-screen state), React Context (theme only) |
| Lists | FlatList / FlashList for all scrollable data |
| Auth | Firebase Auth, Google Sign-In, Apple Authentication |
| Styling | Centralized design-token theme system (colors, type scale, spacing) with full light/dark mode support |

## Engineering Highlights

- **Design-system driven UI** — a single source of truth for colors, typography, spacing, and shape tokens; no hardcoded values in screens or components
- **Reusable component library** — Button, Input, Pill, Switch, Badge, and Card components built once and shared across all 117 screens
- **Light & dark mode** — every token has a light and dark value, with system-preference detection and user override
- **Performance-conscious** — memoized components, optimized `FlatList` rendering with `getItemLayout`, and screens split into focused sub-components rather than monoliths
- **Typed API layer** — a single API client matching the backend specification exactly, with centralized pagination and error handling

## Project Structure

```
src/
  app/            # File-based routes (screens), grouped by feature module
    auth/         # Sign-up, OTP, role selection
    intake/       # Onboarding intake & AI plan generation flow
    discover/     # Trainer search & discovery
    requests/     # Booking requests & bidding marketplace
    sessions/     # Session scheduling, check-in, reviews
    trainer/      # Trainer-facing tools & verification
    chat/         # Messaging
    profile/      # Account & settings
  components/     # Shared, reusable UI components
```

## Status

Actively in development, built in phased order: onboarding & AI plan generation → marketplace & booking loop → trainer tools & payments.

---

This repository reflects a production-grade Expo/React Native build process — full TypeScript coverage, a disciplined design-token system, and a component-first architecture built to scale across a large, multi-role screen set.

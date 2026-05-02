# 🏗 Architecture Overview

## Structure

src/app/
- core → services + interceptors
- shared → reusable UI
- features:
  - products
  - cart
  - auth
  - orders

## Key Decisions

- Standalone components instead of NgModules
- Lazy loading routes
- Signals for state management
- Feature-based architecture

## Data Flow

Component → Service → API

## Future Direction

- Add NgRx or Signal Store
- Add SSR
- Improve caching
# Contributing to Pay Links

Thanks for contributing! A few ground rules:

1. Check the open issues - `good first issue` ones are beginner-friendly.
2. Keep changes small and focused; one issue per pull request.
3. Run the checks before pushing:
   - `cd backend && npm test`
   - `cd frontend && npm run build`
4. Write or update tests for behavior changes.
5. Be kind in reviews.

## Project layout

- `frontend/` - React (Vite) app.
- `backend/` - Express API + Horizon payment checks.
- `contracts/` - future Soroban escrow interface (stub for now).

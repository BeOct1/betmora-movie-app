# Betmora Frontend

This is the frontend application for Betmora - BeTech Movie Recommendation App.

## Project Structure

- `frontend/client/` - React client application
- `frontend/client/public/` - Public assets including `index.html`
- `frontend/client/src/` - React source code including components, pages, styles, and context

## Available Scripts

In the `frontend/client` directory, you can run:

### `npm install`

Installs the dependencies.

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

## Notes

- Ensure you run commands inside the `frontend/client` directory.
- The public folder with static assets is located at `frontend/client/public`.
- The app uses React Router for navigation and context for authentication state.

## How to Run

1. Navigate to `frontend/client` directory.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the development server.
4. Open your browser at `http://localhost:3000`.

## Troubleshooting

- If you encounter missing files errors, verify the `public` folder exists in `frontend/client`.
- For any issues with authentication context, ensure the correct imports of `AuthProvider` and `useAuth`.

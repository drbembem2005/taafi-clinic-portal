
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b9f3e6f7-d255-4ca5-9c38-7ccafc078662

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b9f3e6f7-d255-4ca5-9c38-7ccafc078662) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Using Docker (Recommended)

This project includes Docker configuration for easy deployment:

1. **Build and run with Docker Compose:**
   ```sh
   docker-compose up -d
   ```

2. **Or build and run manually:**
   ```sh
   # Build the Docker image
   docker build -t clinic-booking-app .

   # Run the container
   docker run -p 80:80 clinic-booking-app
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost`

### Environment Variables

If your app needs environment variables, you can:
- Add them to the `docker-compose.yml` file
- Pass them when running the Docker container: 
  ```sh
  docker run -p 80:80 -e VITE_SUPABASE_URL=your_url -e VITE_SUPABASE_ANON_KEY=your_key clinic-booking-app
  ```

### Traditional Deployment

You can also deploy without Docker:

1. **Build the project:**
   ```sh
   npm run build
   ```

2. **Deploy the files:**
   - Upload the contents of the `dist` folder to your web server
   - Or use Lovable's built-in deployment: open [Lovable](https://lovable.dev/projects/b9f3e6f7-d255-4ca5-9c38-7ccafc078662) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

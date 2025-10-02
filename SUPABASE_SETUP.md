# Supabase Integration Setup Guide

This guide will help you connect your API Keys CRUD application to a real Supabase database.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your Next.js project set up

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `pepperwood-api-keys` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `database-schema.sql` into the editor
4. Click "Run" to execute the SQL

This will create:
- The `api_keys` table with all necessary columns
- Indexes for better performance
- Row Level Security (RLS) policies
- Automatic timestamp updates

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/dashboards`

3. Try the following operations:
   - **Create**: Click the "+" button to create a new API key
   - **Read**: View the list of API keys
   - **Update**: Click the edit icon on any key
   - **Delete**: Click the delete icon on any key

## Step 6: Verify Data in Supabase

1. In your Supabase dashboard, go to **Table Editor**
2. Select the `api_keys` table
3. You should see the API keys you created through the application

## Features Included

### Database Schema
- **id**: UUID primary key
- **name**: API key name
- **description**: Optional description
- **type**: 'dev' or 'live'
- **key_value**: The actual API key
- **key_prefix**: Prefix for display (e.g., 'tvly-dev-')
- **usage_count**: Number of times the key has been used
- **permissions**: JSON array of permissions
- **created_at**: Timestamp when created
- **updated_at**: Timestamp when last updated
- **last_used_at**: Timestamp when last used

### Security Features
- Row Level Security (RLS) enabled
- API keys are stored securely
- Masked display of keys in the UI
- Proper error handling

### UI Features
- Loading states during operations
- Error messages for failed operations
- Form validation
- Confirmation dialogs for deletions
- Copy to clipboard functionality

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Make sure your `.env.local` file exists and has the correct values
   - Restart your development server after adding environment variables

2. **"Failed to load API keys" error**
   - Check that your Supabase URL and key are correct
   - Verify that the `api_keys` table exists in your database
   - Check the browser console for more detailed error messages

3. **Database connection issues**
   - Ensure your Supabase project is active (not paused)
   - Check your internet connection
   - Verify your project credentials

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the browser console for error messages
- Check the Supabase dashboard for any service issues

## Next Steps

Once everything is working, you can:

1. **Add Authentication**: Implement user authentication to secure API keys per user
2. **Add More Fields**: Extend the schema with additional fields like expiration dates
3. **Add Usage Tracking**: Implement actual API usage tracking
4. **Add Permissions**: Create a more sophisticated permissions system
5. **Add Rate Limiting**: Implement rate limiting based on API key usage

## Security Considerations

- The current setup allows all operations on API keys
- In production, implement proper user authentication
- Consider adding more restrictive RLS policies
- Store sensitive data encrypted if needed
- Implement proper API key rotation policies

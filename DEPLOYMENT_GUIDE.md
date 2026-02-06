# Deployment & Admin Setup Guide for Jhansel Cement Pots

## Deploying to Vercel

### Step 1: Push to GitHub
1. Create a GitHub repository
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/jhansel-cement-pots.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New Project"
3. Import your GitHub repository
4. In "Environment Variables", add:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
5. Click "Deploy"

## Setting Up Admin Users in Supabase

### Step 1: Enable Authentication
1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Providers**
3. Ensure **Email** provider is enabled

### Step 2: Create Admin Users

#### Option A: Create via Supabase Dashboard (Recommended)
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Fill in the details:
   - Email: your-admin-email@example.com
   - Password: Use a strong password
   - Email Confirm: ✅ Enabled
4. Click **Create User**

#### Option B: Create via SQL (if you have service role key)
Run this in Supabase SQL Editor:
```sql
-- Create admin user
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  'admin@jhanselcementpots.com',
  -- Use Supabase Dashboard to create users instead
  crypt('YourSecurePassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

### Step 3: Get Your Supabase Credentials
1. Go to **Settings** → **API**
2. Copy:
   - `Project URL` → Add to Vercel as `VITE_SUPABASE_URL`
   - `anon public` key → Add to Vercel as `VITE_SUPABASE_ANON_KEY`

### Step 4: Configure Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Redeploy if needed

## How Admin Access Works

### Current Setup
- **Public pages**: Home, Products, About, Contact (anyone can view)
- **Login page**: `/login` (anyone can access)
- **Admin dashboard**: `/admin` (requires authentication)

### Authentication Flow
1. Admin user visits `/login`
2. Enters email and password
3. Supabase validates credentials
4. If successful, redirects to `/admin`
5. If failed, shows error message

### Role-Based Access
Currently, any authenticated user can access the admin dashboard. If you want to restrict to specific emails, modify `AuthContext.jsx`:

```javascript
const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    return false;
  }

  // Restrict to specific admin emails
  const adminEmails = [
    'admin@jhanselcementpots.com',
    'jhansel@example.com'
  ];

  if (!adminEmails.includes(data.user.email)) {
    await supabase.auth.signOut();
    console.error("Access denied: Not an admin user");
    return false;
  }

  return true;
};
```

## Testing the Admin Dashboard

1. Deploy to Vercel
2. Visit your deployed URL
3. Click "Login" in the navbar
4. Enter admin credentials
5. You should be redirected to `/admin`
6. Try adding a product or viewing messages

## Troubleshooting

### "User not found" errors
- Ensure user exists in Supabase Authentication
- Check email is confirmed

### "Invalid credentials" errors
- Verify password is correct
- Check if email is confirmed in Supabase

### RLS Policy errors
- Ensure RLS policies are applied (see `supabase_rls_policies.sql`)
- Policy might need to be recreated if table was modified

### Environment variables not working
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)

## Security Recommendations

1. **Use strong passwords** for admin accounts
2. **Enable 2FA** in Supabase authentication settings
3. **Limit admin users** to 2-3 trusted people
4. **Regularly audit** admin users and remove inactive ones
5. **Use service role key** only in server-side code (never expose in frontend)

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

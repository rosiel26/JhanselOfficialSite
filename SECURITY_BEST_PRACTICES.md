# Security Best Practices Guide

This guide outlines the security best practices implemented in the Jhansel Cement Pots application and provides recommendations for maintaining a secure codebase.

---

## Table of Contents

1. [Implemented Security Measures](#implemented-security-measures)
2. [Environment Variables & Secrets](#environment-variables--secrets)
3. [Input Validation & Sanitization](#input-validation--sanitization)
4. [Database Security](#database-security)
5. [Authentication & Authorization](#authentication--authorization)
6. [Common Security Vulnerabilities](#common-security-vulnerabilities)
7. [Security Checklist](#security-checklist)
8. [Resources](#resources)

---

## Implemented Security Measures

### ✅ Completed Fixes

1. **Removed Hardcoded Credentials**
   - Removed hardcoded Supabase URL and anon key from [`src/lib/supabase.js`](src/lib/supabase.js:1)
   - Added validation to ensure environment variables are configured
   - Application will throw an error if credentials are missing

2. **Removed Service Role Key from Client-Side Code**
   - Removed `getServiceRoleClient()` function from client-side code
   - All database operations now use the regular Supabase client with anon key
   - Service role key should only be used in server-side code (Edge Functions)

3. **Input Validation & Sanitization**
   - Created [`src/lib/security.js`](src/lib/security.js:1) with validation utilities
   - Implemented validation for contact forms ([`src/pages/Contact.jsx`](src/pages/Contact.jsx:1))
   - Implemented validation for product forms ([`src/pages/AdminDashboard.jsx`](src/pages/AdminDashboard.jsx:1))
   - Added XSS sanitization to prevent malicious script injection

4. **Generic Error Messages**
   - Updated error messages to not expose system information
   - Detailed errors are logged to console for debugging
   - Users see generic error messages

5. **Updated Environment Configuration**
   - Updated [`.env.example`](.env.example:1) with security warnings
   - Removed service role key from client-side environment variables

---

## Environment Variables & Secrets

### Best Practices

1. **Never Commit Secrets to Version Control**
   ```bash
   # .gitignore should include:
   .env
   .env.local
   .env.*.local
   ```

2. **Use Environment-Specific Files**
   - `.env` - Local development (not committed)
   - `.env.production` - Production (set in deployment platform)
   - `.env.example` - Template (committed)

3. **Understand Vite Environment Variables**
   - Variables prefixed with `VITE_` are exposed to the client bundle
   - Never put secrets in `VITE_*` variables
   - Use server-side environment variables for sensitive data

4. **Secure Storage of Secrets**
   - Use your deployment platform's secret management (Vercel, Netlify, etc.)
   - Rotate secrets regularly
   - Use different secrets for different environments

### Example Secure Configuration

```bash
# .env (Local Development)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Production (set in Vercel/Netlify dashboard)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

---

## Input Validation & Sanitization

### Using the Security Utilities

The [`src/lib/security.js`](src/lib/security.js:1) module provides validation and sanitization functions:

#### Contact Form Validation

```javascript
import { validateContactForm } from '../lib/security';

const validation = validateContactForm(formData);

if (!validation.valid) {
  // Show validation errors
  console.error(validation.errors);
  return;
}

// Use sanitized data
await supabase.from('contact_messages').insert([validation.sanitized]);
```

#### Product Form Validation

```javascript
import { validateProductForm } from '../lib/security';

const validation = validateProductForm(productData);

if (!validation.valid) {
  // Show validation errors
  console.error(validation.errors);
  return;
}

// Use sanitized data
await supabase.from('products').insert([validation.sanitized]);
```

### Available Functions

| Function | Purpose |
|----------|---------|
| `escapeHtml(text)` | Escapes HTML special characters |
| `sanitizeString(text)` | Removes dangerous content (scripts, event handlers) |
| `isValidEmail(email)` | Validates email format |
| `isValidPhone(phone)` | Validates phone number format |
| `isValidUrl(url)` | Validates URL format |
| `isValidLength(text, min, max)` | Validates text length |
| `isValidNumber(value, min, max)` | Validates number range |
| `validateContactForm(formData)` | Validates contact form data |
| `validateProductForm(formData)` | Validates product form data |
| `truncateText(text, maxLength)` | Truncates text with ellipsis |
| `cleanObject(obj)` | Removes null/undefined values |

### Validation Rules

#### Contact Form
- **Name**: 2-100 characters
- **Email**: Valid email format
- **Phone**: Optional, valid phone format (10-20 characters)
- **Subject**: 3-200 characters
- **Message**: 10-5000 characters

#### Product Form
- **Name**: 2-200 characters
- **Category**: 2-100 characters
- **Description**: 10-2000 characters
- **Price**: Optional, valid number (0-999999.99)
- **In Stock**: Boolean

---

## Database Security

### Supabase Row Level Security (RLS)

RLS policies are defined in [`supabase_rls_policies.sql`](supabase_rls_policies.sql:1). These policies control who can access and modify data.

#### Key RLS Principles

1. **Enable RLS on All Tables**
   ```sql
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ```

2. **Use Anon Key for Client-Side Operations**
   - The anon key has limited access
   - RLS policies enforce access control
   - Never use service role key in client-side code

3. **Define Clear Policies**
   ```sql
   -- Allow public read access
   CREATE POLICY "Public can view products"
     ON products FOR SELECT
     USING (true);

   -- Allow authenticated users to insert
   CREATE POLICY "Authenticated can insert products"
     ON products FOR INSERT
     WITH CHECK (auth.uid() IS NOT NULL);
   ```

### Database Operations

#### Safe Query Pattern

```javascript
// ✅ SAFE - Using Supabase query builder
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('id', productId);

// ❌ UNSAFE - Never concatenate user input
const query = `SELECT * FROM products WHERE id = '${productId}'`;
```

#### Using Edge Functions for Admin Operations

For operations that require elevated privileges, use Supabase Edge Functions:

```typescript
// supabase/functions/admin-operation/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Verify authentication
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Create admin client with service role key
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Verify user has admin role
  const { data: { user } } = await supabaseAdmin.auth.getUser(
    authHeader.replace('Bearer ', '')
  )

  // Check user role in user_roles table
  const { data: roleData } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    return new Response('Forbidden', { status: 403 })
  }

  // Perform admin operation
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([await req.json()])
    .select()

  return new Response(JSON.stringify({ data, error }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## Authentication & Authorization

### Current Implementation

The application uses Supabase Auth for authentication:

- **Login**: [`src/pages/Login.jsx`](src/pages/Login.jsx:1)
- **Auth Context**: [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx:1)
- **Protected Routes**: Admin dashboard checks authentication

### Best Practices

1. **Use Supabase Auth**
   - Built-in authentication with email/password
   - Session management
   - Secure token handling

2. **Implement Role-Based Access Control (RBAC)**
   ```sql
   -- Create user_roles table
   CREATE TABLE user_roles (
     user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
     role TEXT NOT NULL CHECK (role IN ('admin', 'user'))
   );

   -- Enable RLS
   ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

   -- Policy to allow users to read their own role
   CREATE POLICY "Users can read own role"
     ON user_roles FOR SELECT
     USING (auth.uid() = user_id);
   ```

3. **Verify Roles on Server-Side**
   - Never trust client-side role checks
   - Always verify roles in Edge Functions or RLS policies

4. **Implement Session Timeout**
   - Set appropriate session expiration
   - Handle token refresh automatically

---

## Common Security Vulnerabilities

### SQL Injection

**Status**: ✅ Protected

Your application is protected from SQL injection because:
- Supabase uses parameterized queries by default
- All database operations use the query builder
- Never concatenate user input into SQL queries

### Cross-Site Scripting (XSS)

**Status**: ✅ Protected

Your application is protected from XSS because:
- Input sanitization removes dangerous content
- HTML escaping prevents script injection
- React automatically escapes content in JSX

### Cross-Site Request Forgery (CSRF)

**Status**: ⚠️ Needs Implementation

To protect against CSRF:
1. Implement CSRF tokens for state-changing operations
2. Use SameSite cookie attributes
3. Validate Origin and Referer headers

### Broken Authentication

**Status**: ⚠️ Partially Protected

To improve authentication security:
1. Implement rate limiting on login attempts
2. Add account lockout after failed attempts
3. Implement two-factor authentication (2FA)
4. Use strong password requirements

### Sensitive Data Exposure

**Status**: ✅ Protected

Your application protects sensitive data because:
- No hardcoded credentials
- Generic error messages
- Environment variables for secrets
- Service role key not exposed to client

### Security Misconfiguration

**Status**: ⚠️ Needs Implementation

To improve security configuration:
1. Implement Content Security Policy (CSP)
2. Set appropriate HTTP headers
3. Disable unused features
4. Keep dependencies updated

---

## Security Checklist

### Development

- [ ] Never commit secrets to version control
- [ ] Use `.env` files for local development
- [ ] Validate all user input
- [ ] Sanitize all user input
- [ ] Use parameterized queries
- [ ] Implement error handling
- [ ] Log security events
- [ ] Review code for vulnerabilities

### Deployment

- [ ] Set environment variables in deployment platform
- [ ] Enable HTTPS
- [ ] Implement CSP headers
- [ ] Set appropriate CORS policies
- [ ] Configure rate limiting
- [ ] Enable monitoring and logging
- [ ] Test security measures
- [ ] Document security procedures

### Ongoing

- [ ] Regularly update dependencies
- [ ] Monitor for security advisories
- [ ] Conduct security audits
- [ ] Review access logs
- [ ] Rotate secrets regularly
- [ ] Train team on security best practices
- [ ] Stay informed about new threats
- [ ] Implement security patches promptly

---

## Resources

### Official Documentation

- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

### Security Tools

- **Dependency Scanning**: `npm audit`, `npm audit fix`
- **Code Analysis**: ESLint with security plugins, SonarQube
- **Vulnerability Scanning**: Snyk, Dependabot
- **Runtime Protection**: Cloudflare WAF, AWS WAF

### Learning Resources

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Google Web Security](https://web.dev/secure/)

---

## Next Steps

### Immediate Actions

1. ✅ Review and understand the security fixes implemented
2. ✅ Ensure environment variables are properly configured
3. ✅ Test the application with the new validation
4. ⚠️ Implement rate limiting (see below)
5. ⚠️ Implement CSRF protection (see below)
6. ⚠️ Add Content Security Policy headers (see below)

### Recommended Enhancements

1. **Implement Rate Limiting**
   - Use Supabase Edge Functions with rate limiting middleware
   - Limit login attempts (e.g., 5 attempts per 15 minutes)
   - Limit form submissions (e.g., 10 per hour)

2. **Add CSRF Protection**
   - Implement CSRF tokens for all state-changing operations
   - Use Supabase's built-in CSRF protection
   - Validate tokens on server-side

3. **Implement Content Security Policy**
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Content-Security-Policy",
             "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' https://cdn.jsdelivr.net; connect-src 'self' https://*.supabase.co; frame-src 'self' https://www.google.com;"
           }
         ]
       }
     ]
   }
   ```

4. **Add Two-Factor Authentication**
   - Implement Supabase MFA for admin accounts
   - Require 2FA for sensitive operations

5. **Implement Audit Logging**
   - Log all admin actions
   - Track who did what and when
   - Store logs securely

---

## Support

If you discover a security vulnerability, please:

1. Do not disclose it publicly
2. Report it to the development team
3. Provide details about the vulnerability
4. Allow time for a fix to be released

---

*Last Updated: 2025-02-10*
*Version: 1.0.0*

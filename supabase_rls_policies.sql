-- Enable Row Level Security (RLS) on contact_messages table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to INSERT contact messages (for the contact form)
CREATE POLICY "Allow public insert for contact messages"
ON contact_messages
FOR INSERT
WITH CHECK (true);

-- Create policy to allow authenticated users (admin) to SELECT all messages
CREATE POLICY "Allow authenticated select for contact messages"
ON contact_messages
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow authenticated users (admin) to UPDATE messages
CREATE POLICY "Allow authenticated update for contact messages"
ON contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users (admin) to DELETE messages
CREATE POLICY "Allow authenticated delete for contact messages"
ON contact_messages
FOR DELETE
TO authenticated
USING (true);

-- Also enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to SELECT products (public catalog)
CREATE POLICY "Allow public select for products"
ON products
FOR SELECT
TO anon, authenticated
USING (true);

-- Create policy to allow authenticated users (admin) to INSERT products
CREATE POLICY "Allow authenticated insert for products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users (admin) to UPDATE products
CREATE POLICY "Allow authenticated update for products"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users (admin) to DELETE products
CREATE POLICY "Allow authenticated delete for products"
ON products
FOR DELETE
TO authenticated
USING (true);

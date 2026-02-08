import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Parse .env.local manually
const envFile = readFileSync('.env.local', 'utf-8');
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  const email = 'admin@cvchapchap.com';
  const password = 'Chap@09121961';

  // 1. Create the user in Supabase Auth
  const { data: user, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // auto-confirm so they can log in immediately
  });

  if (authError) {
    // If user already exists, fetch them instead
    if (authError.message.includes('already been registered') || authError.status === 422) {
      console.log('User already exists, updating to admin role...');

      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existing = users.find(u => u.email === email);

      if (!existing) {
        console.error('Could not find existing user');
        process.exit(1);
      }

      // Update password in case it changed
      await supabase.auth.admin.updateUserById(existing.id, { password });

      // Set admin role in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin', full_name: 'Admin', email })
        .eq('id', existing.id);

      if (profileError) {
        console.error('Profile update error:', profileError.message);
        process.exit(1);
      }

      console.log('Admin credentials updated successfully!');
      console.log(`  Email: ${email}`);
      console.log(`  User ID: ${existing.id}`);
      console.log(`  Role: admin`);
      return;
    }

    console.error('Auth error:', authError.message);
    process.exit(1);
  }

  console.log('User created:', user.user.id);

  // 2. Set admin role in profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin', full_name: 'Admin', email })
    .eq('id', user.user.id);

  if (profileError) {
    // Profile may not exist yet if trigger hasn't fired; insert it
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.user.id,
        email,
        full_name: 'Admin',
        role: 'admin',
      });

    if (insertError) {
      console.error('Profile error:', insertError.message);
      process.exit(1);
    }
  }

  console.log('');
  console.log('Admin account created successfully!');
  console.log(`  Email: ${email}`);
  console.log(`  User ID: ${user.user.id}`);
  console.log(`  Role: admin`);
}

createAdmin().catch(console.error);

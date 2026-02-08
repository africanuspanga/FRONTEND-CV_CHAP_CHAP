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

  // 1. Get or create auth user
  let userId;

  const { data: { users } } = await supabase.auth.admin.listUsers();
  const existing = users.find(u => u.email === email);

  if (existing) {
    userId = existing.id;
    console.log('User exists:', userId);

    // Reset password
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (error) console.error('Password update error:', error.message);
    else console.log('Password reset OK');
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      console.error('Create user error:', error.message);
      process.exit(1);
    }
    userId = data.user.id;
    console.log('User created:', userId);
  }

  // 2. Force upsert the profile row (bypasses RLS via service role)
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email,
      full_name: 'Admin',
      role: 'admin',
      created_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (upsertError) {
    console.error('Profile upsert error:', upsertError.message);
    process.exit(1);
  }

  // 3. Verify the profile exists
  const { data: profile, error: verifyError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', userId)
    .single();

  if (verifyError) {
    console.error('Verify error:', verifyError.message);
    process.exit(1);
  }

  console.log('');
  console.log('Admin account ready!');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  User ID:  ${userId}`);
  console.log(`  Role:     ${profile.role}`);
  console.log(`  Profile:  EXISTS ✓`);
}

createAdmin().catch(console.error);

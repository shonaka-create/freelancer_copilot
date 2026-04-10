'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Fetch applications for Kanban
export async function getApplications() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
  return data;
}

// Create a new application from the form
export async function createApplication(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get('title') as string;
  const platform = formData.get('platform') as string;
  const url = formData.get('url') as string;
  const amount = formData.get('amount') as string;
  const proposalText = formData.get('proposalText') as string;

  // For MVP testing without Auth, we will try to insert without user_id.
  // Note: if your DB still has `user_id NOT NULL` and RLS enabled, this will fail.
  // We recommend running `ALTER TABLE applications DISABLE ROW LEVEL SECURITY;`
  // and `ALTER TABLE applications ALTER COLUMN user_id DROP NOT NULL;` for testing.
  
  const { data, error } = await supabase
    .from('applications')
    .insert([{
      title,
      platform,
      description: url + '\n' + amount, // Temporary merge for MVP
      proposal_text: proposalText,
      status: 'applied' // default column ID mapping
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating application:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true, data };
}

// Update status (when dragging and dropping)
export async function updateApplicationStatus(id: string, newStatus: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('applications')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error('Error updating status:', error);
    return { success: false };
  }

  revalidatePath('/');
  return { success: true };
}

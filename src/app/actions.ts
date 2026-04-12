'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Fetch applications for Kanban
export async function getApplications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id) // Enforce user boundaries
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User is not authenticated' };
  }

  // applications.user_id は public.user_profiles(id) を参照しているため、
  // 先に user_profiles 行を確保する（signup トリガーが未設定の場合の保険）
  await supabase
    .from('user_profiles')
    .upsert({ id: user.id }, { onConflict: 'id' });

  const { data, error } = await supabase
    .from('applications')
    .insert([{
      title,
      platform,
      description: url + '\n' + amount,
      proposal_text: proposalText,
      status: 'applied',
      user_id: user.id
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('applications')
    .update({ status: newStatus })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating status:', error);
    return { success: false };
  }

  revalidatePath('/');
  return { success: true };
}

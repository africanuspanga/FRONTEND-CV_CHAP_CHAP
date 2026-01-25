import { createClient } from './server';
import type { CVData } from '@/types/cv';

export async function createCV(data: {
  templateId: string;
  cvData: CVData;
  anonymousId?: string;
}) {
  const supabase = await createClient();
  
  const { data: cv, error } = await supabase
    .from('cvs')
    .insert({
      template_id: data.templateId,
      data: data.cvData,
      anonymous_id: data.anonymousId || crypto.randomUUID(),
      status: 'draft',
    })
    .select()
    .single();

  if (error) throw error;
  return cv;
}

export async function updateCV(id: string, cvData: CVData, templateId?: string) {
  const supabase = await createClient();
  
  const updateData: Record<string, unknown> = { 
    data: cvData,
    updated_at: new Date().toISOString(),
  };
  if (templateId) updateData.template_id = templateId;

  const { data: cv, error } = await supabase
    .from('cvs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return cv;
}

export async function getCV(id: string) {
  const supabase = await createClient();
  
  const { data: cv, error } = await supabase
    .from('cvs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return cv;
}

export async function getCVByAnonymousId(anonymousId: string) {
  const supabase = await createClient();
  
  const { data: cv, error } = await supabase
    .from('cvs')
    .select('*')
    .eq('anonymous_id', anonymousId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return cv;
}

export async function createPayment(cvId: string, requestId: string, phoneNumber?: string) {
  const supabase = await createClient();
  
  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      cv_id: cvId,
      request_id: requestId,
      amount: 5000,
      currency: 'TZS',
      status: 'pending',
      phone_number: phoneNumber,
    })
    .select()
    .single();

  if (error) throw error;
  
  await supabase
    .from('cvs')
    .update({ status: 'pending_payment' })
    .eq('id', cvId);

  return payment;
}

export async function updatePaymentStatus(
  requestId: string,
  status: 'processing' | 'completed' | 'failed',
  transactionId?: string,
  selcomReference?: string,
  rawCallback?: unknown
) {
  const supabase = await createClient();
  
  const updateData: Record<string, unknown> = {
    status,
    transaction_id: transactionId,
    selcom_reference: selcomReference,
    raw_callback: rawCallback,
  };
  
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data: payment, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('request_id', requestId)
    .select()
    .single();

  if (error) throw error;

  if (status === 'completed') {
    await supabase
      .from('cvs')
      .update({ status: 'paid' })
      .eq('id', payment.cv_id);
  }

  return payment;
}

export async function getPaymentByRequestId(requestId: string) {
  const supabase = await createClient();
  
  const { data: payment, error } = await supabase
    .from('payments')
    .select('*, cvs(*)')
    .eq('request_id', requestId)
    .single();

  if (error) throw error;
  return payment;
}

export async function markCVDownloaded(cvId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('cvs')
    .update({ status: 'downloaded' })
    .eq('id', cvId);

  if (error) throw error;
}

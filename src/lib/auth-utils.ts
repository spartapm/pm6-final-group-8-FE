import { api } from '@/lib/api-client';

export async function getPostAuthPath(token: string): Promise<'/policy' | '/home'> {
  const profile = await api.getProfile(token);
  return profile.policy_accepted_at ? '/home' : '/policy';
}

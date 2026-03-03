import { Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extractBearerToken } from 'src/auth/utils/bearer-token';
import { Database } from 'src/common/supabase/types/supabase.types';

export const SupabaseUserProvider = {
  provide: 'SUPABASE_USER',
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: (request: any): SupabaseClient => {
    const token = extractBearerToken(request);
    if (!token) throw new UnauthorizedException('Missing token');

    return createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
  },
};

import { createClient } from '@supabase/supabase-js';
import { Database } from 'src/common/supabase/types/supabase.types';

export const SupabaseAdminProvider = {
  provide: 'SUPABASE_ADMIN',
  useFactory: () => {
    return createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  },
};

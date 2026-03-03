import { Inject, Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject('SUPABASE_USER') private readonly userClient: SupabaseClient,
    @Inject('SUPABASE_ADMIN') private readonly adminClient: SupabaseClient,
  ) {}

  async consumeTrial(): Promise<boolean> {
    const { data, error } = await this.userClient.rpc('consume_trial');

    if (error) throw error;

    return data;
  }

  async safeGiveTrial(userId: string): Promise<void> {
    const { error } = await this.adminClient
      .from('users')
      .update({ trial_available: true })
      .eq('id', userId);

    if (error)
      this.logger.error(
        'Error giving trial availability to user',
        (error as Error)?.stack,
      );
  }
}

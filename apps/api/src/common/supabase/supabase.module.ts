import { Module } from "@nestjs/common";
import { SupabaseUserProvider } from "./providers/supabase-user.provider";
import { SupabaseAdminProvider } from "./providers/supabase-admin.provider";

@Module({
  providers: [SupabaseUserProvider, SupabaseAdminProvider],
  exports: [SupabaseUserProvider, SupabaseAdminProvider],
})
export class SupabaseModule {}

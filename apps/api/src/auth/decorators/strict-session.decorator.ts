import { SetMetadata } from "@nestjs/common";

export const STRICT_SESSION_KEY = "strict_session";
export const StrictSession = () => SetMetadata(STRICT_SESSION_KEY, true);
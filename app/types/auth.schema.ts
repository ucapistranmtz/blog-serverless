import { z } from "zod";

// 1. User Schema (Single Source of Truth for Data)
export const UserSchema = z.object({
  email: z.email(),
  id: z.string(),
  name: z.string(),
  groups: z.array(z.string()).default([]),
});

// Infer the clean type (Output)
export type User = z.infer<typeof UserSchema>;

// 2. Define the Interface manually but using Zod types
// This fixes the "unknown" error in the Provider value
export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (newToken: string, userData: User) => void;
  logout: () => void;
}

// 3. (Optional) Schema to validate the whole context if needed elsewhere
export const AuthContextSchema = z.object({
  token: z.string().nullable(),
  user: UserSchema.nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
});

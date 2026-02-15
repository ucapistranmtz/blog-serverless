import { auth } from "@/lib/auth"; // Tu configuración de Better-Auth
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
export const dynamic = "force-dynamic";

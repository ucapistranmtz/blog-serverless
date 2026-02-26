import { z } from "zod";
// Importamos el esquema base que ya tienes para mantener la consistencia
import { PostCardSchema } from "./postCard.schema";

export const CreatePostSchema = PostCardSchema.extend({
  // El contenido es obligatorio para crear/editar
  id: z.ulid(),
  content: z
    .string()
    .min(50, "El contenido es demasiado corto, escribe al menos 50 caracteres"),

  // Podemos hacer que el autor sea opcional en el formulario
  // pero que tenga un default para que la Lambda no reciba null
  author: z.string().min(3).default("Ulises Capistrán"),

  // readingTime puede ser calculado en el frontend o enviado manualmente
  readingTime: z.number().min(1).optional(),
});

// Este tipo lo usarás en el estado de tu componente NewPost
export type CreatePostInput = z.infer<typeof CreatePostSchema>;

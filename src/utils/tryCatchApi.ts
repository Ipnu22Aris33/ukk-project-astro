import { HttpError } from "@utils/httpError";
import { ZodError } from "zod";

export const tryCatchApi = async <T>(
  fn: () => Promise<T>
): Promise<Response> => {
  try {
    const data = await fn();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);
    if (err instanceof ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Validation error",
          errors: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (err instanceof HttpError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: err.message,
        }),
        {
          status: err.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

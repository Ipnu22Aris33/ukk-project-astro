import { HttpError } from "@utils/httpError";
import { ZodError } from "zod";
import type { ApiResponse } from "./apiResponse";

export const tryCatchApi = async <T>(
  fn: () => Promise<ApiResponse<T>>
): Promise<Response> => {
  try {
    const result = await fn();

    if (result.status === 204) {
      return new Response(null, { status: 204 });
    }

    return Response.json(
      {
        success: result.success,
        message: result.message,
        data: result.data,
      },
      {
        status: result.status ?? 200,
      }
    );
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

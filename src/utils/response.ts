// utils/response.ts
export const successResponse = (data: any = null, message = "Success") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message = "Error") => ({
  success: false,
  message,
});

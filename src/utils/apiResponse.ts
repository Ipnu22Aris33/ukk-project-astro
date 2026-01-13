export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  status?: number;
};

export const ok = <T>(data?: T, message = "OK"): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const created = <T>(data?: T, message = "Created"): ApiResponse<T> => ({
  success: true,
  data,
  message,
  status: 201,
});

export const noContent = (): ApiResponse => ({
  success: true,
  status: 204,
});

export const fail = (message: string, status = 400): ApiResponse => ({
  success: false,
  message,
  status,
});

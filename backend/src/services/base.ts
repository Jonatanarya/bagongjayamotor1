// Base service interface
export interface IService<T, TCreate, TUpdate = Partial<TCreate>> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// Utility functions
export function generateId(prefix: string, number: number): string {
  return `${prefix}-${number.toString().padStart(3, '0')}`;
}

export function sendResponse<T>(res: any, status: number, data: T, message?: string) {
  return res.status(status).json({
    success: status < 400,
    data,
    message,
  });
}

export function sendError(res: any, error: any) {
  console.error('API Error:', error);

  const status = error.status || 500;
  const message = error.message || 'Internal server error';

  return res.status(status).json({
    success: false,
    error: message,
  });
}
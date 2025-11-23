export interface Resource {
  id: number;
  name: string;
  type: string;
  status: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResourceDTO {
  name: string;
  type: string;
  status?: string;
  metadata?: Record<string, unknown> | null;
}

export interface UpdateResourceDTO {
  name?: string;
  type?: string;
  status?: string;
  metadata?: Record<string, unknown> | null;
}

export interface ListResourcesQuery {
  limit?: number;
  offset?: number;
  status?: string;
  type?: string;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

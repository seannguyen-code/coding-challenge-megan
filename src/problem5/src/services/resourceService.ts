import * as resourceRepository from '../repositories/resourceRepository';
import {
  CreateResourceDTO,
  ListResourcesQuery,
  NotFoundError,
  Resource,
  UpdateResourceDTO,
  ValidationError,
} from '../domain/resource';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

export const createResource = async (
  data: CreateResourceDTO
): Promise<Resource> => {
  // Business rule: Normalize status to lowercase
  if (data.status) {
    data.status = data.status.toLowerCase();
  }

  return resourceRepository.createResource(data);
};

export const getResourceById = async (id: number): Promise<Resource> => {
  if (id <= 0) {
    throw new ValidationError('Resource ID must be a positive number');
  }

  const resource = await resourceRepository.getResourceById(id);

  if (!resource) {
    throw new NotFoundError(`Resource with ID ${id} not found`);
  }

  return resource;
};

export const listResources = async (
  query: ListResourcesQuery
): Promise<{
  resources: Resource[];
  total: number;
  limit: number;
  offset: number;
}> => {
  // Normalize and validate pagination
  const limit = Math.min(query.limit || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = Math.max(query.offset || 0, 0);

  // Normalize status filter to lowercase
  const filters: ListResourcesQuery = {
    ...query,
    limit,
    offset,
    status: query.status?.toLowerCase(),
  };

  const result = await resourceRepository.listResources(filters);

  return {
    ...result,
    limit,
    offset,
  };
};

export const updateResource = async (
  id: number,
  data: UpdateResourceDTO
): Promise<Resource> => {
  if (id <= 0) {
    throw new ValidationError('Resource ID must be a positive number');
  }

  // Business rule: Normalize status to lowercase
  if (data.status) {
    data.status = data.status.toLowerCase();
  }

  const resource = await resourceRepository.updateResource(id, data);

  if (!resource) {
    throw new NotFoundError(`Resource with ID ${id} not found`);
  }

  return resource;
};

export const deleteResource = async (id: number): Promise<void> => {
  if (id <= 0) {
    throw new ValidationError('Resource ID must be a positive number');
  }

  const deleted = await resourceRepository.deleteResource(id);

  if (!deleted) {
    throw new NotFoundError(`Resource with ID ${id} not found`);
  }
};

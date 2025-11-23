import prisma from '../db/client';
import {
  CreateResourceDTO,
  ListResourcesQuery,
  Resource,
  UpdateResourceDTO,
} from '../domain/resource';

export const createResource = async (
  data: CreateResourceDTO
): Promise<Resource> => {
  const { name, type, status = 'active', metadata = null } = data;

  const resource = await prisma.resource.create({
    data: {
      name,
      type,
      status,
      metadata: metadata as any,
    },
  });

  return {
    id: resource.id,
    name: resource.name,
    type: resource.type,
    status: resource.status,
    metadata: resource.metadata as Record<string, unknown> | null,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
};

export const getResourceById = async (id: number): Promise<Resource | null> => {
  const resource = await prisma.resource.findUnique({
    where: { id },
  });

  if (!resource) {
    return null;
  }

  return {
    id: resource.id,
    name: resource.name,
    type: resource.type,
    status: resource.status,
    metadata: resource.metadata as Record<string, unknown> | null,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
};

export const listResources = async (
  filters: ListResourcesQuery
): Promise<{ resources: Resource[]; total: number }> => {
  const { limit = 10, offset = 0, status, type } = filters;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (type) {
    where.type = type;
  }

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.resource.count({ where }),
  ]);

  return {
    resources: resources.map((resource) => ({
      id: resource.id,
      name: resource.name,
      type: resource.type,
      status: resource.status,
      metadata: resource.metadata as Record<string, unknown> | null,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    })),
    total,
  };
};

export const updateResource = async (
  id: number,
  data: UpdateResourceDTO
): Promise<Resource | null> => {
  try {
    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.type !== undefined) {
      updateData.type = data.type;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.metadata !== undefined) {
      updateData.metadata = data.metadata as any;
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: updateData,
    });

    return {
      id: resource.id,
      name: resource.name,
      type: resource.type,
      status: resource.status,
      metadata: resource.metadata as Record<string, unknown> | null,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record not found
      return null;
    }
    throw error;
  }
};

export const deleteResource = async (id: number): Promise<boolean> => {
  try {
    await prisma.resource.delete({
      where: { id },
    });
    return true;
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record not found
      return false;
    }
    throw error;
  }
};

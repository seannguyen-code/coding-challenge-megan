import request from 'supertest';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from '../../src/middleware/logger';
import { notFound } from '../../src/middleware/notFound';
import { errorHandler } from '../../src/middleware/errorHandler';
import resourceRoutes from '../../src/routes/resourceRoutes';
import prisma from '../../src/db/client';

// Create test app
const createTestApp = (): Application => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);
  app.use('/api/resources', resourceRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
};

const app = createTestApp();

describe('Resource API Integration Tests', () => {
  let createdResourceId: number;

  beforeAll(async () => {
    // Connect to test database
    await prisma.$connect();

    // Clean up test data
    await prisma.resource.deleteMany({
      where: {
        name: {
          startsWith: 'Test',
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.resource.deleteMany({
      where: {
        name: {
          startsWith: 'Test',
        },
      },
    });

    // Disconnect from database
    await prisma.$disconnect();
  });

  describe('POST /api/resources', () => {
    it('should create a new resource with valid data', async () => {
      const newResource = {
        name: 'Test Resource Create',
        type: 'compute',
        status: 'active',
        metadata: {
          region: 'us-east-1',
          size: 'large',
        },
      };

      const response = await request(app)
        .post('/api/resources')
        .send(newResource)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newResource.name);
      expect(response.body.type).toBe(newResource.type);
      expect(response.body.status).toBe(newResource.status);
      expect(response.body.metadata).toEqual(newResource.metadata);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      createdResourceId = response.body.id;
    });

    it('should create a resource with default status', async () => {
      const newResource = {
        name: 'Test Resource Default Status',
        type: 'storage',
      };

      const response = await request(app)
        .post('/api/resources')
        .send(newResource)
        .expect(201);

      expect(response.body.status).toBe('active');
      expect(response.body.metadata).toBeNull();
    });

    it('should fail with missing required fields', async () => {
      const invalidResource = {
        name: 'Test Resource',
        // Missing 'type' field
      };

      const response = await request(app)
        .post('/api/resources')
        .send(invalidResource)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
    });

    it('should fail with empty name', async () => {
      const invalidResource = {
        name: '',
        type: 'compute',
      };

      const response = await request(app)
        .post('/api/resources')
        .send(invalidResource)
        .expect(400);

      expect(response.body.error).toHaveProperty('details');
    });

    it('should fail with invalid data types', async () => {
      const invalidResource = {
        name: 123, // Should be string
        type: 'compute',
      };

      const response = await request(app)
        .post('/api/resources')
        .send(invalidResource)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/resources', () => {
    beforeAll(async () => {
      // Create some test resources
      await prisma.resource.createMany({
        data: [
          {
            name: 'Test Resource List 1',
            type: 'compute',
            status: 'active',
          },
          {
            name: 'Test Resource List 2',
            type: 'storage',
            status: 'inactive',
          },
          {
            name: 'Test Resource List 3',
            type: 'compute',
            status: 'active',
          },
        ],
      });
    });

    it('should list all resources with default pagination', async () => {
      const response = await request(app).get('/api/resources').expect(200);

      expect(response.body).toHaveProperty('resources');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('offset');
      expect(Array.isArray(response.body.resources)).toBe(true);
      expect(response.body.limit).toBe(10);
      expect(response.body.offset).toBe(0);
    });

    it('should filter resources by status', async () => {
      const response = await request(app)
        .get('/api/resources')
        .query({ status: 'active' })
        .expect(200);

      expect(response.body.resources.length).toBeGreaterThan(0);
      response.body.resources.forEach((resource: any) => {
        expect(resource.status).toBe('active');
      });
    });

    it('should filter resources by type', async () => {
      const response = await request(app)
        .get('/api/resources')
        .query({ type: 'compute' })
        .expect(200);

      expect(response.body.resources.length).toBeGreaterThan(0);
      response.body.resources.forEach((resource: any) => {
        expect(resource.type).toBe('compute');
      });
    });

    it('should apply pagination correctly', async () => {
      const response = await request(app)
        .get('/api/resources')
        .query({ limit: 2, offset: 0 })
        .expect(200);

      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(0);
      expect(response.body.resources.length).toBeLessThanOrEqual(2);
    });

    it('should handle multiple filters', async () => {
      const response = await request(app)
        .get('/api/resources')
        .query({ status: 'active', type: 'compute' })
        .expect(200);

      response.body.resources.forEach((resource: any) => {
        expect(resource.status).toBe('active');
        expect(resource.type).toBe('compute');
      });
    });
  });

  describe('GET /api/resources/:id', () => {
    it('should get a resource by ID', async () => {
      const response = await request(app)
        .get(`/api/resources/${createdResourceId}`)
        .expect(200);

      expect(response.body.id).toBe(createdResourceId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('status');
    });

    it('should return 404 for non-existent resource', async () => {
      const response = await request(app)
        .get('/api/resources/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/resources/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/resources/:id', () => {
    it('should fully update a resource', async () => {
      const updateData = {
        name: 'Test Resource Updated',
        type: 'network',
        status: 'inactive',
        metadata: {
          updated: true,
        },
      };

      const response = await request(app)
        .put(`/api/resources/${createdResourceId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(createdResourceId);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.type).toBe(updateData.type);
      expect(response.body.status).toBe(updateData.status);
      expect(response.body.metadata).toEqual(updateData.metadata);
    });

    it('should return 404 for non-existent resource', async () => {
      const updateData = {
        name: 'Updated',
        type: 'compute',
      };

      const response = await request(app)
        .put('/api/resources/999999')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail with missing required fields', async () => {
      const invalidUpdate = {
        name: 'Updated',
        // Missing 'type' field
      };

      const response = await request(app)
        .put(`/api/resources/${createdResourceId}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/resources/:id', () => {
    it('should partially update a resource', async () => {
      const patchData = {
        status: 'active',
      };

      const response = await request(app)
        .patch(`/api/resources/${createdResourceId}`)
        .send(patchData)
        .expect(200);

      expect(response.body.id).toBe(createdResourceId);
      expect(response.body.status).toBe(patchData.status);
      // Other fields should remain unchanged
      expect(response.body.name).toBe('Test Resource Updated');
    });

    it('should update multiple fields', async () => {
      const patchData = {
        name: 'Test Resource Patched',
        metadata: {
          patched: true,
        },
      };

      const response = await request(app)
        .patch(`/api/resources/${createdResourceId}`)
        .send(patchData)
        .expect(200);

      expect(response.body.name).toBe(patchData.name);
      expect(response.body.metadata).toEqual(patchData.metadata);
    });

    it('should return 404 for non-existent resource', async () => {
      const response = await request(app)
        .patch('/api/resources/999999')
        .send({ status: 'active' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail with empty update object', async () => {
      const response = await request(app)
        .patch(`/api/resources/${createdResourceId}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/resources/:id', () => {
    it('should delete a resource', async () => {
      await request(app)
        .delete(`/api/resources/${createdResourceId}`)
        .expect(204);

      // Verify resource is deleted
      await request(app).get(`/api/resources/${createdResourceId}`).expect(404);
    });

    it('should return 404 for non-existent resource', async () => {
      const response = await request(app)
        .delete('/api/resources/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/resources/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});

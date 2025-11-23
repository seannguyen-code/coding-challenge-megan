import { NextFunction, Request, Response, Router } from 'express';
import * as resourceService from '../services/resourceService';
import { validateRequest } from '../middleware/validateRequest';
import {
  CreateResourceSchema,
  ListResourcesQuerySchema,
  ResourceIdSchema,
  UpdateResourceSchema,
} from '../domain/resourceSchemas';

const router = Router();

// POST /api/resources - Create a new resource
router.post(
  '/',
  validateRequest({ body: CreateResourceSchema }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resource = await resourceService.createResource(req.body);
      res.status(201).json(resource);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/resources - List resources with pagination and filters
router.get(
  '/',
  validateRequest({ query: ListResourcesQuerySchema }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await resourceService.listResources(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/resources/:id - Get a single resource by ID
router.get(
  '/:id',
  validateRequest({ params: ResourceIdSchema }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resource = await resourceService.getResourceById(
        parseInt(req.params.id, 10)
      );
      res.status(200).json(resource);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/resources/:id - Fully update a resource
router.put(
  '/:id',
  validateRequest({
    params: ResourceIdSchema,
    body: CreateResourceSchema,
  }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resource = await resourceService.updateResource(
        parseInt(req.params.id, 10),
        req.body
      );
      res.status(200).json(resource);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/resources/:id - Partially update a resource
router.patch(
  '/:id',
  validateRequest({
    params: ResourceIdSchema,
    body: UpdateResourceSchema,
  }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resource = await resourceService.updateResource(
        parseInt(req.params.id, 10),
        req.body
      );
      res.status(200).json(resource);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/resources/:id - Delete a resource
router.delete(
  '/:id',
  validateRequest({ params: ResourceIdSchema }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await resourceService.deleteResource(parseInt(req.params.id, 10));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;

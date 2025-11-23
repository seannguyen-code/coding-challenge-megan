import * as resourceService from '../../src/services/resourceService';
import * as resourceRepository from '../../src/repositories/resourceRepository';
import { NotFoundError, ValidationError } from '../../src/domain/resource';

// Mock the repository layer
jest.mock('../../src/repositories/resourceRepository');

const mockedRepository = resourceRepository as jest.Mocked<
  typeof resourceRepository
>;

describe('ResourceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createResource', () => {
    it('should create a resource with valid data', async () => {
      const inputData = {
        name: 'Test Resource',
        type: 'compute',
        status: 'active',
        metadata: { key: 'value' },
      };

      const expectedResource = {
        id: 1,
        name: 'Test Resource',
        type: 'compute',
        status: 'active',
        metadata: { key: 'value' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedRepository.createResource.mockResolvedValue(expectedResource);

      const result = await resourceService.createResource(inputData);

      expect(result).toEqual(expectedResource);
      expect(mockedRepository.createResource).toHaveBeenCalledWith(inputData);
    });

    it('should normalize status to lowercase', async () => {
      const inputData = {
        name: 'Test Resource',
        type: 'compute',
        status: 'ACTIVE',
      };

      const expectedResource = {
        id: 1,
        name: 'Test Resource',
        type: 'compute',
        status: 'active',
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedRepository.createResource.mockResolvedValue(expectedResource);

      await resourceService.createResource(inputData);

      expect(mockedRepository.createResource).toHaveBeenCalledWith({
        ...inputData,
        status: 'active',
      });
    });
  });

  describe('getResourceById', () => {
    it('should return a resource when it exists', async () => {
      const expectedResource = {
        id: 1,
        name: 'Test Resource',
        type: 'compute',
        status: 'active',
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedRepository.getResourceById.mockResolvedValue(expectedResource);

      const result = await resourceService.getResourceById(1);

      expect(result).toEqual(expectedResource);
      expect(mockedRepository.getResourceById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when resource does not exist', async () => {
      mockedRepository.getResourceById.mockResolvedValue(null);

      await expect(resourceService.getResourceById(1)).rejects.toThrow(
        NotFoundError
      );
      await expect(resourceService.getResourceById(1)).rejects.toThrow(
        'Resource with ID 1 not found'
      );
    });

    it('should throw ValidationError for invalid ID', async () => {
      await expect(resourceService.getResourceById(0)).rejects.toThrow(
        ValidationError
      );
      await expect(resourceService.getResourceById(-1)).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe('listResources', () => {
    it('should return paginated resources', async () => {
      const mockResources = [
        {
          id: 1,
          name: 'Resource 1',
          type: 'compute',
          status: 'active',
          metadata: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Resource 2',
          type: 'storage',
          status: 'active',
          metadata: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockedRepository.listResources.mockResolvedValue({
        resources: mockResources,
        total: 2,
      });

      const result = await resourceService.listResources({});

      expect(result.resources).toEqual(mockResources);
      expect(result.total).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });

    it('should normalize pagination parameters', async () => {
      mockedRepository.listResources.mockResolvedValue({
        resources: [],
        total: 0,
      });

      await resourceService.listResources({ limit: 200, offset: -5 });

      expect(mockedRepository.listResources).toHaveBeenCalledWith({
        limit: 100, // Should cap at MAX_LIMIT
        offset: 0, // Should normalize negative to 0
      });
    });

    it('should normalize status filter to lowercase', async () => {
      mockedRepository.listResources.mockResolvedValue({
        resources: [],
        total: 0,
      });

      await resourceService.listResources({ status: 'ACTIVE' });

      expect(mockedRepository.listResources).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'active',
        })
      );
    });

    it('should apply filters correctly', async () => {
      mockedRepository.listResources.mockResolvedValue({
        resources: [],
        total: 0,
      });

      await resourceService.listResources({
        status: 'active',
        type: 'compute',
        limit: 20,
        offset: 10,
      });

      expect(mockedRepository.listResources).toHaveBeenCalledWith({
        status: 'active',
        type: 'compute',
        limit: 20,
        offset: 10,
      });
    });
  });

  describe('updateResource', () => {
    it('should update a resource successfully', async () => {
      const updateData = {
        name: 'Updated Resource',
        status: 'inactive',
      };

      const expectedResource = {
        id: 1,
        name: 'Updated Resource',
        type: 'compute',
        status: 'inactive',
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedRepository.updateResource.mockResolvedValue(expectedResource);

      const result = await resourceService.updateResource(1, updateData);

      expect(result).toEqual(expectedResource);
      expect(mockedRepository.updateResource).toHaveBeenCalledWith(
        1,
        updateData
      );
    });

    it('should normalize status to lowercase', async () => {
      const updateData = {
        status: 'INACTIVE',
      };

      const expectedResource = {
        id: 1,
        name: 'Resource',
        type: 'compute',
        status: 'inactive',
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedRepository.updateResource.mockResolvedValue(expectedResource);

      await resourceService.updateResource(1, updateData);

      expect(mockedRepository.updateResource).toHaveBeenCalledWith(1, {
        status: 'inactive',
      });
    });

    it('should throw NotFoundError when resource does not exist', async () => {
      mockedRepository.updateResource.mockResolvedValue(null);

      await expect(
        resourceService.updateResource(1, { name: 'Updated' })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError for invalid ID', async () => {
      await expect(
        resourceService.updateResource(0, { name: 'Updated' })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource successfully', async () => {
      mockedRepository.deleteResource.mockResolvedValue(true);

      await expect(resourceService.deleteResource(1)).resolves.not.toThrow();

      expect(mockedRepository.deleteResource).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when resource does not exist', async () => {
      mockedRepository.deleteResource.mockResolvedValue(false);

      await expect(resourceService.deleteResource(1)).rejects.toThrow(
        NotFoundError
      );
      await expect(resourceService.deleteResource(1)).rejects.toThrow(
        'Resource with ID 1 not found'
      );
    });

    it('should throw ValidationError for invalid ID', async () => {
      await expect(resourceService.deleteResource(0)).rejects.toThrow(
        ValidationError
      );
      await expect(resourceService.deleteResource(-1)).rejects.toThrow(
        ValidationError
      );
    });
  });
});

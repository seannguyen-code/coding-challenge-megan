import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      message: `Cannot ${req.method} ${req.path}`,
    },
  });
};

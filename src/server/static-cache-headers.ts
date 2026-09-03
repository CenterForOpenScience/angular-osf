import { Response } from 'express';

const HASHED_ASSET = /-[a-zA-Z0-9]{8,}\.(?:js|css|mjs)$/;

export const setStaticCacheHeaders = (res: Response, filePath: string) => {
  if (!HASHED_ASSET.test(filePath)) {
    res.setHeader('Cache-Control', 'no-cache');
  }
};

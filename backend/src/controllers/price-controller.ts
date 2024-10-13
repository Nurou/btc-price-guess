import { Request, Response } from 'express';
import * as priceService from '../services/price-service';

export const getBtcPrice = async (req: Request, res: Response) => {
  try {
    const price = await priceService.fetchBtcPrice();
    res.json({ price });
  } catch (error) {
    res.status(500).json({ error: `Error fetching BTC price: ${error}` });
  }
};

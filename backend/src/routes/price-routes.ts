import express from 'express';
import { getBtcPrice } from '../controllers/price-controller';

const priceRouter = express.Router();

priceRouter.get('/btc-price', getBtcPrice);

export { priceRouter };

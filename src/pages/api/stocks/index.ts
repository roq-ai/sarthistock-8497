import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { stockValidationSchema } from 'validationSchema/stocks';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getStocks();
    case 'POST':
      return createStock();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStocks() {
    const data = await prisma.stock
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'stock'));
    return res.status(200).json(data);
  }

  async function createStock() {
    await stockValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.investment_recommendation?.length > 0) {
      const create_investment_recommendation = body.investment_recommendation;
      body.investment_recommendation = {
        create: create_investment_recommendation,
      };
    } else {
      delete body.investment_recommendation;
    }
    if (body?.portfolio?.length > 0) {
      const create_portfolio = body.portfolio;
      body.portfolio = {
        create: create_portfolio,
      };
    } else {
      delete body.portfolio;
    }
    const data = await prisma.stock.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

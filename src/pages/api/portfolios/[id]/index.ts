import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { portfolioValidationSchema } from 'validationSchema/portfolios';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.portfolio
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPortfolioById();
    case 'PUT':
      return updatePortfolioById();
    case 'DELETE':
      return deletePortfolioById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPortfolioById() {
    const data = await prisma.portfolio.findFirst(convertQueryToPrismaUtil(req.query, 'portfolio'));
    return res.status(200).json(data);
  }

  async function updatePortfolioById() {
    await portfolioValidationSchema.validate(req.body);
    const data = await prisma.portfolio.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePortfolioById() {
    const data = await prisma.portfolio.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

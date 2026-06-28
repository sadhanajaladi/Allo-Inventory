import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      inventory: {
        include: {
          warehouse: true,
        },
      },
    },
  });

  return NextResponse.json(
  products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    warehouses: product.inventory.map((item) => ({
      id: item.warehouse.id,
      name: item.warehouse.name,
      city: item.warehouse.city,
      totalStock: item.totalStock,
      reservedStock: item.reservedStock,
      availableStock: item.totalStock - item.reservedStock,
    })),
  }))
);
}
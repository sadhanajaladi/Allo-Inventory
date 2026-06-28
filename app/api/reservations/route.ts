import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { productId, warehouseId, quantity } = await request.json();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const reservation = await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
      });

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      const availableStock =
        inventory.totalStock - inventory.reservedStock;

      if (availableStock < quantity) {
        throw new Error("Not enough stock available");
      }

      await tx.inventory.update({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
        data: {
          reservedStock: {
            increment: quantity,
          },
        },
      });

      return await tx.reservation.create({
        data: {
          productId,
          warehouseId,
          quantity,
          status: "PENDING",
          expiresAt,
        },
      });
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Inventory not found") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }

      if (error.message === "Not enough stock available") {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }

    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
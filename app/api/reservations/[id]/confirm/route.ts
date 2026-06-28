import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: {
      id,
    },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 }
    );
  }
  if (reservation.expiresAt < new Date()) {
  return NextResponse.json(
    { error: "Reservation has expired" },
    { status: 410 }
  );
}

  const confirmedReservation = await prisma.$transaction(async (tx) => {
  await tx.inventory.update({
    where: {
      productId_warehouseId: {
        productId: reservation.productId,
        warehouseId: reservation.warehouseId,
      },
    },
    data: {
      totalStock: {
        decrement: reservation.quantity,
      },
      reservedStock: {
        decrement: reservation.quantity,
      },
    },
  });

  return await tx.reservation.update({
    where: {
      id: reservation.id,
    },
    data: {
      status: "CONFIRMED",
    },
  });
});

return NextResponse.json(confirmedReservation);
}
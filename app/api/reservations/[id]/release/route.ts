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

if (reservation.status !== "PENDING") {
  return NextResponse.json(
    { error: "Reservation cannot be released" },
    { status: 400 }
  );
}

const releasedReservation = await prisma.$transaction(async (tx) => {
  await tx.inventory.update({
    where: {
      productId_warehouseId: {
        productId: reservation.productId,
        warehouseId: reservation.warehouseId,
      },
    },
    data: {
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
      status: "RELEASED",
    },
  });
});

return NextResponse.json(releasedReservation);
  }

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.inventory.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.product.deleteMany();

    const bangaloreWarehouse = await prisma.warehouse.create({
  data: {
    name: "Bangalore Warehouse",
    city: "Bangalore",
  },
});
 const hyderabadWarehouse = await prisma.warehouse.create({
    data: {
      name: "Hyderabad Warehouse",
      city: "Hyderabad",
    },
  });
  const macbook = await prisma.product.create({
  data: {
    name: "MacBook Pro",
    price: 159999,
  },
});
 const iphone = await prisma.product.create({
    data: {
      name: "iPhone 16",
      price: 79999,
    },
  });

  const airpods = await prisma.product.create({
    data: {
      name: "AirPods Pro",
      price: 24999,
    },
  });


  await prisma.inventory.createMany({
    data: [
      {
        productId: macbook.id,
        warehouseId: bangaloreWarehouse.id,
        totalStock: 20,
        reservedStock: 0,
      },
      {
        productId: macbook.id,
        warehouseId: hyderabadWarehouse.id,
        totalStock: 15,
        reservedStock: 0,
      },
      {
        productId: iphone.id,
        warehouseId: bangaloreWarehouse.id,
        totalStock: 30,
        reservedStock: 0,
      },
      {
        productId: iphone.id,
        warehouseId: hyderabadWarehouse.id,
        totalStock: 25,
        reservedStock: 0,
      },
      {
        productId: airpods.id,
        warehouseId: bangaloreWarehouse.id,
        totalStock: 50,
        reservedStock: 0,
      },
      {
        productId: airpods.id,
        warehouseId: hyderabadWarehouse.id,
        totalStock: 40,
        reservedStock: 0,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
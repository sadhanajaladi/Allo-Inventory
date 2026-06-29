import Button from "./Button";

type Warehouse = {
  id: string;
  name: string;
  city: string;
  availableStock: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  warehouses: Warehouse[];
};

type ProductCardProps = {
  product: Product;
  onReserve: (productId: string, warehouseId: string) => void;
};

export default function ProductCard({
  product,
  onReserve,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold text-gray-900">
        {product.name}
      </h2>

      <p className="text-2xl font-semibold text-blue-600 mt-2">
        ₹{product.price.toLocaleString()}
      </p>

      <div className="mt-5 space-y-4">
        {product.warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="rounded-lg border bg-gray-50 p-4"
          >
            <h3 className="font-semibold text-gray-800">
              📍 {warehouse.name}
            </h3>

            <p className="text-sm text-gray-700">
              {warehouse.city}
            </p>

            <p className="mt-2 text-green-600 font-medium">
              Available: {warehouse.availableStock}
            </p>

            <div className="mt-3">
              <Button
                onClick={() =>
                  onReserve(product.id, warehouse.id)
                }
              >
                Reserve
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
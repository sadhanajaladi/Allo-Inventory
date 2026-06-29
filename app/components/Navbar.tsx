export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        <div>
          <h1 className="text-3xl font-bold text-blue-700">
            🛒 Allo Inventory
          </h1>

          <p className="text-gray-500 text-sm">
            Inventory Reservation System
          </p>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <span className="text-gray-600 font-medium">
            Products
          </span>

          <span className="text-gray-600 font-medium">
            Warehouses
          </span>

          <span className="text-gray-600 font-medium">
            Reservations
          </span>
        </div>

      </div>
    </header>
  );
}
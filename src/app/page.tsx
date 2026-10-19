export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-4">Expense Tracker Dashboard</h1>

      <p className="mb-6">Welcome to the expense tracker.</p>

      <h2 className="text-2xl font-semibold mb-2">Summary</h2>

      <div className="flex gap-4 mb-6 mt-4">
        <div className="border rounded-lg p-4">
          <p>Total Expenses</p>
          <p className="text-3xl font-bold">R0.00</p>
        </div>

        <div className="border rounded-lg p-4">
          <p>Total Transactions</p>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="border rounded-lg p-4">
          <p>Monthly Budget</p>
          <p className="text-3xl font-bold">R5,000</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Recent Expenses</h2>

      <div className="border rounded-lg p-6 h-64">
        Recent expenses table will go here
      </div>
    </main>
  );
}

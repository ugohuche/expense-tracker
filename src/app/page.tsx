export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F9FB] p-6">
      <div className="mb-8 rounded-2xl bg-[#0B2545] p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold">Expense Tracker Dashboard</h1>

        <p className="mt-2 text-slate-300">
          Track spending, monitor budgets, and manage your finances.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-sm text-gray-500">Total Expenses</h2>

          <p className="mt-2 text-3xl font-bold text-[#E4572E]">R8,500</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-sm text-gray-500">Monthly Budget</h2>

          <p className="mt-2 text-3xl font-bold text-[#0E8388]">R10,000</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-sm text-gray-500">Budget Left</h2>

          <p className="mt-2 text-3xl font-bold text-[#1B9E5A]">R1,500</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-sm text-gray-500">Savings</h2>

          <p className="mt-2 text-3xl font-bold text-[#F2A900]">R3,200</p>
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#0B2545]">
          Monthly Spending Trend
        </h2>

        <p className="mt-2 text-gray-500">
          Overview of expenses throughout the month
        </p>

        <div className="mt-6 h-80 rounded-xl bg-[#F8FAFC] p-6">
          <div className="flex h-full items-end justify-between gap-4">
            <div className="flex flex-col items-center">
              <div className="h-24 w-12 rounded-t bg-[#0E8388]"></div>
              <p className="mt-2 text-sm">Jan</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-40 w-12 rounded-t bg-[#0E8388]"></div>
              <p className="mt-2 text-sm">Feb</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-28 w-12 rounded-t bg-[#0E8388]"></div>
              <p className="mt-2 text-sm">Mar</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-52 w-12 rounded-t bg-[#0E8388]"></div>
              <p className="mt-2 text-sm">Apr</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-44 w-12 rounded-t bg-[#0E8388]"></div>
              <p className="mt-2 text-sm">May</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-64 w-12 rounded-t bg-[#0E8388]"></div>
              <p className="mt-2 text-sm">Jun</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#0B2545]">
            Spending Categories
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between">
                <span>Food</span>
                <span>35%</span>
              </div>

              <div className="mt-1 h-3 rounded-full bg-gray-200">
                <div className="h-3 w-[35%] rounded-full bg-[#E4572E]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span>Transport</span>
                <span>20%</span>
              </div>

              <div className="mt-1 h-3 rounded-full bg-gray-200">
                <div className="h-3 w-[20%] rounded-full bg-[#0E8388]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span>Entertainment</span>
                <span>15%</span>
              </div>

              <div className="mt-1 h-3 rounded-full bg-gray-200">
                <div className="h-3 w-[15%] rounded-full bg-[#F2A900]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#0B2545]">Budget Progress</h2>

          <div className="mt-6">
            <p className="mb-2 text-gray-600">R8,500 of R10,000 used</p>

            <div className="h-6 rounded-full bg-gray-200">
              <div className="h-6 w-[85%] rounded-full bg-[#1B9E5A]"></div>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              85% of monthly budget used
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#0B2545]">
          Recent Transactions
        </h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Uber</p>
              <p className="text-sm text-gray-500">Transport</p>
            </div>

            <p className="font-bold text-[#E4572E]">-R120</p>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Checkers</p>
              <p className="text-sm text-gray-500">Groceries</p>
            </div>

            <p className="font-bold text-[#E4572E]">-R450</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Salary</p>
              <p className="text-sm text-gray-500">Income</p>
            </div>

            <p className="font-bold text-[#1B9E5A]">+R5000</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#0B2545]">
          Recent Transactions
        </h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Uber</p>
              <p className="text-sm text-gray-500">Transport</p>
            </div>

            <p className="font-bold text-[#E4572E]">-R120</p>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium">Checkers</p>
              <p className="text-sm text-gray-500">Groceries</p>
            </div>

            <p className="font-bold text-[#E4572E]">-R450</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Salary</p>
              <p className="text-sm text-gray-500">Income</p>
            </div>

            <p className="font-bold text-[#1B9E5A]">+R5000</p>
          </div>
        </div>
      </div>
    </main>
  );
}

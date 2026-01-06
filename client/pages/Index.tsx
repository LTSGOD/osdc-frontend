import WorldMap from "@/components/WorldMap";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Statistics */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-8">
          {/* Total TPS */}
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">
              Total TPS
            </div>
            <div className="text-4xl font-bold text-blue-900">000,000</div>
          </div>

          {/* Average Single Shard TPS */}
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">
              Average Single Shard TPS
            </div>
            <div className="text-4xl font-bold text-blue-900">000,000</div>
          </div>

          {/* Average Cross Shard Latency */}
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">
              Average Cross Shard Latency
            </div>
            <div className="text-4xl font-bold text-blue-900">00.000000</div>
          </div>

          {/* Total Transactions */}
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">
              Total Transactions
            </div>
            <div className="text-4xl font-bold text-blue-900">000,000,000</div>
          </div>

          {/* Leader Change Time */}
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">
              Leader Change Time
            </div>
            <div className="text-4xl font-bold text-blue-900">00.00</div>
          </div>

          {/* Committee Change Time */}
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">
              Committee Change Time
            </div>
            <div className="text-4xl font-bold text-blue-900">00.00</div>
          </div>

          {/* Block Info */}
          <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200">
            <div>block ID</div>
            <div className="text-gray-400 font-mono text-[10px]">
              00b4fc1c9093fb532e9f7f8333d7e7a9cf03f337...
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Charts Area */}
        <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-200">
          {/* Transaction Per Second Chart */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Transaction Per Second
            </h3>
            <div className="h-24 bg-gradient-to-r from-cyan-100 to-blue-100 rounded flex items-center justify-center text-gray-400 text-sm">
              [Chart Placeholder]
            </div>
          </div>

          {/* Transaction Confirmation Time Chart */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Transaction Confirmation Time
            </h3>
            <div className="h-24 bg-gradient-to-r from-cyan-100 to-blue-100 rounded flex items-center justify-center text-gray-400 text-sm">
              [Chart Placeholder]
            </div>
          </div>
        </div>

        {/* World Map Area */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full bg-white rounded border border-gray-200 shadow-lg relative">
            {/* Navigation Buttons */}
            <div className="absolute top-6 left-6 z-10 flex gap-3">
              <button className="px-5 py-5 bg-white rounded-lg border-[1.25px] border-gray-400 text-gray-400 font-bold text-xl leading-5 hover:border-gray-600 hover:text-gray-600 transition-colors">
                Base Committee
              </button>
              <button className="px-5 py-5 bg-white rounded-lg border-[1.25px] border-[#6C6E82] text-black font-bold text-xl leading-5 hover:bg-gray-50 transition-colors">
                Overview
              </button>
              <button className="px-5 py-5 bg-white rounded-lg border-[1.25px] border-[#6C6E82] text-black font-bold text-xl leading-5 hover:bg-gray-50 transition-colors">
                Overview
              </button>
            </div>
            <WorldMap />
          </div>
        </div>
      </div>
    </div>
  );
}

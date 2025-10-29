import { FHECounterDemo } from "./_components/FHECounterDemo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🔐 FHEVM React Template
              </h1>
              <p className="text-gray-600 text-lg">
                Fully Homomorphic Encryption on Ethereum
              </p>
            </div>
            
            {/* Developer Credit */}
            <div className="text-center sm:text-right">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Developed by</p>
                <p className="font-semibold text-gray-900 text-lg">Suat AYAZ</p>
                <div className="flex items-center justify-center sm:justify-end mt-2 space-x-2">
                  <span className="text-blue-600 font-medium">𝕏</span>
                  <a 
                    href="https://x.com/suatayaz_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                  >
                    @suatayaz_
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8 items-center sm:items-start w-full">
          <FHECounterDemo />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-4 sm:mb-0">
              © 2025 FHEVM Template - Built with ❤️ using Zama's FHEVM
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Created by</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">Suat AYAZ</span>
                <span>•</span>
                <a 
                  href="https://x.com/suatayaz_" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  @suatayaz_
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

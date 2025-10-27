export default function Home() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAF9F5' }}>
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#5D4037' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Productivity<br/>Manager
          </h1>
            <p className="text-xl opacity-90 leading-relaxed mb-12">
              Your all-in-one solution for tracking expenses, managing tasks, and boosting productivity
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl">
                  💰
                </div>
                <div>
                  <div className="font-semibold text-lg">Expense Tracking</div>
                  <div className="text-sm opacity-75">Monitor spending with detailed analytics and insights</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-lg">Task Management</div>
                  <div className="text-sm opacity-75">Stay organized with our intuitive task system</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl">
                  📊
                </div>
                <div>
                  <div className="font-semibold text-lg">Real-time Dashboard</div>
                  <div className="text-sm opacity-75">Get instant insights into your productivity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - CTA Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#5D4037' }}>
              Productivity Manager
            </h1>
            <p className="text-gray-600 text-lg">
              Track expenses and manage tasks efficiently
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#5D4037' }}>
                <span className="text-4xl text-white">🚀</span>
              </div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: '#5D4037' }}>
                Get Started Today
              </h2>
            
            </div>

            <div className="space-y-4">
              <a
                href="/login"
                className="w-full py-4 px-6 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
                style={{ backgroundColor: '#5D4037' }}
              >
                <span>Sign In</span>
                <span>→</span>
              </a>

              <a
                href="/register"
                className="w-full py-4 px-6 rounded-xl font-semibold border-2 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
                style={{ 
                  borderColor: '#5D4037',
                  color: '#5D4037',
                  backgroundColor: 'white'
                }}
              >
                <span>Create Account</span>
                <span>✨</span>
              </a>
            </div>
 
          </div>

           <div className="lg:hidden mt-8 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#5D4037', color: 'white' }}>
                💰
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#5D4037' }}>Expense Tracking</div>
                <div className="text-sm text-gray-600">Monitor your spending</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#5D4037', color: 'white' }}>
                ✓
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#5D4037' }}>Task Management</div>
                <div className="text-sm text-gray-600">Stay organized</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#5D4037', color: 'white' }}>
                📊
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#5D4037' }}>Dashboard Insights</div>
                <div className="text-sm text-gray-600">Real-time analytics</div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
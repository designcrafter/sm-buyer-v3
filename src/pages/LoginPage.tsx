import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BarChartBig } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-primary-500 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-400 opacity-30" />
          <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-primary-600 opacity-40" />
          <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full bg-primary-300 opacity-20" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-xl p-2.5">
              <BarChartBig className="w-7 h-7 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-white text-xs font-semibold tracking-widest uppercase opacity-80">IDH</p>
              <p className="text-white font-bold text-lg leading-tight">Salary Matrix</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight">
            Closing the<br />living wage gap,<br />one supply chain<br />at a time.
          </h1>
          <p className="text-white text-opacity-80 text-lg leading-relaxed opacity-80 max-w-sm">
            Monitor, benchmark, and improve wage conditions across your global supplier network.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          <div className="text-center">
            <p className="text-white text-2xl font-bold">62%</p>
            <p className="text-white opacity-70 text-sm mt-0.5">avg. gap reduction</p>
          </div>
          <div className="w-px h-10 bg-white opacity-25" />
          <div className="text-center">
            <p className="text-white text-2xl font-bold">2,400+</p>
            <p className="text-white opacity-70 text-sm mt-0.5">facilities tracked</p>
          </div>
          <div className="w-px h-10 bg-white opacity-25" />
          <div className="text-center">
            <p className="text-white text-2xl font-bold">38</p>
            <p className="text-white opacity-70 text-sm mt-0.5">countries</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="bg-primary-500 rounded-lg p-2">
              <BarChartBig className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <span className="text-primary-600 font-bold text-lg">IDH</span>
              <span className="text-gray-700 font-semibold text-lg ml-1">Salary Matrix</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1 text-sm">Sign in to access your buyer dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="text"
                defaultValue="sourcing@buyerco.com"
                placeholder="sourcing@buyerco.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="password123"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-150 text-sm shadow-sm hover:shadow-md"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-400">
              First time here?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition"
              >
                Check your inbox for an invite
              </button>
            </p>
            <p className="text-xs">
              <button
                onClick={() => navigate('/register')}
                className="text-gray-300 hover:text-gray-400 transition"
              >
                Simulate invite email
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

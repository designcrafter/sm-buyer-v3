import { useNavigate } from 'react-router-dom';
import { useDemoStore, DemoRole } from '../lib/demoStore';

export const DEMO_BAR_HEIGHT = 40;

export default function DemoBar() {
  const navigate = useNavigate();
  const { activeRole, setActiveRole } = useDemoStore();

  function handleRoleSwitch(role: DemoRole) {
    if (role === activeRole) return;
    setActiveRole(role);
    if (role === 'buyer') {
      navigate('/');
    } else if (role === 'intermediary') {
      navigate('/intermediary/register');
    } else {
      navigate('/supplier/dashboard');
    }
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900 flex items-center justify-between px-4"
      style={{ height: DEMO_BAR_HEIGHT }}
    >
      <span className="text-gray-500 text-[11px] font-medium tracking-wide uppercase">
        Prototype Demo
      </span>

      <div className="flex items-center gap-0.5 bg-gray-800 rounded-lg p-0.5">
        <button
          onClick={() => handleRoleSwitch('buyer')}
          className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 ${
            activeRole === 'buyer'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Buyer
        </button>
        <button
          onClick={() => handleRoleSwitch('intermediary')}
          className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 ${
            activeRole === 'intermediary'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Intermediary
        </button>
        <button
          onClick={() => handleRoleSwitch('supplier')}
          className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 ${
            activeRole === 'supplier'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Producer
        </button>
      </div>

      <div className="w-[100px]" />
    </div>
  );
}

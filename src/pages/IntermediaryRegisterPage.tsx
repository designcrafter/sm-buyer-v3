import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BarChartBig, ChevronDown, Globe, Check, Mail, Link2 } from 'lucide-react';
import { useDemoStore } from '../lib/demoStore';
import { DEMO_BAR_HEIGHT } from '../components/DemoBar';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

const TERMS_TEXT = `By accessing the IDH Salary Matrix platform as an intermediary, you agree to use this service solely for the purpose of facilitating connections between buyers and supplier facilities. You will not access, store, or distribute any wage data, salary calculations, or other sensitive information available through the platform.

Your role is limited to matching buyers with the correct supplier facilities using facility IDs and contact information. Any attempt to access wage data or reports beyond your authorised scope will result in immediate suspension of your account.

This platform is intended for authorised users only. Sharing credentials or providing access to third parties is strictly prohibited. IDH monitors platform activity to ensure compliance with these terms.

By creating an account you confirm that you are an authorised intermediary and that your use of this platform will comply with all applicable laws and regulations governing data protection in your jurisdiction.`;

const INVITED_EMAIL = 'david@intermediaryco.com';

export default function IntermediaryRegisterPage() {
  const navigate = useNavigate();
  const { activeBuyer } = useDemoStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [language, setLanguage] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedLang = LANGUAGES.find(l => l.code === language)!;

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-teal-400', 'bg-green-500'][strength];

  const passwordMatch = confirm.length > 0 && password === confirm;
  const canSubmit = true;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/intermediary/dashboard'), 1800);
  }

  return (
    <div className="min-h-screen flex font-sans" style={{ paddingTop: DEMO_BAR_HEIGHT }}>
      <div className="hidden lg:flex lg:w-5/12 xl:w-[42%] bg-teal-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500 opacity-30" />
          <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-teal-700 opacity-40" />
          <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full bg-teal-400 opacity-20" />
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
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-15 rounded-full px-4 py-2">
            <Link2 className="w-4 h-4 text-white opacity-80" />
            <span className="text-white text-sm opacity-90 font-medium">Intermediary invitation</span>
          </div>
          <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight">
            Set up your<br />intermediary<br />account.
          </h1>
          <p className="text-white text-opacity-80 text-base leading-relaxed opacity-80 max-w-sm">
            <span className="font-semibold opacity-100">{activeBuyer.name}</span> has invited you to help match their supply chain facilities on the IDH Salary Matrix platform.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            'Match buyers with the right supplier facilities',
            'Help map supply chains using facility IDs',
            'Manage relationships across multiple buyers',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-white opacity-75 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="bg-teal-600 rounded-lg p-2">
              <BarChartBig className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <span className="text-teal-600 font-bold text-lg">IDH</span>
              <span className="text-gray-700 font-semibold text-lg ml-1">Salary Matrix</span>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-gray-900 font-semibold text-lg">Account created!</p>
              <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-full px-3 py-1.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-teal-700">{activeBuyer.initials}</span>
                </div>
                <span className="text-teal-700 text-xs font-semibold">Invited by {activeBuyer.name}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create your intermediary account</h2>
              <p className="text-gray-500 mt-1 text-sm">Complete the form below to start matching suppliers</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={INVITED_EMAIL}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-400 text-sm cursor-not-allowed select-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="David"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Osei"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${['', 'text-red-500', 'text-amber-500', 'text-teal-600', 'text-green-600'][strength]}`}>
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition pr-11 ${
                      confirm.length > 0
                        ? passwordMatch
                          ? 'border-green-300 focus:ring-green-300'
                          : 'border-red-300 focus:ring-red-300'
                        : 'border-gray-200 focus:ring-teal-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirm.length > 0 && !passwordMatch && (
                  <p className="text-xs text-red-500 mt-1.5">Passwords do not match</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Preferred language
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLangOpen(v => !v)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition hover:border-gray-300"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {selectedLang.label}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {langOpen && (
                    <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                          className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition flex items-center justify-between ${language === lang.code ? 'text-teal-600 font-semibold bg-teal-50' : 'text-gray-700'}`}
                        >
                          {lang.label}
                          {language === lang.code && (
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Terms &amp; Conditions
                  </label>
                  <button
                    type="button"
                    onClick={() => setTermsExpanded(true)}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium hover:underline transition"
                  >
                    Read full document
                  </button>
                </div>
                <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <div className="px-4 py-3 text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {TERMS_TEXT}
                  </div>
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={e => setTermsAccepted(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded border-2 transition flex items-center justify-center ${termsAccepted ? 'bg-teal-500 border-teal-500' : 'border-gray-300 group-hover:border-teal-400'}`}
                        >
                          {termsAccepted && (
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 leading-relaxed">
                        I have read and agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setTermsExpanded(true)}
                          className="text-teal-600 font-medium hover:underline"
                        >Terms &amp; Conditions</button>{' '}
                        and{' '}
                        <span className="text-teal-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {termsExpanded && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm" onClick={() => setTermsExpanded(false)}>
                  <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900 text-base">Terms &amp; Conditions</h3>
                      <button
                        type="button"
                        onClick={() => setTermsExpanded(false)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-gray-500"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-y-auto px-6 py-5 text-sm text-gray-600 leading-relaxed flex-1">
                      {TERMS_TEXT.split('\n\n').map((para, i) => (
                        <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
                      ))}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                      <button
                        type="button"
                        onClick={() => { setTermsAccepted(true); setTermsExpanded(false); }}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl text-sm transition"
                      >
                        Accept &amp; close
                      </button>
                      <button
                        type="button"
                        onClick={() => setTermsExpanded(false)}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full font-semibold py-3.5 rounded-xl transition-all duration-150 text-sm shadow-sm mt-1 ${
                  canSubmit
                    ? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white hover:shadow-md cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create intermediary account
              </button>
            </form>
            </>
          )}

          <p className="text-xs text-gray-400 text-center mt-6">
            Already have a Salary Matrix account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-teal-600 hover:text-teal-700 font-medium hover:underline transition"
            >
              Sign in to link this invitation
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

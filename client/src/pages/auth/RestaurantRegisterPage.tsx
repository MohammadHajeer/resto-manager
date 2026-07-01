import { useState, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  language: string;
  legalName: string;
  cuisineType: string;
  seatingCapacity: string;
  address: string;
  logo: File | null;
  logoPreview: string | null;
  primaryColor: string;
  banner: File | null;
  bannerPreview: string | null;
  license: File | null;
  agreeToTerms: boolean;
}

const DEFAULT_BANNER = "https://lh3.googleusercontent.com/aida-public/AB6AXuBlDmyIHwF7n24mBKF8U2-GCQKPyQrMag_4sx7TqD8l4P2YA6V4gGXtX6SD2l9PanBJ5ZsBWEyo3NUDXd9VA0aed-6QsZ6LQ_YSgfTqO2r4nQuwQnmA-RBzRtJxHJRUh4vqfDEKvXRwhwHMZG0OApPUOJGDfHYwqLN91RWB5dXWAwUE92ieoukabEIenUlp8-UwzZTG4tSEROTXoaeb38lyF5QZRwzYfEH50uhQlsLIUUzhr_TmqaRa2eSIRht_o5fDNKb4RG1zBvM";

function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    language: 'English',
    legalName: '',
    cuisineType: '',
    seatingCapacity: '',
    address: '',
    logo: null,
    logoPreview: null,
    primaryColor: '#00694d',
    banner: null,
    bannerPreview: DEFAULT_BANNER,
    license: null,
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: 'logo' | 'banner' | 'license') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      setFormData(prev => ({
        ...prev,
        [fieldName]: file,
        [fieldName === 'logo' ? 'logoPreview' : fieldName === 'banner' ? 'bannerPreview' : '']: previewUrl
      }));

      if (errors[fieldName]) {
        setErrors(prev => {
          const next = { ...prev };
          delete next[fieldName];
          return next;
        });
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email Address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
    }

    if (step === 2) {
      if (!formData.legalName.trim()) newErrors.legalName = 'Restaurant Legal Name is required';
      if (!formData.cuisineType.trim()) newErrors.cuisineType = 'Cuisine Type is required';
      if (!formData.seatingCapacity.trim()) {
        newErrors.seatingCapacity = 'Seating Capacity is required';
      } else if (isNaN(Number(formData.seatingCapacity)) || Number(formData.seatingCapacity) <= 0) {
        newErrors.seatingCapacity = 'Please enter a valid seating capacity';
      }
      if (!formData.address.trim()) newErrors.address = 'Physical Address is required';
    }

    if (step === 4) {
      if (!formData.license) newErrors.license = 'Business Operating License is required';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) {
      setIsSubmitted(true);
    }
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleLicenseClick = () => {
    licenseInputRef.current?.click();
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className="flex flex-col min-h-screen text-on-background bg-background">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-margin-desktop h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-8">
          <span className="font-headline-md text-headline-md font-bold text-primary">RestoManager</span>
          <nav className="hidden md:flex gap-6">
            <a className="text-secondary font-medium hover:text-primary transition-colors font-label-md text-label-md" href="#">Home</a>
            <a className="text-secondary font-medium hover:text-primary transition-colors font-label-md text-label-md" href="#">Features</a>
            <a className="text-secondary font-medium hover:text-primary transition-colors font-label-md text-label-md" href="#">About</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 rounded-full text-primary font-bold hover:bg-primary-container/10 transition-all font-label-md text-label-md">Login</button>
          <button className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-all font-label-md text-label-md">Get Started</button>
        </div>
      </header>

      <main className="max-w-250 w-full mx-auto py-12 px-margin-mobile md:px-margin-desktop grow">
        {/* Header & Step Indicator */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-display mb-4 text-on-background">Partner with Us</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">
            Join the fastest-growing restaurant network. Complete your registration to start managing your kitchen with precision.
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-12 max-w-3xl mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-variant -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>

          {[
            { step: 1, label: "Owner Info" },
            { step: 2, label: "Details" },
            { step: 3, label: "Branding" },
            { step: 4, label: "Verification" }
          ].map((item) => {
            const isCompleted = item.step < currentStep;
            const isActive = item.step === currentStep;

            return (
              <div key={item.step} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ring-4 ring-background transition-all duration-300 ${
                    isCompleted || isActive 
                      ? 'bg-primary text-on-primary' 
                      : 'bg-surface-container-highest text-secondary'
                  }`}
                >
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-xl">check</span>
                  ) : (
                    item.step
                  )}
                </div>
                <span 
                  className={`font-label-md text-label-md font-medium transition-colors duration-300 ${
                    isActive ? 'font-bold text-primary' : isCompleted ? 'text-primary' : 'text-secondary'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Canvas */}
        <form onSubmit={handleSubmit} className="space-y-stack-lg">
          {/* Step 1: Owner Info */}
          {currentStep === 1 && (
            <section className="step-content animate-fade-in">
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm">
                <div className="mb-8">
                  <h2 className="font-headline-md text-headline-md text-on-background mb-2">Owner Information</h2>
                  <p className="font-body-md text-body-md text-secondary">
                    We need your contact details to facilitate the management of your restaurant account.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-background block">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full h-12 px-4 rounded-lg border ${errors.fullName ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary'} focus:ring-2 focus:ring-primary-container/20 outline-none transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-error text-label-md">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-background block">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full h-12 px-4 rounded-lg border ${errors.email ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary'} focus:ring-2 focus:ring-primary-container/20 outline-none transition-all`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-error text-label-md">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-background block">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full h-12 px-4 rounded-lg border ${errors.phone ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary'} focus:ring-2 focus:ring-primary-container/20 outline-none transition-all`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && <p className="text-error text-label-md">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-background block">Preferred Language</label>
                    <div className="relative">
                      <select 
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-container/20 outline-none transition-all appearance-none bg-white"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>Mandarin</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                        keyboard_arrow_down
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Step 2: Restaurant Details */}
          {currentStep === 2 && (
            <section className="step-content">
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm">
                <div className="mb-8">
                  <h2 className="font-headline-md text-headline-md text-on-background mb-2">Restaurant Details</h2>
                  <p className="font-body-md text-body-md text-secondary">
                    Tell us about your establishment's location and cuisine.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-background block">Restaurant Legal Name</label>
                    <input 
                      type="text" 
                      name="legalName"
                      value={formData.legalName}
                      onChange={handleInputChange}
                      className={`w-full h-12 px-4 rounded-lg border ${errors.legalName ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary'} focus:ring-2 focus:ring-primary-container/20 outline-none transition-all`}
                      placeholder="Gourmet Bistro Inc."
                    />
                    {errors.legalName && <p className="text-error text-label-md">{errors.legalName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-background block">Cuisine Type</label>
                    <input 
                      type="text" 
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleInputChange}
                      className={`w-full h-12 px-4 rounded-lg border ${errors.cuisineType ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary'} focus:ring-2 focus:ring-primary-container/20 outline-none transition-all`}
                      placeholder="e.g., Italian, Fusion, Vegan"
                    />
                    {errors.cuisineType && <p className="text-error text-label-md">{errors.cuisineType}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-background block">Seating Capacity</label>
                    <input 
                      type="number" 
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleInputChange}
                      className={`w-full h-12 px-4 rounded-lg border ${errors.seatingCapacity ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary'} focus:ring-2 focus:ring-primary-container/20 outline-none transition-all`}
                      placeholder="50"
                    />
                    {errors.seatingCapacity && <p className="text-error text-label-md">{errors.seatingCapacity}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-background block">Physical Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full h-12 px-4 rounded-lg border ${errors.address ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary'} focus:ring-2 focus:ring-primary-container/20 outline-none transition-all`}
                      placeholder="123 Culinary Ave, Food District"
                    />
                    {errors.address && <p className="text-error text-label-md">{errors.address}</p>}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Step 3: Branding */}
          {currentStep === 3 && (
            <section className="step-content animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Card: Logo & Brand Color */}
                <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm space-y-6">
                  <div>
                    <h3 className="font-title-md text-title-md text-on-background mb-1">Logo &amp; Icon</h3>
                    <p className="font-label-md text-label-md text-secondary">Recommended size 500x500px.</p>
                  </div>

                  <input 
                    type="file" 
                    ref={logoInputRef}
                    onChange={(e) => handleFileChange(e, 'logo')}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div 
                    onClick={handleLogoClick}
                    className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors cursor-pointer group min-h-40"
                  >
                    {formData.logoPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <img 
                          src={formData.logoPreview} 
                          alt="Logo Preview" 
                          className="w-20 h-20 object-cover rounded-lg border border-outline-variant"
                        />
                        <span className="font-label-md text-label-md text-primary font-bold">
                          {formData.logo?.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-4xl text-outline group-hover:text-primary transition-colors">
                          upload_file
                        </span>
                        <span className="font-label-md text-label-md text-secondary group-hover:text-primary transition-colors">
                          Drop your logo here or browse
                        </span>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-background block">Brand Primary Color</label>
                    <div className="flex gap-4">
                      <input 
                        type="color" 
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        className="h-12 w-16 p-1 rounded border border-outline-variant cursor-pointer"
                      />
                      <input 
                        type="text" 
                        name="primaryColor"
                        value={formData.primaryColor.toUpperCase()}
                        onChange={handleInputChange}
                        className="flex-1 h-12 px-4 rounded-lg border border-outline-variant font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Card: Banner Image */}
                <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm space-y-6">
                  <div>
                    <h3 className="font-title-md text-title-md text-on-background mb-1">Banner Image</h3>
                    <p className="font-label-md text-label-md text-secondary">Used for your digital storefront profile.</p>
                  </div>

                  <input 
                    type="file" 
                    ref={bannerInputRef}
                    onChange={(e) => handleFileChange(e, 'banner')}
                    accept="image/*"
                    className="hidden"
                  />

                  <div 
                    onClick={handleBannerClick}
                    className="h-48 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors cursor-pointer group bg-cover bg-center relative overflow-hidden"
                    style={{ backgroundImage: `url('${formData.bannerPreview}')` }}
                  >
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors"></div>
                    <div className="relative z-10 bg-surface-container-lowest/90 px-4 py-2 rounded-full shadow-sm flex items-center gap-2 group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined text-md">edit</span>
                      <span className="font-label-md text-label-md">
                        {formData.banner ? "Change Banner" : "Upload Banner"}
                      </span>
                    </div>
                    {formData.banner && (
                      <span className="absolute bottom-2 left-2 z-10 bg-black/60 text-white px-3 py-1 rounded text-[10px] font-mono max-w-[90%] truncate">
                        {formData.banner.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Step 4: Verification */}
          {currentStep === 4 && (
            <section className="step-content animate-fade-in">
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                  <span className="material-symbols-outlined text-6xl text-primary mb-4">verified_user</span>
                  <h2 className="font-headline-md text-headline-md text-on-background mb-2">Legal Verification</h2>
                  <p className="font-body-md text-body-md text-secondary">
                    To comply with local regulations, please upload your valid business operating license.
                  </p>
                </div>

                <div className="space-y-6">
                  <input 
                    type="file" 
                    ref={licenseInputRef}
                    onChange={(e) => handleFileChange(e, 'license')}
                    accept=".pdf,image/*"
                    className="hidden"
                  />

                  <div 
                    onClick={handleLicenseClick}
                    className={`border-2 border-dashed ${errors.license ? 'border-error bg-error-container/5' : 'border-outline-variant'} rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors cursor-pointer group`}
                  >
                    <span className="material-symbols-outlined text-4xl text-outline group-hover:text-primary transition-colors">
                      description
                    </span>
                    <span className="font-label-md text-label-md text-secondary group-hover:text-primary transition-colors text-center">
                      {formData.license ? (
                        <span className="text-primary font-bold block max-w-xs truncate">
                          {formData.license.name}
                        </span>
                      ) : (
                        "Upload Business License (PDF, JPG)"
                      )}
                    </span>
                  </div>
                  {errors.license && <p className="text-error text-label-md text-center">{errors.license}</p>}

                  <div className="flex items-start gap-4 p-4 bg-primary-container/10 rounded-lg border border-primary/20">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="font-label-md text-label-md text-primary">
                      Your information is encrypted and will only be used for the purpose of identity and business verification.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 py-2">
                      <input 
                        type="checkbox" 
                        name="agreeToTerms"
                        id="terms"
                        checked={formData.agreeToTerms}
                        onChange={handleCheckboxChange}
                        className={`w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-2`}
                      />
                      <label className="font-body-md text-body-md text-secondary select-none" htmlFor="terms">
                        I agree to the <a className="text-primary underline font-medium" href="#">Terms of Service</a> and <a className="text-primary underline font-medium" href="#">Privacy Policy</a>.
                      </label>
                    </div>
                    {errors.agreeToTerms && <p className="text-error text-label-md">{errors.agreeToTerms}</p>}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
            <button 
              type="button"
              onClick={handlePrev}
              className={`px-8 py-3 rounded-full border border-outline-variant text-on-background font-bold hover:bg-surface-variant transition-all font-label-md text-label-md flex items-center gap-2 ${
                currentStep === 1 ? 'invisible pointer-events-none' : ''
              }`}
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Previous
            </button>

            <div className="flex gap-4">
              {currentStep < totalSteps ? (
                <button 
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all font-label-md text-label-md flex items-center gap-2"
                >
                  Next Step
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : (
                <button 
                  type="submit"
                  className="px-10 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all font-label-md text-label-md"
                >
                  Submit for Approval
                </button>
              )}
            </div>
          </div>
        </form>
      </main>

      {/* Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-on-background/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-10 text-center shadow-2xl scale-100 transition-transform duration-300 animate-scale-up">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl">task_alt</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-2 text-on-background">Application Received!</h3>
            <p className="font-body-md text-body-md text-secondary mb-8">
              Thank you for joining RestoManager. Our team will review your details and business license. You'll receive an email within 24-48 hours.
            </p>
            <button 
              type="button"
              className="w-full py-4 rounded-full bg-on-background text-on-primary font-bold hover:opacity-90 transition-all font-label-md text-label-md"
              onClick={() => window.location.reload()}
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

import MerchantApplicationForm from '@/components/MerchantApplicationForm';

const Apply = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-blue-50 to-slate-100 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Merchant Application
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-slate-600 mb-6">
            Apply to become a certified rock merchant. Once approved, you'll be able to submit rocks for greenlist consideration.
          </p>
          <MerchantApplicationForm />
        </div>
      </div>
    </div>
  );
};

export default Apply;
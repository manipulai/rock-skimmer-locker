import AdminApplicationList from '@/components/AdminApplicationList';

const Admin = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-blue-50 to-slate-100 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Merchant Applications
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <AdminApplicationList />
        </div>
      </div>
    </div>
  );
};

export default Admin;
import { MessageSquare } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function MessagesMonitoring() {
  return (
    <>
      <AdminSidebar />
      
      <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12 bg-[#2f1632]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Messages Monitoring
            </h1>
            <p className="text-white/60">Monitor platform conversations</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Flagged Messages</h2>
            <p className="text-white/60">All conversations are within guidelines</p>
          </div>
        </div>
      </main>
    </>
  );
}

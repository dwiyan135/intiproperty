import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6">
        <main className="bg-white p-6 rounded-lg shadow-md">{children}</main>
      </div>
    </div>
  );
}

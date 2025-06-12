import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-white to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 
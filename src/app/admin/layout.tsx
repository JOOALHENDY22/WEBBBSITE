import { checkAdminSession } from "@/app/actions";
import AdminLogin from "@/components/AdminLogin";

export const revalidate = 0; // Disable caching

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-[#030712] w-full text-slate-200">
      {children}
    </div>
  );
}

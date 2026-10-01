import { useAuth } from "@/hooks/useAuth";
import { Button } from "@base-ui/react/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Task Manager</h1>

            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Dashboard</h2>

          <p className="mt-2 text-gray-500">Your tasks will appear here.</p>
        </div>
      </div>
    </div>
  );
}

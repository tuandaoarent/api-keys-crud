import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LoginButton from "../components/LoginButton";
import DebugAuth from "../components/DebugAuth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Pepperwood
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to access your API management dashboard
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {session ? (
            <div className="text-center space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p className="text-lg font-medium text-gray-900">
                  Welcome, {session.user.name}!
                </p>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Link
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  href="/dashboards"
                >
                  Go to Dashboard
                </Link>
                <LoginButton />
              </div>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
      <DebugAuth />
    </div>
  );
}

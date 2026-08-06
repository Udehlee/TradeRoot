import { getServerSession } from "@/app/lib/get-session";
// import type { Metadata } from "next";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
    const session = await getServerSession();

    if (!session) {
        redirect("/signin")
    }

    const user = session.user;

     return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-1">Your Profile</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage your account details
      </p>

      <div className="bg-white border border-gray-100 rounded-lg divide-y divide-gray-100">

        <div className="p-4 flex justify-between">
          <span className="text-sm text-gray-500">Full name</span>
          <span className="text-sm font-medium">
            {user.firstname} {user.lastname}
          </span>
        </div>

        <div className="p-4 flex justify-between">
          <span className="text-sm text-gray-500">Email</span>
          <span className="text-sm font-medium">{user.email}</span>
        </div>

        <div className="p-4 flex justify-between">
          <span className="text-sm text-gray-500">Phone</span>
          <span className="text-sm font-medium">{user.phone || "Not set"}</span>
        </div>

        <div className="p-4 flex justify-between">
          <span className="text-sm text-gray-500">Role</span>
          <span className="text-sm font-medium capitalize">
            {user.role?.toLowerCase()}
          </span>
        </div>

        {user.role === "SUPPLIER" && (
          <>
            <div className="p-4 flex justify-between">
              <span className="text-sm text-gray-500">Business name</span>
              <span className="text-sm font-medium">
                {user.businessName || "Not set"}
              </span>
            </div>
            <div className="p-4 flex justify-between">
              <span className="text-sm text-gray-500">Business type</span>
              <span className="text-sm font-medium">
                {user.businessType || "Not set"}
              </span>
            </div>
            <div className="p-4 flex justify-between">
              <span className="text-sm text-gray-500">Category</span>
              <span className="text-sm font-medium">
                {user.category || "Not set"}
              </span>
            </div>
            <div className="p-4 flex justify-between">
              <span className="text-sm text-gray-500">CAC number</span>
              <span className="text-sm font-medium">
                {user.cacNumber || "Not set"}
              </span>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

 export default ProfilePage;

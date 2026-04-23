import React from "react";

const Profile = ({ User }) => {
  if (!User) return null;

  return (
    <div className="mt-2">
      <h1 className="text-3xl text-left font-semibold">Account</h1>
      <h2 className="text-base text-left text-gray-600">
        Welcome {User.name}
        {User.email && <span className="text-gray-500"> &middot; {User.email}</span>}
      </h2>
    </div>
  );
};

export default Profile;

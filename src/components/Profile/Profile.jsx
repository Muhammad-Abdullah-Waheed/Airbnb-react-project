import React from 'react'

const Profile = ({User}) => {
  return (
    <div className='mt-2'>
      <h1 className="text-3xl text-left font-semibold">Account</h1>
        <h2 className="text-1xl text-left font-semibold">
          {" "}
          Welcome {User.name}, {User.email} , Abdullah
        </h2>
    </div>
  )
}

export default Profile;

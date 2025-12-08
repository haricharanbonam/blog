import React from "react";

function FollowContainer({ person, onFollow, onClick }) {
  // Add safety check
  if (!person || !person.fullName) {
    return null; // Don't render if person data is incomplete
  }

  return (
    <div
      className="flex items-center bg-gray-900 rounded-xl px-4 py-2 w-full text-white cursor-pointer"
      onClick={() => onClick(person)}
    >
      {person.avatarUrl ? (
        <img
          src={person.avatarUrl}
          alt="Profile"
          className="w-10 h-10 object-cover rounded-full"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-semibold">
            {person.fullName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex-1 text-center text-base font-medium">
        {person.fullName}
      </div>
      <button
        className={`${
          person.isFollowing
            ? "bg-black hover:bg-gray-800"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white font-semibold text-sm px-4 py-1 rounded-lg`}
        onClick={(e) => {
          e.stopPropagation(); // Prevent onClick from firing
          onFollow(person);
        }}
      >
        {person.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default FollowContainer;

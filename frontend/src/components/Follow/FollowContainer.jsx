import React from "react";

function FollowContainer({ person, onFollow, onClick }) {
  return (
    <div
      class="flex items-center bg-gray-900 rounded-xl px-4 py-2 w-full text-white"
      onClick={() => onClick(person)}
    >
      {person.avatarUrl ? (
        <img
          src={person.avatarUrl}
          alt="Profile"
          class="w-10 h-10 object-cover rounded-l-full"
        />
      ) : (
        <div class="w-10 h-10 bg-gray-700 rounded-l-full flex items-center justify-center">
          <span class="text-white text-lg font-semibold">
            {person.fullName.charAt(0)}
          </span>
        </div>
      )}
      <div class="flex-1 text-center text-base font-medium">
        {person.fullName}
      </div>
      <button
        className={`${
          person.isFollowing
            ? "bg-black hover:bg-gray-800"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white font-semibold text-sm px-4 py-1 rounded-lg`}
      >
        {person.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default FollowContainer;

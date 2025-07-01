import React from "react";
import FollowContainer from "./FollowContainer";

function FollowGrid({ persons, onFollow, onClick }) {
  console.log("FollowGrid persons:", persons);
  return (
    <div className="grid grid-cols-1 gap-4">
      {persons.length === 0 && (
        <div className="col-span-3 text-center text-gray-500">
          {" "}
          \ No users found
        </div>
      )}
      {persons.length != 0 &&
        persons.map((person, i) => (
          <FollowContainer
            key={i}
            person={person}
            onFollow={onFollow}
            onClick={onClick}
          />
        ))}
    </div>
  );
}

export default FollowGrid;

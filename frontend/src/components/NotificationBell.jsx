import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NotificationBell({ notifications }) {
  const [open, setOpen] = useState(false);
  const navigate=useNavigate();
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        🔔
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[300px] max-h-[400px] overflow-y-auto bg-white border shadow-lg rounded-xl z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No new posts</p>
          ) : (
            notifications.map((post) => (
              <div
                key={post._id}
                onClick={()=>navigate(`/blog/${post._id}`)}
                className="flex items-center gap-3 p-3 border-b hover:bg-gray-50 cursor-pointer"
              >
                <img
                  src={post.coverImage}
                  alt="cover"
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <p className="font-semibold">{post.title}</p>
                  <p className="text-sm text-gray-500">
                    by {post.author.fullName}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

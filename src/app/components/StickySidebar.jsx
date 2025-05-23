"use client";

export default function StickySidebar({ children }) {
  return (
    <div className="sidebar-container">
      <aside className="sideBar">
        {children}
      </aside>
    </div>
  );
}
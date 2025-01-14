import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-4 py-3">{/* 导航栏内容 */}</nav>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-3">{/* 页脚内容 */}</div>
      </footer>
    </div>
  );
}

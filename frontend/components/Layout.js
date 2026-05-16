import Header from './Header';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
  return (
    <div dir="rtl" lang="ar" className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow animate-fade-in">{children}</main>
      <Footer />
      <ToastContainer position="top-left" rtl autoClose={3000} theme="colored" />
    </div>
  );
}

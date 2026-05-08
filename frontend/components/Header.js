import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          E-Commerce
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-200">Home</Link>
          <Link href="/products" className="hover:text-blue-200">Products</Link>
          <Link href="/categories" className="hover:text-blue-200">Categories</Link>
          <Link href="/cart" className="hover:text-blue-200 flex items-center">
            <FaShoppingCart className="mr-1" /> Cart
          </Link>
          <Link href="/profile" className="hover:text-blue-200 flex items-center">
            <FaUser className="mr-1" /> Profile
          </Link>
        </nav>

        <button onClick={toggleMenu} className="md:hidden">
          <FaBars />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-2">
          <Link href="/" className="block py-2">Home</Link>
          <Link href="/products" className="block py-2">Products</Link>
          <Link href="/categories" className="block py-2">Categories</Link>
          <Link href="/cart" className="block py-2">Cart</Link>
          <Link href="/profile" className="block py-2">Profile</Link>
        </div>
      )}
    </header>
  );
}
import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../lib/api';
import Cookies from 'js-cookie';

export default function APITester() {
  const [testResults, setTestResults] = useState([]);
  const [testEmail, setTestEmail] = useState('test' + Date.now() + '@example.com');
  const [testToken, setTestToken] = useState('');

  const addResult = (name, status, message) => {
    setTestResults(prev => [...prev, { name, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setTestResults([]);

    // 1. Test Registration
    try {
      const registerRes = await api.post('/auth/register', {
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: 'Test@123456',
        phone: '+201234567890'
      });
      addResult('✅ Registration', 'success', 'User registered successfully');
    } catch (error) {
      addResult('❌ Registration', 'error', error.response?.data?.message || error.message);
    }

    // 2. Test Login
    try {
      const loginRes = await api.post('/auth/login', {
        email: testEmail,
        password: 'Test@123456'
      });
      setTestToken(loginRes.data.token);
      Cookies.set('token', loginRes.data.token);
      addResult('✅ Login', 'success', 'User logged in successfully');
    } catch (error) {
      addResult('❌ Login', 'error', error.response?.data?.message || error.message);
      return; // لا نستطيع الاستمرار بدون توكن
    }

    // 3. Test Get Profile
    try {
      const profileRes = await api.get('/users/me');
      addResult('✅ Get Profile', 'success', `User: ${profileRes.data.data.user.firstName}`);
    } catch (error) {
      addResult('❌ Get Profile', 'error', error.response?.data?.message || error.message);
    }

    // 4. Test Update Profile
    try {
      await api.patch('/users/me', {
        firstName: 'Updated'
      });
      addResult('✅ Update Profile', 'success', 'Profile updated successfully');
    } catch (error) {
      addResult('❌ Update Profile', 'error', error.response?.data?.message || error.message);
    }

    // 5. Test Get Products
    try {
      const productsRes = await api.get('/products');
      addResult('✅ Get Products', 'success', `Found ${productsRes.data.data.products?.length || 0} products`);
    } catch (error) {
      addResult('❌ Get Products', 'error', error.response?.data?.message || error.message);
    }

    // 6. Test Get Brands
    try {
      const brandsRes = await api.get('/brands');
      addResult('✅ Get Brands', 'success', `Found ${brandsRes.data.data.brands?.length || 0} brands`);
    } catch (error) {
      addResult('❌ Get Brands', 'error', error.response?.data?.message || error.message);
    }

    // 7. Test Get Categories
    try {
      const categoriesRes = await api.get('/categories');
      addResult('✅ Get Categories', 'success', `Found ${categoriesRes.data.data.categories?.length || 0} categories`);
    } catch (error) {
      addResult('❌ Get Categories', 'error', error.response?.data?.message || error.message);
    }

    // 8. Test Change Password
    try {
      await api.patch('/users/me/change-password', {
        currentPassword: 'Test@123456',
        password: 'NewTest@123456',
        passwordConfirm: 'NewTest@123456'
      });
      addResult('✅ Change Password', 'success', 'Password changed successfully');
    } catch (error) {
      addResult('❌ Change Password', 'error', error.response?.data?.message || error.message);
    }

    // 9. Test Add Address
    try {
      await api.post('/users/me/addresses', {
        alias: 'Home',
        street: '123 Main St',
        city: 'Cairo',
        country: 'Egypt',
        postalCode: '12345',
        phone: '+201234567890',
        isDefault: true
      });
      addResult('✅ Add Address', 'success', 'Address added successfully');
    } catch (error) {
      addResult('❌ Add Address', 'error', error.response?.data?.message || error.message);
    }

    toast.success('API Tests Completed!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">🧪 API Test Suite</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Test Email:</strong> {testEmail}
        </p>
      </div>

      <button
        onClick={runTests}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold mb-6"
      >
        Run All Tests
      </button>

      {testResults.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-bold mb-4">Test Results:</h2>
          {testResults.map((result, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                result.status === 'success'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{result.name}</p>
                  <p className="text-sm text-gray-600">{result.message}</p>
                </div>
                <p className="text-xs text-gray-500">{result.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
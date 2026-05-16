module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1',
  },
  images: {
    domains: ['res.cloudinary.com'], // allow Cloudinary images
  },
};

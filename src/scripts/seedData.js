// Script to seed test data into MongoDB
// Run with: node src/scripts/seedData.js

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Brand = require('../modules/brand/brand.model');
const Category = require('../modules/category/category.model');
const Product = require('../modules/product/product.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Brand.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create brands
    const brands = await Brand.insertMany([
      { name: 'Apple', description: 'Premium tech products', slug: 'apple' },
      { name: 'Samsung', description: 'Electronics and appliances', slug: 'samsung' },
      { name: 'Sony', description: 'Audio and video equipment', slug: 'sony' },
      { name: 'LG', description: 'Home electronics', slug: 'lg' },
    ]);
    console.log('✅ Brands seeded:', brands.length);

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic devices and gadgets', slug: 'electronics' },
      { name: 'Smartphones', description: 'Mobile phones and accessories', slug: 'smartphones' },
      { name: 'Laptops', description: 'Computers and laptops', slug: 'laptops' },
      { name: 'Accessories', description: 'Tech accessories', slug: 'accessories' },
    ]);
    console.log('✅ Categories seeded:', categories.length);

    // Create products
    const products = await Product.insertMany([
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Latest Apple smartphone with advanced features',
        price: 999,
        brand: brands[0]._id,
        category: categories[1]._id,
        images: ['https://picsum.photos/seed/iphone15/600/600'],
        stock: 50,
        ratingsAverage: 4.8,
        ratingsQuantity: 245,
      },
      {
        name: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        description: 'Flagship Samsung smartphone',
        price: 899,
        brand: brands[1]._id,
        category: categories[1]._id,
        images: ['https://picsum.photos/seed/samsung24/600/600'],
        stock: 45,
        ratingsAverage: 4.6,
        ratingsQuantity: 189,
      },
      {
        name: 'MacBook Pro 16"',
        slug: 'macbook-pro-16',
        description: 'Powerful laptop for professionals',
        price: 2499,
        brand: brands[0]._id,
        category: categories[2]._id,
        images: ['https://picsum.photos/seed/macbook16/600/600'],
        stock: 20,
        ratingsAverage: 4.9,
        ratingsQuantity: 156,
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh-1000xm5',
        description: 'Premium noise-cancelling headphones',
        price: 399,
        brand: brands[2]._id,
        category: categories[3]._id,
        images: ['https://picsum.photos/seed/sonyheadphones/600/600'],
        stock: 100,
        ratingsAverage: 4.7,
        ratingsQuantity: 432,
      },
      {
        name: 'LG UltraWide Monitor',
        slug: 'lg-ultrawide-monitor',
        description: '38 inch ultra-wide curved monitor',
        price: 1299,
        brand: brands[3]._id,
        category: categories[0]._id,
        images: ['https://picsum.photos/seed/lgmonitor/600/600'],
        stock: 15,
        ratingsAverage: 4.5,
        ratingsQuantity: 87,
      },
      {
        name: 'Apple Watch Series 9',
        slug: 'apple-watch-series-9',
        description: 'Advanced fitness tracker and smartwatch',
        price: 399,
        brand: brands[0]._id,
        category: categories[3]._id,
        images: ['https://picsum.photos/seed/applewatch9/600/600'],
        stock: 60,
        ratingsAverage: 4.6,
        ratingsQuantity: 198,
      },
    ]);
    console.log('✅ Products seeded:', products.length);

    console.log('\n✅ Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
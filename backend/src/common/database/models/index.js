const sequelize = require('../../../config/database');
const User = require('./User');
const Address = require('./Address');
const Category = require('./Category');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const CartItem = require('./CartItem');
const Order = require('./Order');
const Store = require('./Store');
const Logistics = require('./Logistics');
const Collection = require('./Collection');
const Banner = require('./Banner');
const Upload = require('./Upload');
const ExchangeRate = require('./ExchangeRate');
const VerificationCode = require('./VerificationCode');
const LoginAttempt = require('./LoginAttempt');
const Session = require('./Session');
const ImChat = require('./ImChat');
const CommentLead = require('./CommentLead');
const SourcingAlert = require('./SourcingAlert');
const ScrapedPost = require('./ScrapedPost');

// --- Associations ---

// User → Address
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'user_id' });

// User → CartItem
User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cartItems' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });

// User → Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// User → Store
User.hasOne(Store, { foreignKey: 'owner_id', as: 'store' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// User → Collection
User.hasMany(Collection, { foreignKey: 'user_id', as: 'collections' });
Collection.belongsTo(User, { foreignKey: 'user_id' });

// User → Logistics
User.hasMany(Logistics, { foreignKey: 'user_id', as: 'logistics' });
Logistics.belongsTo(User, { foreignKey: 'user_id' });

// User → Session
User.hasMany(Session, { foreignKey: 'user_id', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'user_id' });

// Category (self-referential)
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

// Category → Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// Product → ProductVariant
Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id' });

// Product → CartItem
Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

// Product → Collection
Product.hasMany(Collection, { foreignKey: 'product_id' });
Collection.belongsTo(Product, { foreignKey: 'product_id' });

// Store → Product
Store.hasMany(Product, { foreignKey: 'store_id', as: 'products' });
Product.belongsTo(Store, { foreignKey: 'store_id' });

// Order → Address
Address.hasMany(Order, { foreignKey: 'shipping_address_id' });
Order.belongsTo(Address, { foreignKey: 'shipping_address_id', as: 'shippingAddress' });

// Order → Logistics
Logistics.hasMany(Order, { foreignKey: 'logistics_id' });
Order.belongsTo(Logistics, { foreignKey: 'logistics_id', as: 'logisticsInfo' });

// ProductVariant → CartItem
ProductVariant.hasMany(CartItem, { foreignKey: 'variant_id' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variant_id' });

const models = {
  User,
  Address,
  Category,
  Product,
  ProductVariant,
  CartItem,
  Order,
  Store,
  Logistics,
  Collection,
  Banner,
  Upload,
  ExchangeRate,
  VerificationCode,
  LoginAttempt,
  Session,
  ImChat,
  CommentLead,
  SourcingAlert,
  ScrapedPost,
  sequelize,
};

module.exports = models;

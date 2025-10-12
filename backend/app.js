var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Gọi các file router và config
var indexRouter = require('./routes/index');
var authRouter = require('./routes/authRoutes'); // 👈 Thêm router đăng ký / đăng nhập
var categoryRoutes = require("./routes/categoryRoutes");
var bannerRoutes = require("./routes/bannerRoutes");
var database = require('./config/db');

var app = express();

// ✅ Kết nối MongoDB
database.connect();

// ✅ Middleware
app.use(logger('dev'));
app.use(cors()); // Cho phép gọi từ React Native
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Định nghĩa routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter); // /api/auth/register, /api/auth/login
// 🧩 Routes danh mục
app.use("/api/categories", categoryRoutes);
//Banner
app.use("/api/banners", bannerRoutes);

// ✅ Bắt lỗi 404
app.use(function (req, res, next) {
  res.status(404).json({ message: 'Không tìm thấy trang!' });
});

// ✅ Xử lý lỗi chung
app.use(function (err, req, res, next) {
  console.error('🔥 Lỗi:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Lỗi server!',
  });
});

module.exports = app;

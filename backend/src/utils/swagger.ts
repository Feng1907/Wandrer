import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wandrer API',
      version: '1.0.0',
      description: 'REST API cho nền tảng đặt tour du lịch Wandrer',
      contact: { name: 'Wandrer Team', email: 'support@wandrer.vn' },
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Development' },
      { url: 'https://api.wandrer.vn/api', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Tour: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
            basePrice: { type: 'number' },
            childPrice: { type: 'number' },
            duration: { type: 'integer' },
            maxCapacity: { type: 'integer' },
            category: { type: 'string', enum: ['RESORT', 'ADVENTURE', 'TREKKING', 'MICE', 'CULTURAL', 'CRUISE'] },
            status: { type: 'string', enum: ['DRAFT', 'ACTIVE', 'INACTIVE'] },
            featured: { type: 'boolean' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] },
            totalPrice: { type: 'number' },
            contactName: { type: 'string' },
            contactEmail: { type: 'string' },
            contactPhone: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['CUSTOMER', 'ADMIN', 'STAFF', 'GUIDE'] },
            loyaltyPoints: { type: 'integer' },
          },
        },
        Error: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Xác thực người dùng' },
      { name: 'Tours', description: 'Quản lý tour du lịch' },
      { name: 'Bookings', description: 'Đặt tour' },
      { name: 'Users', description: 'Quản lý người dùng' },
      { name: 'Reviews', description: 'Đánh giá tour' },
      { name: 'Analytics', description: 'Thống kê & báo cáo' },
      { name: 'Discounts', description: 'Mã giảm giá' },
      { name: 'Loyalty', description: 'Điểm thưởng' },
      { name: 'Payment', description: 'Thanh toán' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

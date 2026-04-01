const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "QuanLyTrungTamTiengAnh API",
      version: "1.0.0",
      description: "Tai lieu API tu dong cho he thong quan ly trung tam tieng Anh.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "OK" },
          },
        },
      },
    },
    paths: {
      "/login": {
        post: {
          tags: ["Auth"],
          summary: "Dang nhap",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "admin@gmail.com" },
                    password: { type: "string", example: "123456" },
                  },
                  required: ["email", "password"],
                },
              },
            },
          },
          responses: { 200: { description: "Dang nhap thanh cong" } },
        },
      },
      "/register": {
        post: {
          tags: ["Auth"],
          summary: "Dang ky",
          responses: { 200: { description: "Dang ky thanh cong" } },
        },
      },
      "/admin/users/admins": {
        get: {
          tags: ["Admin Users"],
          summary: "Lay danh sach admin",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Danh sach admin" } },
        },
        post: {
          tags: ["Admin Users"],
          summary: "Tao admin",
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: "Tao thanh cong" } },
        },
      },
      "/admin/users/admins/{id}": {
        get: {
          tags: ["Admin Users"],
          summary: "Lay chi tiet admin",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Chi tiet admin" } },
        },
        put: {
          tags: ["Admin Users"],
          summary: "Cap nhat admin",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Cap nhat thanh cong" } },
        },
      },
      "/admin/users/admins/{id}/status": {
        patch: {
          tags: ["Admin Users"],
          summary: "Khoa/mo khoa admin",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Cap nhat trang thai thanh cong" } },
        },
      },
      "/admin/users/teachers": {
        get: {
          tags: ["Teacher Users"],
          summary: "Lay danh sach giang vien",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Danh sach giang vien" } },
        },
        post: {
          tags: ["Teacher Users"],
          summary: "Tao giang vien",
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: "Tao thanh cong" } },
        },
      },
      "/admin/users/teachers/{id}": {
        get: {
          tags: ["Teacher Users"],
          summary: "Lay chi tiet giang vien",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Chi tiet giang vien" } },
        },
        put: {
          tags: ["Teacher Users"],
          summary: "Cap nhat giang vien",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Cap nhat thanh cong" } },
        },
      },
      "/admin/users/teachers/{id}/status": {
        patch: {
          tags: ["Teacher Users"],
          summary: "Khoa/mo khoa giang vien",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Cap nhat trang thai thanh cong" } },
        },
      },
      "/admin/users/students": {
        get: {
          tags: ["Student Users"],
          summary: "Lay danh sach hoc vien",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Danh sach hoc vien" } },
        },
        post: {
          tags: ["Student Users"],
          summary: "Tao hoc vien",
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: "Tao thanh cong" } },
        },
      },
      "/admin/users/students/{id}": {
        get: {
          tags: ["Student Users"],
          summary: "Lay chi tiet hoc vien",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Chi tiet hoc vien" } },
        },
        put: {
          tags: ["Student Users"],
          summary: "Cap nhat hoc vien",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Cap nhat thanh cong" } },
        },
      },
      "/admin/users/students/{id}/status": {
        patch: {
          tags: ["Student Users"],
          summary: "Khoa/mo khoa hoc vien",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Cap nhat trang thai thanh cong" } },
        },
      },
      "/admin/facilities": {
        get: {
          tags: ["Facilities"],
          summary: "Lay danh sach co so",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Danh sach co so" } },
        },
        post: {
          tags: ["Facilities"],
          summary: "Tao co so",
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: "Tao thanh cong" } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

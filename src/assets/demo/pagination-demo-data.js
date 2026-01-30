// src/demo/pagination-demo-data.js

export const demoRows = Array.from({ length: 423 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

export const totalRows = demoRows.length;

// Optional: a tiny helper you can import in stories
export function rowsForPage(page, pageSize) {
  const start = (page - 1) * pageSize;
  return demoRows.slice(start, start + pageSize);
}

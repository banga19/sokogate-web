const { getPagination, getPagingMeta } = require('../../src/common/utils/pagination');

describe('Pagination', () => {
  describe('getPagination', () => {
    it('should return default page 1 and pageSize 20', () => {
      const result = getPagination();
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.offset).toBe(0);
      expect(result.limit).toBe(20);
    });

    it('should calculate correct offset', () => {
      const result = getPagination(3, 10);
      expect(result.page).toBe(3);
      expect(result.pageSize).toBe(10);
      expect(result.offset).toBe(20);
      expect(result.limit).toBe(10);
    });

    it('should not allow page less than 1', () => {
      const result = getPagination(0, 20);
      expect(result.page).toBe(1);
    });

    it('should not allow pageSize greater than 100', () => {
      const result = getPagination(1, 500);
      expect(result.pageSize).toBe(100);
    });

    it('should not allow pageSize less than 1', () => {
      const result = getPagination(1, 0);
      expect(result.pageSize).toBe(1);
    });
  });

  describe('getPagingMeta', () => {
    it('should calculate correct total pages', () => {
      const meta = getPagingMeta(100, 1, 20);
      expect(meta.total).toBe(100);
      expect(meta.totalPages).toBe(5);
    });

    it('should handle zero total', () => {
      const meta = getPagingMeta(0, 1, 20);
      expect(meta.totalPages).toBe(0);
    });
  });
});

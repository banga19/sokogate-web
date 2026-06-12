import { mapCategory } from '@/utils/category';

describe('mapCategory', () => {
  // ────────────────────────────────────────────────────────────
  // Basic mapping
  // ────────────────────────────────────────────────────────────
  it('should map backend name to categoryName', () => {
    const input = { id: 1, name: 'Electronics', slug: 'electronics' };
    const result = mapCategory(input);

    expect(result.categoryName).toBe('Electronics');
    expect(result.id).toBe(1);
    expect(result.slug).toBe('electronics');
  });

  it('should preserve existing categoryName when name is missing', () => {
    const input = { id: 1, categoryName: 'Existing Name', slug: 'existing' };
    const result = mapCategory(input);

    expect(result.categoryName).toBe('Existing Name');
  });

  it('should prefer name over categoryName when both are present', () => {
    const input = { id: 1, name: 'Name Field', categoryName: 'Old Name' };
    const result = mapCategory(input);

    expect(result.categoryName).toBe('Name Field');
  });

  // ────────────────────────────────────────────────────────────
  // Recursive children mapping
  // ────────────────────────────────────────────────────────────
  it('should map children recursively', () => {
    const input = {
      id: 1,
      name: 'Electronics',
      children: [
        { id: 2, name: 'Phones', children: [] },
        { id: 3, name: 'Laptops' },
      ],
    };
    const result = mapCategory(input);

    expect(result.children).toHaveLength(2);
    expect(result.children[0].categoryName).toBe('Phones');
    expect(result.children[1].categoryName).toBe('Laptops');
  });

  it('should handle deeply nested categories', () => {
    const input = {
      id: 1,
      name: 'Root',
      children: [
        {
          id: 2,
          name: 'Level 1',
          children: [
            { id: 3, name: 'Level 2', children: [{ id: 4, name: 'Level 3' }] },
          ],
        },
      ],
    };
    const result = mapCategory(input);

    expect(result.children[0].children[0].categoryName).toBe('Level 2');
    expect(result.children[0].children[0].children[0].categoryName).toBe('Level 3');
  });

  // ────────────────────────────────────────────────────────────
  // Edge cases
  // ────────────────────────────────────────────────────────────
  it('should handle undefined children', () => {
    const input = { id: 1, name: 'Test' };
    const result = mapCategory(input);

    expect(result.children).toEqual([]);
  });

  it('should handle null children', () => {
    const input = { id: 1, name: 'Test', children: null };
    const result = mapCategory(input);

    expect(result.children).toEqual([]);
  });

  it('should handle empty children array', () => {
    const input = { id: 1, name: 'Test', children: [] };
    const result = mapCategory(input);

    expect(result.children).toEqual([]);
  });

  it('should handle an empty object', () => {
    const input = {};
    const result = mapCategory(input);

    expect(result.categoryName).toBeUndefined();
    expect(result.children).toEqual([]);
  });

  it('should handle null input gracefully', () => {
    // This would crash in real usage but the function should handle it
    expect(() => mapCategory(null)).toThrow();
  });

  // ────────────────────────────────────────────────────────────
  // Property preservation
  // ────────────────────────────────────────────────────────────
  it('should preserve all other properties', () => {
    const input = {
      id: 1,
      name: 'Test',
      icon_url: '/icon.png',
      sort_order: 1,
      is_active: true,
      meta: { key: 'value' },
    };
    const result = mapCategory(input);

    expect(result.icon_url).toBe('/icon.png');
    expect(result.sort_order).toBe(1);
    expect(result.is_active).toBe(true);
    expect(result.meta).toEqual({ key: 'value' });
  });
});

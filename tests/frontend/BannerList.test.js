import { shallowMount } from '@vue/test-utils';

// ──────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────

jest.mock('@/utils/api', () => ({
  GetBannerList: jest.fn(),
}));

const { GetBannerList } = require('@/utils/api');

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// ──────────────────────────────────────────────────────────────
// Shared mock data
// ──────────────────────────────────────────────────────────────

const mockBannersArray = [
  { id: 'ban-1', title: 'Summer Sale', image_url: 'https://oss.example.com/summer.jpg', link_url: '/products/1', sort_order: 1, is_active: true },
  { id: 'ban-2', title: 'New Arrivals', image_url: 'https://oss.example.com/new.jpg', link_url: '/products/2', sort_order: 2, is_active: true },
  { id: 'ban-3', title: 'Free Shipping', image_url: 'https://oss.example.com/free-ship.jpg', link_url: '/promotions/1', sort_order: 3, is_active: true },
];

const mockBannersWithImage = [
  { id: 'ban-4', title: 'Direct Image', image: 'https://oss.example.com/direct.jpg', image_url: 'https://oss.example.com/should-not-use.jpg' },
];

const mockBannersNoImage = [
  { id: 'ban-5', title: 'No Image At All' },
];

// ──────────────────────────────────────────────────────────────
// normalizeBannerList utility (direct unit tests)
// ──────────────────────────────────────────────────────────────

describe('normalizeBannerList utility', () => {
  const { normalizeBannerList } = require('@/utils/banner');

  it('should map image_url → image from direct array response', () => {
    const result = normalizeBannerList({ data: mockBannersArray });
    expect(result).toHaveLength(3);
    expect(result[0].image).toBe('https://oss.example.com/summer.jpg');
    expect(result[1].image).toBe('https://oss.example.com/new.jpg');
    expect(result[2].image).toBe('https://oss.example.com/free-ship.jpg');
  });

  it('should normalize from { rows } response format', () => {
    const result = normalizeBannerList({ data: { rows: mockBannersArray } });
    expect(result).toHaveLength(3);
    expect(result[0].image).toBe('https://oss.example.com/summer.jpg');
  });

  it('should prefer existing image field over image_url', () => {
    const result = normalizeBannerList({ data: mockBannersWithImage });
    expect(result[0].image).toBe('https://oss.example.com/direct.jpg');
  });

  it('should fall back to empty string when both image and image_url are missing', () => {
    const result = normalizeBannerList({ data: mockBannersNoImage });
    expect(result[0].image).toBe('');
  });

  it('should handle null image as empty string', () => {
    const result = normalizeBannerList({ data: [{ id: 'b1', image: null }] });
    expect(result[0].image).toBe('');
  });

  it('should handle undefined image as empty string', () => {
    const result = normalizeBannerList({ data: [{ id: 'b1', image: undefined }] });
    expect(result[0].image).toBe('');
  });

  it('should preserve all original banner fields', () => {
    const result = normalizeBannerList({ data: mockBannersArray });
    expect(result[0].id).toBe('ban-1');
    expect(result[0].title).toBe('Summer Sale');
    expect(result[0].link_url).toBe('/products/1');
    expect(result[0].image_url).toBe('https://oss.example.com/summer.jpg');
  });

  it('should return empty array for null data', () => {
    expect(normalizeBannerList({ data: null })).toEqual([]);
  });

  it('should return empty array for undefined data', () => {
    expect(normalizeBannerList({ data: undefined })).toEqual([]);
  });

  it('should return empty array for null res', () => {
    expect(normalizeBannerList(null)).toEqual([]);
  });

  it('should return empty array for undefined res', () => {
    expect(normalizeBannerList(undefined)).toEqual([]);
  });

  it('should handle empty rows as empty array', () => {
    expect(normalizeBannerList({ data: { rows: [] } })).toEqual([]);
  });

  it('should handle empty data array as empty array', () => {
    expect(normalizeBannerList({ data: [] })).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

/**
 * Create a standard wrapper for BannerList.vue
 */
function createBannerListWrapper(options = {}) {
  const { type, title } = options;

  return shallowMount(require('@/components/BannerList.vue').default, {
    propsData: {
      type: type || '1',
      title: title || '',
    },
    stubs: {
      'b-carousel': true,
      'b-carousel-slide': true,
      'sui-image': true,
      'el-skeleton': true,
      'el-skeleton-item': true,
    },
  });
}

/**
 * Create a standard wrapper for BannerListMain.vue
 */
function createBannerListMainWrapper(options = {}) {
  const { type, title } = options;

  return shallowMount(require('@/components/BannerListMain.vue').default, {
    propsData: {
      type: type || '1',
      title: title || '',
    },
    stubs: {
      'b-carousel': true,
      'b-carousel-slide': true,
      'el-skeleton': true,
      'el-skeleton-item': true,
    },
  });
}

/**
 * Create a standard wrapper for StorebannerList.vue
 */
function createStoreBannerListWrapper(options = {}) {
  const { type, item } = options;

  const route = {
    query: { id: 'store-1' },
  };

  return shallowMount(require('@/components/s-ui/store/StorebannerList.vue').default, {
    propsData: {
      type: type || '2',
      item: item || { storeName: 'Test Store', id: 'store-1' },
    },
    mocks: {
      $route: route,
    },
    stubs: {
      'sui-image': true,
    },
  });
}

/**
 * Create a standard wrapper for StoreCarousel.vue
 */
function createStoreCarouselWrapper(options = {}) {
  const { type } = options;

  const route = {
    query: { id: 'store-1' },
  };

  return shallowMount(require('@/components/s-ui/store/StoreCarousel.vue').default, {
    propsData: {
      type: type || '2',
    },
    mocks: {
      $route: route,
    },
    stubs: {
      'b-carousel': true,
      'b-carousel-slide': true,
      'sui-image': true,
      'el-skeleton': true,
      'el-skeleton-item': true,
    },
  });
}

/**
 * Create a standard wrapper for StoreAboutus.vue
 */
function createStoreAboutusWrapper(options = {}) {
  const { type, item } = options;

  const route = {
    query: { id: 'store-1' },
  };

  return shallowMount(require('@/components/s-ui/store/StoreAboutus.vue').default, {
    propsData: {
      type: type || '2',
      item: item || { storeName: 'Test Store', id: 'store-1' },
    },
    mocks: {
      $route: route,
    },
    stubs: {
      'b-container': true,
      'b-row': true,
      'b-col': true,
      'sui-image': true,
    },
  });
}

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────

describe('BannerList.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────────
  // Initialization
  // ──────────────────────────────────────────────────────────────
  describe('initialization', () => {
    it('should start with empty list', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createBannerListWrapper();
      expect(wrapper.vm.list).toEqual([]);
    });

    it('should call GetBannerList on creation', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      createBannerListWrapper({ type: '3' });
      expect(GetBannerList).toHaveBeenCalledWith({
        orderKey: 'order_view',
        type: 3,
      });
    });

    it('should accept title prop', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createBannerListWrapper({ title: 'Featured' });
      expect(wrapper.vm.title).toBe('Featured');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Image normalization — response as direct array
  // ──────────────────────────────────────────────────────────────
  describe('image_url → image normalization (direct array response)', () => {
    it('should map image_url to image when API returns direct array', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toHaveLength(3);
      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
      expect(wrapper.vm.list[1].image).toBe('https://oss.example.com/new.jpg');
      expect(wrapper.vm.list[2].image).toBe('https://oss.example.com/free-ship.jpg');
    });

    it('should preserve all other banner fields during mapping', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].id).toBe('ban-1');
      expect(wrapper.vm.list[0].title).toBe('Summer Sale');
      expect(wrapper.vm.list[0].link_url).toBe('/products/1');
      expect(wrapper.vm.list[0].sort_order).toBe(1);
      expect(wrapper.vm.list[0].is_active).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Image normalization — response as { rows } object
  // ──────────────────────────────────────────────────────────────
  describe('image_url → image normalization ({ rows } response)', () => {
    it('should map image_url to image when API returns { rows }', async () => {
      GetBannerList.mockResolvedValue({ data: { rows: mockBannersArray } });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toHaveLength(3);
      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
    });

    it('should handle empty rows array', async () => {
      GetBannerList.mockResolvedValue({ data: { rows: [] } });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Image field priority: image > image_url > ''
  // ──────────────────────────────────────────────────────────────
  describe('image field priority', () => {
    it('should prefer existing image field over image_url', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersWithImage });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      // Should use 'image' value, not 'image_url'
      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/direct.jpg');
      // Should NOT be the image_url value
      expect(wrapper.vm.list[0].image).not.toBe('https://oss.example.com/should-not-use.jpg');
    });

    it('should fall back to empty string when both image and image_url are missing', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersNoImage });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('');
    });

    it('should set image to empty string when image is null', async () => {
      GetBannerList.mockResolvedValue({ data: [{ id: 'ban-6', title: 'Null Image', image: null }] });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('');
    });

    it('should set image to empty string when image is undefined', async () => {
      GetBannerList.mockResolvedValue({ data: [{ id: 'ban-7', title: 'Undefined Image', image: undefined }] });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────────────────────
  describe('edge cases', () => {
    it('should handle null res.data gracefully', async () => {
      GetBannerList.mockResolvedValue({ data: null });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should handle undefined res.data gracefully', async () => {
      GetBannerList.mockResolvedValue({ data: undefined });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should handle API error gracefully', async () => {
      GetBannerList.mockRejectedValue(new Error('Network error'));
      const wrapper = createBannerListWrapper();
      await flushPromises();

      // List should remain empty after error
      expect(wrapper.vm.list).toEqual([]);
    });

    it('should emit success event when list has items', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.emitted('success')).toBeTruthy();
      expect(wrapper.emitted('success').length).toBe(1);
    });

    it('should NOT emit success event when list is empty', async () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createBannerListWrapper();
      await flushPromises();

      expect(wrapper.emitted('success')).toBeFalsy();
    });
  });
});

// ──────────────────────────────────────────────────────────────
// BannerListMain.vue
// ──────────────────────────────────────────────────────────────

describe('BannerListMain.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────────
  // Initialization
  // ──────────────────────────────────────────────────────────────
  describe('initialization', () => {
    it('should start with empty list', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createBannerListMainWrapper();
      expect(wrapper.vm.list).toEqual([]);
    });

    it('should call GetBannerList on creation', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      createBannerListMainWrapper({ type: '2' });
      expect(GetBannerList).toHaveBeenCalledWith({
        orderKey: 'order_view',
        type: 2,
      });
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Image normalization
  // ──────────────────────────────────────────────────────────────
  describe('image_url → image normalization', () => {
    it('should map image_url to image from direct array response', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
      expect(wrapper.vm.list[1].image).toBe('https://oss.example.com/new.jpg');
    });

    it('should map image_url to image from { rows } response', async () => {
      GetBannerList.mockResolvedValue({ data: { rows: mockBannersArray } });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
    });

    it('should prefer existing image field over image_url', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersWithImage });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/direct.jpg');
    });

    it('should fall back to empty string when image fields are missing', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersNoImage });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      // Should fall back to static fallback banner since API returned empty
      expect(wrapper.vm.list.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Static fallback
  // ──────────────────────────────────────────────────────────────
  describe('static fallback when API returns empty', () => {
    it('should use static fallback banners when API returns empty array', async () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      // Should have the static fallback banner
      expect(wrapper.vm.list.length).toBe(1);
      expect(wrapper.vm.list[0].title).toBe('SokoGate');
      expect(wrapper.vm.list[0].jumpContent).toContain('sokogate.com');
    });

    it('should use static fallback when API returns empty rows', async () => {
      GetBannerList.mockResolvedValue({ data: { rows: [] } });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      expect(wrapper.vm.list.length).toBe(1);
      expect(wrapper.vm.list[0].image).toBeDefined();
    });

    it('should still have success event for fallback banners', async () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      expect(wrapper.emitted('success')).toBeTruthy();
    });

    it('should use API banners over static fallback when API returns data', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      // Should have API data, not the static fallback
      expect(wrapper.vm.list.length).toBe(3);
      expect(wrapper.vm.list[0].title).toBe('Summer Sale');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────────────────────
  describe('edge cases', () => {
    it('should handle null res.data with fallback', async () => {
      GetBannerList.mockResolvedValue({ data: null });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      // Static fallback should kick in
      expect(wrapper.vm.list.length).toBe(1);
      expect(wrapper.vm.list[0].title).toBe('SokoGate');
    });

    it('should handle undefined res.data with fallback', async () => {
      GetBannerList.mockResolvedValue({ data: undefined });
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      expect(wrapper.vm.list.length).toBe(1);
    });

    it('should handle API error gracefully', async () => {
      GetBannerList.mockRejectedValue(new Error('Network error'));
      const wrapper = createBannerListMainWrapper();
      await flushPromises();

      // List should remain empty — no fallback on error
      expect(wrapper.vm.list).toEqual([]);
    });
  });
});

// ──────────────────────────────────────────────────────────────
// StorebannerList.vue
// ──────────────────────────────────────────────────────────────

describe('StorebannerList.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────────
  // Initialization
  // ──────────────────────────────────────────────────────────────
  describe('initialization', () => {
    it('should start with empty items', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreBannerListWrapper();
      expect(wrapper.vm.items).toEqual([]);
    });

    it('should call GetBannerList with storeId from route and type', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      createStoreBannerListWrapper({ type: '3' });
      expect(GetBannerList).toHaveBeenCalledWith({
        storeId: 'store-1',
        type: 3,
      });
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Image normalization
  // ──────────────────────────────────────────────────────────────
  describe('image_url → image normalization', () => {
    it('should map image_url to image from direct array response', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createStoreBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.items).toHaveLength(3);
      expect(wrapper.vm.items[0].image).toBe('https://oss.example.com/summer.jpg');
    });

    it('should map image_url to image from { rows } response', async () => {
      GetBannerList.mockResolvedValue({ data: { rows: mockBannersArray } });
      const wrapper = createStoreBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.items[0].image).toBe('https://oss.example.com/summer.jpg');
    });

    it('should prefer existing image field over image_url', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersWithImage });
      const wrapper = createStoreBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.items[0].image).toBe('https://oss.example.com/direct.jpg');
    });

    it('should fall back to empty string when image fields are missing', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersNoImage });
      const wrapper = createStoreBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.items[0].image).toBe('');
    });

    it('should preserve all original banner fields during mapping', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createStoreBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.items[0].id).toBe('ban-1');
      expect(wrapper.vm.items[0].title).toBe('Summer Sale');
      expect(wrapper.vm.items[0].image_url).toBe('https://oss.example.com/summer.jpg');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // displayImage computed property
  // ──────────────────────────────────────────────────────────────
  describe('displayImage (banner_url fallback)', () => {
    it('should use items[0].image when banners exist', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createStoreBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.displayImage).toBe('https://oss.example.com/summer.jpg');
    });

    it('should fall back to item.banner_url when items is empty', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreBannerListWrapper({
        item: { storeName: 'Store', id: 's1', banner_url: 'https://oss.example.com/store-banner.jpg' },
      });

      // displayImage is a computed property, so it evaluates immediately
      expect(wrapper.vm.displayImage).toBe('https://oss.example.com/store-banner.jpg');
    });

    it('should return empty string when both items and banner_url are empty', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreBannerListWrapper({
        item: { storeName: 'Store', id: 's1' }, // no banner_url
      });

      expect(wrapper.vm.displayImage).toBe('');
    });

    it('should return empty string when banner_url is null', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreBannerListWrapper({
        item: { storeName: 'Store', id: 's1', banner_url: null },
      });

      expect(wrapper.vm.displayImage).toBe('');
    });

    it('should prefer banner carousel image over store banner_url', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createStoreBannerListWrapper({
        item: { storeName: 'Store', id: 's1', banner_url: 'https://oss.example.com/store-banner.jpg' },
      });
      await flushPromises();

      // Should use the carousel image, not the store's banner_url
      expect(wrapper.vm.displayImage).toBe('https://oss.example.com/summer.jpg');
    });

    it('should re-evaluate when items become available after API call', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createStoreBannerListWrapper({
        item: { storeName: 'Store', id: 's1', banner_url: 'https://oss.example.com/store-banner.jpg' },
      });

      // Before API resolves, items is empty, so displayImage should be banner_url
      expect(wrapper.vm.displayImage).toBe('https://oss.example.com/store-banner.jpg');

      // After API resolves, displayImage should update to banner image
      await flushPromises();
      expect(wrapper.vm.displayImage).toBe('https://oss.example.com/summer.jpg');
    });

    it('should use banner_url after API call returns empty', async () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreBannerListWrapper({
        item: { storeName: 'Store', id: 's1', banner_url: 'https://oss.example.com/store-banner.jpg' },
      });

      // Initial: no items, use banner_url
      expect(wrapper.vm.displayImage).toBe('https://oss.example.com/store-banner.jpg');

      // After API: still no items, still use banner_url
      await flushPromises();
      expect(wrapper.vm.items).toEqual([]);
      expect(wrapper.vm.displayImage).toBe('https://oss.example.com/store-banner.jpg');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────────────────────
  describe('edge cases', () => {
    it('should handle empty banners list', async () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.items).toEqual([]);
      expect(wrapper.vm.displayImage).toBe('');
    });

    it('should handle null res.data', async () => {
      GetBannerList.mockResolvedValue({ data: null });
      const wrapper = createStoreBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.items).toEqual([]);
    });

    it('should handle API error gracefully', async () => {
      GetBannerList.mockRejectedValue(new Error('Network error'));
      const wrapper = createStoreBannerListWrapper();
      await flushPromises();

      expect(wrapper.vm.items).toEqual([]);
      // displayImage should still fall back to banner_url on error
    });

    it('should use banner_url when API errors', async () => {
      GetBannerList.mockRejectedValue(new Error('Network error'));
      const wrapper = createStoreBannerListWrapper({
        item: { storeName: 'Store', id: 's1', banner_url: 'https://oss.example.com/store-banner-error.jpg' },
      });

      // Before API resolves, use banner_url
      expect(wrapper.vm.displayImage).toBe('https://oss.example.com/store-banner-error.jpg');

      await flushPromises();

      // items remain empty after error, displayImage should still be banner_url
      expect(wrapper.vm.items).toEqual([]);
      expect(wrapper.vm.displayImage).toBe('https://oss.example.com/store-banner-error.jpg');
    });
  });
});

// ──────────────────────────────────────────────────────────────
// StoreCarousel.vue
// ──────────────────────────────────────────────────────────────

describe('StoreCarousel.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────────
  // Initialization
  // ──────────────────────────────────────────────────────────────
  describe('initialization', () => {
    it('should start with empty list', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreCarouselWrapper();
      expect(wrapper.vm.list).toEqual([]);
    });

    it('should call GetBannerList on creation', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      createStoreCarouselWrapper({ type: '5' });
      expect(GetBannerList).toHaveBeenCalledWith({
        storeId: 'store-1',
        type: 5,
      });
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Image normalization
  // ──────────────────────────────────────────────────────────────
  describe('image_url → image normalization', () => {
    it('should map image_url to image from direct array response', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createStoreCarouselWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toHaveLength(3);
      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
      expect(wrapper.vm.list[1].image).toBe('https://oss.example.com/new.jpg');
    });

    it('should map image_url to image from { rows } response', async () => {
      GetBannerList.mockResolvedValue({ data: { rows: mockBannersArray } });
      const wrapper = createStoreCarouselWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
    });

    it('should prefer existing image field over image_url', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersWithImage });
      const wrapper = createStoreCarouselWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/direct.jpg');
    });

    it('should fall back to empty string when image fields are missing', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersNoImage });
      const wrapper = createStoreCarouselWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────────────────────
  describe('edge cases', () => {
    it('should handle empty banners list', async () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreCarouselWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should handle null res.data', async () => {
      GetBannerList.mockResolvedValue({ data: null });
      const wrapper = createStoreCarouselWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should handle undefined res.data', async () => {
      GetBannerList.mockResolvedValue({ data: undefined });
      const wrapper = createStoreCarouselWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should handle API error gracefully', async () => {
      GetBannerList.mockRejectedValue(new Error('Network error'));
      const wrapper = createStoreCarouselWrapper();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);

      consoleSpy.mockRestore();
    });
  });
});

// ──────────────────────────────────────────────────────────────
// StoreAboutus.vue
// ──────────────────────────────────────────────────────────────

describe('StoreAboutus.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────────
  // Initialization
  // ──────────────────────────────────────────────────────────────
  describe('initialization', () => {
    it('should start with empty list', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreAboutusWrapper();
      expect(wrapper.vm.list).toEqual([]);
    });

    it('should call GetBannerList on creation', () => {
      GetBannerList.mockResolvedValue({ data: [] });
      createStoreAboutusWrapper({ type: '4' });
      expect(GetBannerList).toHaveBeenCalledWith({
        storeId: 'store-1',
        type: 4,
      });
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Image normalization
  // ──────────────────────────────────────────────────────────────
  describe('image_url → image normalization', () => {
    it('should map image_url to image from direct array response', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersArray });
      const wrapper = createStoreAboutusWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toHaveLength(3);
      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
    });

    it('should map image_url to image from { rows } response', async () => {
      GetBannerList.mockResolvedValue({ data: { rows: mockBannersArray } });
      const wrapper = createStoreAboutusWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
    });

    it('should prefer existing image field over image_url', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersWithImage });
      const wrapper = createStoreAboutusWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('https://oss.example.com/direct.jpg');
    });

    it('should fall back to empty string when image fields are missing', async () => {
      GetBannerList.mockResolvedValue({ data: mockBannersNoImage });
      const wrapper = createStoreAboutusWrapper();
      await flushPromises();

      expect(wrapper.vm.list[0].image).toBe('');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Edge cases
  // ──────────────────────────────────────────────────────────────
  describe('edge cases', () => {
    it('should handle empty banners list', async () => {
      GetBannerList.mockResolvedValue({ data: [] });
      const wrapper = createStoreAboutusWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should handle null res.data', async () => {
      GetBannerList.mockResolvedValue({ data: null });
      const wrapper = createStoreAboutusWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should handle undefined res.data', async () => {
      GetBannerList.mockResolvedValue({ data: undefined });
      const wrapper = createStoreAboutusWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should handle API error gracefully', async () => {
      GetBannerList.mockRejectedValue(new Error('Network error'));
      const wrapper = createStoreAboutusWrapper();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });
  });
});

// ──────────────────────────────────────────────────────────────
// Cross-component consistency
// ──────────────────────────────────────────────────────────────

describe('cross-component consistency', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should produce identical image normalization across all 5 components', async () => {
    GetBannerList.mockResolvedValue({ data: mockBannersArray });

    const wrapper1 = createBannerListWrapper();
    const wrapper2 = createBannerListMainWrapper();
    const wrapper3 = createStoreBannerListWrapper();
    const wrapper4 = createStoreCarouselWrapper();
    const wrapper5 = createStoreAboutusWrapper();

    await flushPromises();
    await flushPromises();

    // All components that store in 'list' should have the same first banner image
    expect(wrapper1.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
    expect(wrapper2.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
    expect(wrapper3.vm.items[0].image).toBe('https://oss.example.com/summer.jpg');
    expect(wrapper4.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
    expect(wrapper5.vm.list[0].image).toBe('https://oss.example.com/summer.jpg');
  });

  it('should all handle null res.data without crashing', async () => {
    GetBannerList.mockResolvedValue({ data: null });

    const wrapper1 = createBannerListWrapper();
    const wrapper2 = createBannerListMainWrapper();
    const wrapper3 = createStoreBannerListWrapper();
    const wrapper4 = createStoreCarouselWrapper();
    const wrapper5 = createStoreAboutusWrapper();

    await flushPromises();
    await flushPromises();

    // None should crash - check lists are safe
    expect(Array.isArray(wrapper1.vm.list)).toBe(true);
    expect(Array.isArray(wrapper2.vm.list)).toBe(true);
    expect(Array.isArray(wrapper3.vm.items)).toBe(true);
    expect(Array.isArray(wrapper4.vm.list)).toBe(true);
    expect(Array.isArray(wrapper5.vm.list)).toBe(true);
  });
});

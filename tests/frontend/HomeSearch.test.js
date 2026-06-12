import { shallowMount } from '@vue/test-utils';
import HomeSearch from '@/components/HomeSearch.vue';

// ──────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────

// Mock the API module
jest.mock('@/utils/api', () => ({
  GetSpuList: jest.fn(),
  GetStorebyName: jest.fn(),
}));

const { GetSpuList, GetStorebyName } = require('@/utils/api');

// Mock i18n $t
const mockT = jest.fn((key) => {
  const translations = {
    'common.product': 'Product',
    'common.store': 'Store',
    'index.search': 'Search',
    'index.noResults': 'No products found',
  };
  return translations[key] || key;
});

// Helper to flush pending promises in the microtask queue
function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

// Create a mock factory for the wrapper
function createWrapper(options = {}) {
  const {
    currency = 'USD',
    routePath = '/',
    routeQuery = {},
  } = options;

  const store = {
    state: { currency },
  };

  // $route is separate from $router in Vue Router
  const route = {
    path: routePath,
    query: routeQuery,
  };

  const router = {
    push: jest.fn(),
  };

  const utils = {
    navto: jest.fn(),
  };

  return shallowMount(HomeSearch, {
    mocks: {
      $t: mockT,
      $store: store,
      $router: router,
      $route: route,
      $utils: utils,
    },
    stubs: {
      'b-form': true,
      'b-input-group': true,
      'b-form-input': true,
      'b-button': true,
      'b-list-group': true,
      'b-list-group-item': true,
      'el-dropdown': true,
      'el-dropdown-menu': true,
      'el-dropdown-item': true,
    },
  });
}

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────

describe('HomeSearch.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────────
  // Initial state
  // ──────────────────────────────────────────────────────────────
  describe('initial state', () => {
    it('should set default search type to "Product" via $t()', () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.changeValue).toBe('Product');
    });

    it('should start with empty keyword and list', () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.keyword).toBe('');
      expect(wrapper.vm.list).toEqual([]);
      expect(wrapper.vm.isFocus).toBe(false);
    });

    it('should read keyword from route query.search in created()', () => {
      const wrapper = createWrapper({
        routeQuery: { search: 'phones' },
        routePath: '/v2/product/list',
      });
      // The created() hook sets this.keyword from this.$route.query.search
      expect(wrapper.vm.keyword).toBe('phones');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // handleCommand
  // ──────────────────────────────────────────────────────────────
  describe('handleCommand', () => {
    it('should update changeValue when command is received', () => {
      const wrapper = createWrapper();

      wrapper.vm.handleCommand('Store');
      expect(wrapper.vm.changeValue).toBe('Store');

      wrapper.vm.handleCommand('Product');
      expect(wrapper.vm.changeValue).toBe('Product');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // onClean
  // ──────────────────────────────────────────────────────────────
  describe('onClean', () => {
    it('should clear keyword and hide the search list', () => {
      const wrapper = createWrapper();
      wrapper.setData({ keyword: 'test', isFocus: true });

      wrapper.vm.onClean();

      expect(wrapper.vm.keyword).toBe('');
      expect(wrapper.vm.isFocus).toBe(false);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // onfocus / onBlur
  // ──────────────────────────────────────────────────────────────
  describe('onfocus', () => {
    it('should set isFocus to true', () => {
      const wrapper = createWrapper();
      wrapper.vm.onfocus();
      expect(wrapper.vm.isFocus).toBe(true);
    });
  });

  describe('onBlur', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should set isFocus to false after 500ms', () => {
      const wrapper = createWrapper();
      wrapper.setData({ isFocus: true });

      wrapper.vm.onBlur();

      // Should still be true immediately
      expect(wrapper.vm.isFocus).toBe(true);

      // Advance time by 500ms
      jest.advanceTimersByTime(500);

      expect(wrapper.vm.isFocus).toBe(false);
    });

    it('should use exactly 500ms delay', () => {
      const wrapper = createWrapper();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      wrapper.vm.onBlur();

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);

      setTimeoutSpy.mockRestore();
    });
  });

  // ──────────────────────────────────────────────────────────────
  // getTeacherList (product search)
  // ──────────────────────────────────────────────────────────────
  describe('getTeacherList', () => {
    it('should call GetSpuList with search keyword and pageSize=8', async () => {
      GetSpuList.mockResolvedValue({ data: { rows: [] } });
      const wrapper = createWrapper();

      wrapper.vm.getTeacherList('phone');
      await flushPromises();

      expect(GetSpuList).toHaveBeenCalledWith({
        search: 'phone',
        pageSize: 8,
      });
    });

    it('should map response data and set the list', async () => {
      const mockProducts = [
        { id: '1', spuName: 'Smartphone', min_price: 200, galleryList: ['img1.jpg'] },
        { id: '2', spuName: 'T-Shirt', min_price: 15 },
      ];
      GetSpuList.mockResolvedValue({ data: { rows: mockProducts } });
      const wrapper = createWrapper();

      wrapper.vm.getTeacherList('phone');
      await flushPromises();

      expect(wrapper.vm.list).toHaveLength(2);
      // First item should have img from galleryList
      expect(wrapper.vm.list[0].img).toBe('img1.jpg');
      // Second item should have empty img (no galleryList)
      expect(wrapper.vm.list[1].img).toBe('');
    });

    it('should extract img from galleryList[0] when item.img is missing', async () => {
      const mockProduct = { id: '1', spuName: 'Phone', galleryList: ['gallery-img.jpg'] };
      GetSpuList.mockResolvedValue({ data: { rows: [mockProduct] } });
      const wrapper = createWrapper();

      wrapper.vm.getTeacherList('phone');
      await flushPromises();

      expect(wrapper.vm.list[0].img).toBe('gallery-img.jpg');
    });

    it('should keep existing img when present', async () => {
      const mockProduct = { id: '1', spuName: 'Phone', img: 'direct-img.jpg', galleryList: ['gallery-img.jpg'] };
      GetSpuList.mockResolvedValue({ data: { rows: [mockProduct] } });
      const wrapper = createWrapper();

      wrapper.vm.getTeacherList('phone');
      await flushPromises();

      // Should use direct img, not galleryList
      expect(wrapper.vm.list[0].img).toBe('direct-img.jpg');
    });

    it('should handle empty response gracefully', async () => {
      GetSpuList.mockResolvedValue({ data: { rows: [] } });
      const wrapper = createWrapper();

      wrapper.vm.getTeacherList('phone');
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should handle missing data.rows gracefully', async () => {
      GetSpuList.mockResolvedValue({ data: {} });
      const wrapper = createWrapper();

      wrapper.vm.getTeacherList('phone');
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should set list to empty on API error', async () => {
      GetSpuList.mockRejectedValue(new Error('Network error'));
      const wrapper = createWrapper();
      wrapper.setData({ list: [{ id: 'old' }] });

      wrapper.vm.getTeacherList('phone');
      // Flush promises twice: once for the rejection, once for the catch handler
      await flushPromises();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should preserve both name and spuName via spread', async () => {
      const mockProduct = { id: '1', name: 'My Phone', spuName: 'SPU Phone' };
      GetSpuList.mockResolvedValue({ data: { rows: [mockProduct] } });
      const wrapper = createWrapper();

      wrapper.vm.getTeacherList('phone');
      await flushPromises();

      expect(wrapper.vm.list[0].name).toBe('My Phone');
      expect(wrapper.vm.list[0].spuName).toBe('SPU Phone');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // getStorebyName
  // ──────────────────────────────────────────────────────────────
  describe('getStorebyName', () => {
    it('should call GetStorebyName with storeName param', async () => {
      GetStorebyName.mockResolvedValue({ data: { rows: [] } });
      const wrapper = createWrapper();

      wrapper.vm.getStorebyName('my-store');
      await flushPromises();

      expect(GetStorebyName).toHaveBeenCalledWith({ storeName: 'my-store' });
    });

    it('should set list from response data.rows', async () => {
      const mockStores = [{ id: 's1', storeName: 'Demo Store' }];
      GetStorebyName.mockResolvedValue({ data: { rows: mockStores } });
      const wrapper = createWrapper();

      wrapper.vm.getStorebyName('demo');
      await flushPromises();

      expect(wrapper.vm.list).toEqual(mockStores);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // onSubmit
  // ──────────────────────────────────────────────────────────────
  describe('onSubmit', () => {
    it('should navigate to product list when searching products', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Product', keyword: 'phone' });
      const event = { preventDefault: jest.fn() };

      wrapper.vm.onSubmit(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(wrapper.vm.$utils.navto).toHaveBeenCalledWith('/v2/product/list', {
        search: 'phone',
      });
    });

    it('should navigate to store list when searching stores', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Store', keyword: 'my-store' });
      const event = { preventDefault: jest.fn() };

      wrapper.vm.onSubmit(event);

      expect(wrapper.vm.$utils.navto).toHaveBeenCalledWith('/v2/store/storeList', {
        search: 'my-store',
      });
    });

    it('should not navigate when keyword is empty', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Product', keyword: '' });
      const event = { preventDefault: jest.fn() };

      wrapper.vm.onSubmit(event);

      expect(wrapper.vm.$utils.navto).not.toHaveBeenCalled();
    });

    it('should handle null event gracefully', () => {
      const wrapper = createWrapper();
      wrapper.setData({ keyword: '' });

      // Should not throw
      expect(() => wrapper.vm.onSubmit(null)).not.toThrow();
    });
  });

  // ──────────────────────────────────────────────────────────────
  // onInput (debounced)
  // ──────────────────────────────────────────────────────────────
  describe('onInput (debounced)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call getTeacherList when changeValue is "Product"', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Product' });

      const getTeacherListSpy = jest.spyOn(wrapper.vm, 'getTeacherList');

      // Trigger the debounced onInput
      wrapper.vm.onInput('phone');

      // Fast-forward past debounce
      jest.advanceTimersByTime(500);

      expect(getTeacherListSpy).toHaveBeenCalledWith('phone');
      getTeacherListSpy.mockRestore();
    });

    it('should call getStorebyName when changeValue is "Store"', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Store' });

      const getStorebyNameSpy = jest.spyOn(wrapper.vm, 'getStorebyName');

      wrapper.vm.onInput('my-store');

      jest.advanceTimersByTime(500);

      expect(getStorebyNameSpy).toHaveBeenCalledWith('my-store');
      getStorebyNameSpy.mockRestore();
    });

    it('should debounce rapid inputs to a single call', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Product' });

      const getTeacherListSpy = jest.spyOn(wrapper.vm, 'getTeacherList');

      // Multiple rapid calls
      wrapper.vm.onInput('a');
      wrapper.vm.onInput('ap');
      wrapper.vm.onInput('app');
      wrapper.vm.onInput('appl');
      wrapper.vm.onInput('apple');

      // Only the last one should fire after 500ms
      jest.advanceTimersByTime(500);

      expect(getTeacherListSpy).toHaveBeenCalledTimes(1);
      expect(getTeacherListSpy).toHaveBeenCalledWith('apple');
      getTeacherListSpy.mockRestore();
    });
  });

  // ──────────────────────────────────────────────────────────────
  // Search list visibility (UI logic)
  // ──────────────────────────────────────────────────────────────
  describe('search list visibility', () => {
    it('should show product search list when focused, has keyword, and changeValue is Product', () => {
      const wrapper = createWrapper();
      wrapper.setData({ isFocus: true, keyword: 'test', changeValue: 'Product', list: [{ id: '1', spuName: 'Test' }] });

      // The v-show condition for product list:
      // isFocus && keyword.length > 0 && changeValue === $t('common.product')
      expect(wrapper.vm.isFocus).toBe(true);
      expect(wrapper.vm.keyword.length > 0).toBe(true);
      expect(wrapper.vm.changeValue).toBe(mockT('common.product'));
    });

    it('should show store search list when focused, has keyword, and changeValue is Store', () => {
      const wrapper = createWrapper();
      wrapper.setData({ isFocus: true, keyword: 'test', changeValue: 'Store' });

      expect(wrapper.vm.isFocus).toBe(true);
      expect(wrapper.vm.keyword.length > 0).toBe(true);
      expect(wrapper.vm.changeValue).toBe(mockT('common.store'));
    });

    it('should hide search list when not focused', () => {
      const wrapper = createWrapper();
      wrapper.setData({ isFocus: false, keyword: 'test' });

      expect(wrapper.vm.isFocus).toBe(false);
    });

    it('should hide search list when keyword is empty', () => {
      const wrapper = createWrapper();
      wrapper.setData({ isFocus: true, keyword: '' });

      expect(wrapper.vm.keyword.length).toBe(0);
    });
  });
});

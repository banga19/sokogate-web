import { shallowMount } from '@vue/test-utils';
import HomeSearch from '@/components/HomeSearch.vue';

// ──────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────

jest.mock('@/utils/api', () => ({
  GetSpuList: jest.fn(),
  GetStorebyName: jest.fn(),
}));

const { GetSpuList, GetStorebyName } = require('@/utils/api');

const mockT = jest.fn((key) => {
  const translations = {
    'common.product': 'Product',
    'common.store': 'Store',
    'index.search': 'Search',
    'index.noResults': 'No products found',
  };
  return translations[key] || key;
});

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function createWrapper(options = {}) {
  const {
    currency = 'USD',
    routePath = '/',
    routeQuery = {},
  } = options;

  const store = {
    state: { currency },
  };

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
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.isFocus).toBe(false);
    });

    it('should read keyword from route query.search in created()', () => {
      const wrapper = createWrapper({
        routeQuery: { search: 'phones' },
        routePath: '/v2/product/list',
      });
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

    it('should clear list when switching search mode', () => {
      const wrapper = createWrapper();
      wrapper.setData({ list: [{ id: '1', spuName: 'Test' }] });

      wrapper.vm.handleCommand('Store');

      expect(wrapper.vm.list).toEqual([]);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // onClean
  // ──────────────────────────────────────────────────────────────
  describe('onClean', () => {
    it('should clear keyword, list, and hide the search list', () => {
      const wrapper = createWrapper();
      wrapper.setData({ keyword: 'test', isFocus: true, list: [{ id: '1' }] });

      wrapper.vm.onClean();

      expect(wrapper.vm.keyword).toBe('');
      expect(wrapper.vm.isFocus).toBe(false);
      expect(wrapper.vm.list).toEqual([]);
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

    it('should re-trigger search when refocusing with keyword', () => {
      const wrapper = createWrapper();
      wrapper.setData({ keyword: 'phone' });
      const onInputSpy = jest.spyOn(wrapper.vm, 'onInput');

      wrapper.vm.onfocus();

      expect(onInputSpy).toHaveBeenCalled();
      onInputSpy.mockRestore();
    });

    it('should not re-trigger search when refocusing without keyword', () => {
      const wrapper = createWrapper();
      wrapper.setData({ keyword: '' });
      const onInputSpy = jest.spyOn(wrapper.vm, 'onInput');

      wrapper.vm.onfocus();

      expect(onInputSpy).not.toHaveBeenCalled();
      onInputSpy.mockRestore();
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

      expect(wrapper.vm.isFocus).toBe(true);

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
      expect(wrapper.vm.list[0].img).toBe('img1.jpg');
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

    it('should set loading to false after completion', async () => {
      GetSpuList.mockResolvedValue({ data: { rows: [] } });
      const wrapper = createWrapper();
      wrapper.setData({ loading: true });

      wrapper.vm.getTeacherList('phone');
      await flushPromises();

      expect(wrapper.vm.loading).toBe(false);
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

    it('should set list from response data.rows with image mapping', async () => {
      const mockStores = [
        { id: 's1', storeName: 'Demo Store', logo: 'logo.png' },
        { id: 's2', storeName: 'Shop Two', img: 'shop.jpg' },
        { id: 's3', storeName: 'Store Three' },
      ];
      GetStorebyName.mockResolvedValue({ data: { rows: mockStores } });
      const wrapper = createWrapper();

      wrapper.vm.getStorebyName('demo');
      await flushPromises();

      expect(wrapper.vm.list).toHaveLength(3);
      expect(wrapper.vm.list[0].img).toBe('logo.png');
      expect(wrapper.vm.list[1].img).toBe('shop.jpg');
      expect(wrapper.vm.list[2].img).toBe('');
    });

    it('should set loading to false after completion', async () => {
      GetStorebyName.mockResolvedValue({ data: { rows: [] } });
      const wrapper = createWrapper();
      wrapper.setData({ loading: true });

      wrapper.vm.getStorebyName('demo');
      await flushPromises();

      expect(wrapper.vm.loading).toBe(false);
    });

    it('should handle API error gracefully and clear list', async () => {
      GetStorebyName.mockRejectedValue(new Error('Network error'));
      const wrapper = createWrapper();
      wrapper.setData({ list: [{ id: 'old' }] });

      wrapper.vm.getStorebyName('demo');
      await flushPromises();
      await flushPromises();

      expect(wrapper.vm.list).toEqual([]);
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

    it('should call getTeacherList when changeValue is "Product" and keyword is set', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Product', keyword: 'phone' });

      const getTeacherListSpy = jest.spyOn(wrapper.vm, 'getTeacherList');

      wrapper.vm.onInput();

      jest.advanceTimersByTime(500);

      expect(getTeacherListSpy).toHaveBeenCalledWith('phone');
      getTeacherListSpy.mockRestore();
    });

    it('should call getStorebyName when changeValue is "Store" and keyword is set', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Store', keyword: 'my-store' });

      const getStorebyNameSpy = jest.spyOn(wrapper.vm, 'getStorebyName');

      wrapper.vm.onInput();

      jest.advanceTimersByTime(500);

      expect(getStorebyNameSpy).toHaveBeenCalledWith('my-store');
      getStorebyNameSpy.mockRestore();
    });

    it('should set loading=true when calling onInput with keyword', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Product', keyword: 'test' });

      wrapper.vm.onInput();
      jest.advanceTimersByTime(500);

      expect(wrapper.vm.loading).toBe(true);
    });

    it('should clear list and return early when keyword is empty', () => {
      const wrapper = createWrapper();
      wrapper.setData({ keyword: '', list: [{ id: 'old' }], loading: true });

      wrapper.vm.onInput();
      jest.advanceTimersByTime(500);

      expect(wrapper.vm.list).toEqual([]);
    });

    it('should debounce rapid inputs to a single call', () => {
      const wrapper = createWrapper();
      wrapper.setData({ changeValue: 'Product' });

      const getTeacherListSpy = jest.spyOn(wrapper.vm, 'getTeacherList');

      wrapper.vm.keyword = 'a';
      wrapper.vm.onInput();
      wrapper.vm.keyword = 'ap';
      wrapper.vm.onInput();
      wrapper.vm.keyword = 'app';
      wrapper.vm.onInput();
      wrapper.vm.keyword = 'appl';
      wrapper.vm.onInput();
      wrapper.vm.keyword = 'apple';
      wrapper.vm.onInput();

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

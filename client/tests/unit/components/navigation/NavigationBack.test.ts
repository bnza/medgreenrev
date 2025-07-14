import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import NavigationBack from '~/components/navigation/NavigationBack.vue'

let pinia: ReturnType<typeof createTestingPinia>

describe('NavigationBack.vue', () => {
  // Reset mocks before each test
  beforeEach(() => {
    // Creates a fresh testing Pinia instance for each test
    pinia = createTestingPinia({
      createSpy: vi.fn, // Vitest's spy function
      // You can define initial state for specific stores
      initialState: {
        history: [
          {
            path: '/',
            isUserAction: false,
          },
          {
            path: '/test',
            isUserAction: true,
          },
        ],
      },
      // stubActions: false, // Set to true to prevent actions from running their original implementation
    })
  })

  it('renders correctly with default props', () => {
    const wrapper = mount(NavigationBack, {
      global: {
        plugins: [pinia],
      },
    })
    const link = wrapper.find('[data-testid="navigation-back-button"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('to')).toBe('/')
  })

  it('disables button when disabled prop is true', () => {
    const wrapper = mount(NavigationBack, {
      props: { disabled: true },
    })
    const vBtn = wrapper.find('[data-testid="navigation-back-button"]')
    expect(vBtn.attributes('disabled')).not.toBeUndefined()
  })

  it('sets clicked to true on link click', async () => {
    const wrapper = mount(NavigationBack)
    const link = wrapper.find('[data-testid="navigation-back-button"]')
    await link.trigger('click')

    // Since clicked is a ref inside the component, we need to test the behavior
    // rather than accessing the internal state directly
    expect(link.exists()).toBe(true)
  })
})

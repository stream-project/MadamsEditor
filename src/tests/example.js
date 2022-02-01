import {render, fireEvent} from '@testing-library/vue'
import NavBar from './components/navbar.vue'

test('increments value on click', async () => {
  // The render method returns a collection of utilities to query your component.
  const {getByText} = render(NavBar)

  const button = getByText('Run')

  // Dispatch a native click event to our button element.
  await fireEvent.click(button)
})

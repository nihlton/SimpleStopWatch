import React from 'react'
import { render } from '@testing-library/react'
import StopWatch from './StopWatch'

test('renders learn react link', () => {
  const { getByText } = render(<StopWatch />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
})

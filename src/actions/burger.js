// Action type
export const TOGGLE_BURGER = 'TOGGLE_BURGER';
export const CLOSE_BURGER = 'CLOSE_BURGER';

// Action creator
export const toggleBurger = () => ({
  type: TOGGLE_BURGER,
});

export const closeBurger = () => ({
  type: CLOSE_BURGER,
});

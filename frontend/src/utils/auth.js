export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("renattire_wishlist");
  localStorage.removeItem("renattire_cart");
  window.location.href = "/login";
};



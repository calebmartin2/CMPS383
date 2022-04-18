import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminManageProducts } from "./pages/Admin/AdminManageProducts";
import { AdminVerifyPublishers } from "./pages/Admin/AdminVerifyPublishers";
import { ManagePublishers } from "./pages/Admin/ManagePublishers";
import { checkForRole } from "./pages/Auth/checkForRole";
import Login from "./pages/Auth/Login";
import PublisherSignUp from "./pages/Auth/PublisherSignUp";
import SignUp from "./pages/Auth/SignUp";
import { Navmenu } from "./components/Navmenu";
import NotFoundPage from "./components/NotFoundPage";
import { PublisherDashboard } from "./pages/Publisher/PublisherDashboard";
import PublisherManageProducts from "./pages/Publisher/PublisherManageProducts";
import Cart from "./pages/Store/Cart";
import { ProductDetail } from "./pages/Store/ProductDetail";
import Receipt from "./pages/Store/Receipt";
import { Search } from "./pages/Store/Search";
import { Home } from "./pages/Store/Store";
import syncCart from "./pages/User/syncCart";
import UserLibrary from "./pages/User/UserLibrary";
import { refreshUserInfo } from "./refreshUserInfo";
import { TermsOfAgreement } from "./pages/Auth/TermsOfAgreement";

function App() {

  const [amountCart, setAmountCart] = useState(0);

  useEffect(() => {
    populateCart()
    refreshUserInfo()
    if (!checkForRole("User")) {
      syncCart(JSON.parse(localStorage.getItem("cart")));
    }
  }, [amountCart]);

  function populateCart() {
    var allCart = JSON.parse(localStorage.getItem("cart"));

    if (allCart == null) {
      return;
    }
    setAmountCart(allCart.length);
  }

  return (
    <div className="App text-white">
      <Navmenu amountCart={amountCart} setAmountCart={setAmountCart} />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/*" element={<Search />} />
          <Route path="/login" element={<Login setAmountCart={setAmountCart} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/publisher" element={<PublisherDashboard />} />
          <Route path="/publisher/signup" element={<PublisherSignUp />} />
          <Route path="/publisher/manage-products" element={<PublisherManageProducts />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route exact path="/admin/verify-publishers" element={<AdminVerifyPublishers />} />
          <Route path="/admin/manage-publishers" element={<ManagePublishers />} />
          <Route path="/admin/manage-products" element={<AdminManageProducts />} />
          <Route path="/terms" element={<TermsOfAgreement />} />
          <Route path="/product/:productId/*" element={<ProductDetail setAmountCart={setAmountCart} />} />
          <Route path="/cart" element={<Cart setAmountCart={setAmountCart} />} />
          <Route path="/library" element={<UserLibrary />} />
          <Route path='/receipt' element={<Receipt />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { AdminManageProducts } from "./components/Admin/AdminManageProducts";
import { AdminManageTags } from "./components/Admin/AdminManageTags";
import { AdminVerifyPublishers } from "./components/Admin/AdminVerifyPublishers";
import { ManagePublishers } from "./components/Admin/ManagePublishers";
import Cart from "./components/Store/Cart";
import { Home } from "./components/Store/Store";
import Login from "./components/Auth/Login";
import { Navmenu } from "./components/Navmenu";
import NotFoundPage from "./components/NotFoundPage";
import { ProductDetail } from "./components/Store/ProductDetail";
import { PublisherDashboard } from "./components/Publisher/PublisherDashboard";
import PublisherManageProducts from "./components/Publisher/PublisherManageProducts";
import PublisherSignUp from "./components/Auth/PublisherSignUp";
import SignUp from "./components/Auth/SignUp";
import { TermsOfAgreement } from "./TermsOfAgreement";
import { useEffect, useState } from "react";
import UserLibrary from "./components/User/UserLibrary";
import { refreshUserInfo } from "./refreshUserInfo";
import Receipt from "./components/Store/Receipt";
import syncCart from "./components/User/syncCart";

function App() {

  const [amountCart, setAmountCart] = useState(0);

  useEffect(() => {
    populateCart()
    refreshUserInfo()
    syncCart(JSON.parse(localStorage.getItem("cart")));
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
          <Route path="/login" element={<Login setAmountCart={setAmountCart} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/publisher" element={<PublisherDashboard />} />
          <Route path="/publisher/signup" element={<PublisherSignUp />} />
          <Route path="/publisher/manage-products" element={<PublisherManageProducts />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route exact path="/admin/manage-tags" element={<AdminManageTags />} />
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

import axios from "axios";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { AdminManageProducts } from "./components/Admin/AdminManageProducts";
import { AdminManageTags } from "./components/Admin/AdminManageTags";
import { AdminVerifyPublishers } from "./components/Admin/AdminVerifyPublishers";
import { ManagePublishers } from "./components/Admin/ManagePublishers";
import Cart from "./components/Cart";
import { Home } from "./components/Home";
import Login from "./components/Login";
import { Navmenu } from "./components/Navmenu";
import NotFoundPage from "./components/NotFoundPage";
import { ProductDetail } from "./components/ProductDetail";
import { PublisherDashboard } from "./components/Publisher/PublisherDashboard";
import PublisherManageProducts from "./components/Publisher/PublisherManageProducts";
import PublisherSignUp from "./components/Publisher/PublisherSignUp";
import SignUp from "./components/SignUp";
import { TermsOfAgreement } from "./TermsOfAgreement";

function App() {
  var _ = require('lodash');

 // this is nonsense, but we're stuck with it
  function refreshUserInfo() {
    axios.get('/api/authentication/me', {
    })
      .then(function (response) {
        if (!_.isEqual(JSON.parse(localStorage.getItem('user')), response.data)) {
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(response.data))
          console.error("User data different, refreshing.")
          window.location.reload(false);
        }
      })
      .catch(function (error) {
        if (localStorage.getItem('user')) {
          window.location.reload(false);
        }
        localStorage.removeItem('user');
        console.log(error);
      });
  }


  return (
    <div className="App text-white">
      {refreshUserInfo()}
      <Navmenu />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
          <Route path="/terms" element={<TermsOfAgreement/>} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

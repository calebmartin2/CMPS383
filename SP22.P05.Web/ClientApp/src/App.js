import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Navmenu } from "./components/Navmenu";
import NotFoundPage from "./components/NotFoundPage";
import Login from "./components/Login";
import { PublisherDashboard } from "./components/Publisher/PublisherDashboard";
import "./App.css"
import SignUp from "./components/SignUp";
import { Container } from "react-bootstrap";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { AdminManageTags } from "./components/Admin/AdminManageTags";
import PublisherSignUp from "./components/Publisher/PublisherSignUp";
import axios from "axios";
import { AdminVerifyPublishers } from "./components/Admin/AdminVerifyPublishers";
import { ManagePublishers } from "./components/Admin/ManagePublishers";
import { TermsOfAgreement } from "./TermsOfAgreement";
import PublisherManageProducts from "./components/Publisher/PublisherManageProducts"

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
          <Route path="/terms" element={<TermsOfAgreement/>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

import axios from "axios";
import React, { useState, useEffect } from 'react';

export function Home() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    async function fetchProducts() {
      axios.get('https://localhost:5001/api/products')
        .then(function (response) {
          console.log(response.data);
          const data = response.data;
          setProducts(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    fetchProducts();
  }, [])

  return (
    <>
      <h1> test</h1>
    </>
  );
}


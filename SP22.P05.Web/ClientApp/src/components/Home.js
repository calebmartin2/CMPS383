import axios from "axios";
import React, { useState, useEffect } from 'react';

export function Home() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    async function fetchProducts() {
      axios.get('/api/products')
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
      {products.map((product) => (
        <li key={product.id}>
          {product.name}
        </li>
      ))
      }
    </>
  );
}


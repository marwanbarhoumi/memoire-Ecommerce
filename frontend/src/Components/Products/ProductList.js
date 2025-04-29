import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { getallproducts } from "../../JS/action/prodAction";
import "../Style/prodList.css"

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.prod?.products); // Default to empty array if undefined

  useEffect(() => {
    dispatch(getallproducts());
  }, [dispatch]);

  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <>
      {currentUser?.role === "admin" && (
        <Link to="/add" className="add-product-link">
          <Typography sx={{ textAlign: "center" }}>Add Product</Typography>
        </Link>
      )}

      <div
        className="product-list"
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {products.map((el) => (
          <ProductCard key={el._id} prd={el} />
        ))}
      </div>
    </>
  );
};

export default ProductList;
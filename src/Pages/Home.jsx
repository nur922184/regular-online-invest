import React, { useEffect, useState } from "react";
import HeroSection from "../Component/HeroSection";
import ProductList from "../Component/ProductList";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Product List Component */}
      <ProductList user={user} />

    </div>
  );
};

export default Home;
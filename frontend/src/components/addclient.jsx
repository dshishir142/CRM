import React, { useState, useEffect } from "react";
import styles from "../style/addClient.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddClientForm() {
  const navigate = useNavigate();
  const localData = JSON.parse(localStorage.getItem('user'));

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    interest_score: "",
    product_id: "",
    agent: localData.user_id,
  });

  const requiredFields = ["name", "email", "phone", "address", "product_id"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/product");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === "interest_score" ? parseInt(value) || "" : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/client', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        alert("Client created successfully");
        navigate('/clients');
      }
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };

  return (
    <div className={styles.addClientContainer}>
      <h2 className={styles.addClientTitle}>Add Client</h2>
      <form className={styles.addClientForm} onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          key !== "agent" && key !== "product_id" && (
            <div key={key} className={styles.addClientFormGroup}>
              <label className={styles.addClientLabel} htmlFor={key}>
                {key.replace("_", " ").toUpperCase()}
              </label>
              <input
                className={styles.addClientInput}
                type={key === "interest_score" ? "number" : "text"}
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                required={requiredFields.includes(key)}
              />
            </div>
          )
        ))}

        <div className={styles.addClientFormGroup}>
          <label className={styles.addClientLabel} htmlFor="product_id">Attach Product</label>
          <select
            name="product_id"
            id="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className={styles.addClientInput}
            required
          >
            <option value="">-- Select a Product --</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <input type="hidden" name="agent" value={formData.agent} />

        <button className={styles.addClientSubmitButton} type="submit">
          Add Client
        </button>
      </form>
    </div>
  );
}

export default AddClientForm;

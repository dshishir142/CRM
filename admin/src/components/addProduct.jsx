import { useState } from "react";
import axios from "axios";
import styles from "../style/addProduct.module.css";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("available");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const localdata = JSON.parse(localStorage.getItem("admin"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const productData = {
        name,
        description,
        price: parseFloat(price),
        status,
        user_id: localdata.user_id,
      };

      const response = await axios.post("http://localhost:8000/product", productData);
      if (response.status === 201) {
        alert(response.data.message || "Product added successfully!");
        navigate("/product");
      }
    } catch (err) {
      setError("Error adding product. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Product</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="available">Available</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Add Product
        </button>
      </form>
    </div>
  );
}

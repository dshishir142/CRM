import { useEffect, useState } from "react";
import styles from "../style/product.module.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/product");
      setProducts(res.data.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Product List</h2>
        <Link to="/addproduct">
          <button className={styles.addBtn}>+ Add Product</button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        className={styles.searchBar}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className={styles.table}>
        <div className={`${styles.tableRow} ${styles.tableHeader}`}>
          <div>Name</div>
          <div>Price</div>
          <div>Status</div>
          <div>Created</div>
        </div>
        {filteredProducts.map((product) => (
          <div
            className={styles.tableRow}
            key={product.product_id}
            onClick={() => setSelectedProduct(product)}
          >
            <div>{product.name}</div>
            <div>₹{parseFloat(product.price).toFixed(2)}</div>
            <div>{product.status}</div>
            <div>{new Date(product.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className={`${styles.modalOverlay} ${styles.active}`}>
          <div className={styles.modal}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
            <h3>{selectedProduct.name}</h3>
            <p><strong>Price:</strong> ₹{parseFloat(selectedProduct.price).toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedProduct.status}</p>
            <p><strong>Description:</strong></p>
            <div className={styles.descriptionBox}>
              {selectedProduct.description}
            </div>

            <h4 style={{ marginTop: "20px" }}>Clients using this product:</h4>
            {selectedProduct.clients?.length > 0 ? (
              <ul className={styles.clientList}>
                {selectedProduct.clients.map((cp) => (
                  <li key={cp.client_id}>
                    {cp.client.name} ({cp.client.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No clients linked.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import styles from "../style/product.module.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductClients, setSelectedProductClients] = useState([]);
  const [isFetchingClients, setIsFetchingClients] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);

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

  const openProductModal = async (product) => {
    setSelectedProduct(product);
    setIsFetchingClients(true);
    try {
      const res = await axios.get(`http://localhost:8000/product/getclients`, {
        params: { product_id: product.product_id },
      });
      setSelectedProductClients(res.data.data);
    } catch (error) {
      console.error("Error fetching clients for product:", error);
      setSelectedProductClients([]);
    }
    setIsFetchingClients(false);
  };

  const openEditModal = (product) => {
    setEditProduct({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:8000/product/${editProduct.product_id}`, {
        name: editProduct.name,
        price: parseFloat(editProduct.price),
        description: editProduct.description,
        status: editProduct.status,
      });
      fetchProducts();
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (product_id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:8000/product/${product_id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
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
          <div>Actions</div>
        </div>
        {filteredProducts.map((product) => (
          <div className={styles.tableRow} key={product.product_id}>
            <div onClick={() => openProductModal(product)}>{product.name}</div>
            <div onClick={() => openProductModal(product)}>
              ₹{parseFloat(product.price).toFixed(2)}
            </div>
            <div onClick={() => openProductModal(product)}>{product.status}</div>
            <div onClick={() => openProductModal(product)}>
              {new Date(product.created_at).toLocaleDateString()}
            </div>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => openEditModal(product)}>
                Edit
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(product.product_id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product View Modal */}
      {selectedProduct && (
        <div className={`${styles.modalOverlay} ${styles.active}`}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setSelectedProduct(null)}>
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
            {isFetchingClients ? (
              <p>Loading clients...</p>
            ) : selectedProductClients.length > 0 ? (
              <ul className={styles.clientList}>
                {selectedProductClients.map((cp) => (
                  <li key={cp.client_id}>
                    {cp.client?.name} ({cp.client?.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No clients linked.</p>
            )}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className={`${styles.modalOverlay} ${styles.active}`}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setEditProduct(null)}>
              Close
            </button>
            <h3>Edit Product</h3>
            <input
              className={styles.inputField}
              type="text"
              name="name"
              placeholder="Product Name"
              value={editProduct.name}
              onChange={handleEditChange}
            />
            <input
              className={styles.inputField}
              type="number"
              name="price"
              placeholder="Price"
              value={editProduct.price}
              onChange={handleEditChange}
            />
            <select
              className={styles.inputField}
              name="status"
              value={editProduct.status}
              onChange={handleEditChange}
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <textarea
              className={styles.inputField}
              name="description"
              placeholder="Description"
              value={editProduct.description}
              onChange={handleEditChange}
              rows="4"
            />
            <button className={styles.saveBtn} onClick={handleUpdateProduct}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import styles from "../style/clients.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Clients = () => {
    const localData = JSON.parse(localStorage.getItem("user"));
    const [searchTerm, setSearchTerm] = useState("");
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showClientDetailsModal, setShowClientDetailsModal] = useState(false);
    const [showInterestScoreModal, setShowInterestScoreModal] = useState(false);
    const [showAssignProductModal, setShowAssignProductModal] = useState(false);
    const [newInterestScore, setNewInterestScore] = useState(0);
    const [assignInterestScore, setAssignInterestScore] = useState(5);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getUserData();
        fetchProducts();
    }, []);

    const getUserData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/client/client-product/${localData.user_id}`,
                { headers: { "Content-Type": "application/json" } }
            );
            setClients(response.data.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/product", {
                headers: { "Content-Type": "application/json" },
            });
            setProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleRowClick = (clientProduct) => {
        setSelectedClient(clientProduct);
        setShowClientDetailsModal(true);
    };

    const handleInterestClick = (clientProduct) => {
        setNewInterestScore(clientProduct.interest);
        setSelectedClient(clientProduct);
        setShowInterestScoreModal(true);
    };

    const handleSave = async () => {
        if (!reason.trim()) {
            setError("Reason is required.");
            return;
        }
        setError("");

        if (!selectedClient) return;

        const updatedClients = clients.map((clientProduct) =>
            clientProduct.client_product_id === selectedClient.client_product_id
                ? { ...clientProduct, interest: newInterestScore }
                : clientProduct
        );
        setClients(updatedClients);
        setShowInterestScoreModal(false);

        try {
            await axios.put(
                `http://localhost:8000/client/interestscore/${selectedClient.client_id}`,
                { interest_score: newInterestScore, reason, product_id: selectedClient.product.product_id, client_product_id: selectedClient.client_product_id },
                { headers: { "Content-Type": "application/json" } }
            );
        } catch (error) {
            console.error("Error updating interest score:", error);
        }
    };

    const handleAssignProduct = async () => {
        if (!selectedClient || !selectedProductId) return;

        try {
            await axios.post(
                `http://localhost:8000/client/assign-product`,
                {
                    client_id: selectedClient.client.client_id,
                    product_id: selectedProductId,
                    interest_score: assignInterestScore,
                },
                { headers: { "Content-Type": "application/json" } }
            );
            setShowAssignProductModal(false);
            setSelectedProductId("");
            setAssignInterestScore(5);
            setError(""); // Clear any previous error
            getUserData();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.message); // Show server error
            } else {
                console.error("Error assigning product:", error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2>Clients</h2>
            <input
                type="text"
                placeholder="Search clients..."
                className={styles.searchBar}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link to="/addclient">
                <button className={styles.addClientButton}>+ Add Client</button>
            </Link>

            <div className={styles.clientList}>
                {clients.length > 0 ? (
                    clients
                        .filter((clientProduct) =>
                            clientProduct.client.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((clientProduct) => (
                            <div
                                key={clientProduct.client_product_id}
                                className={styles.clientCard}
                                onClick={() => handleRowClick(clientProduct)}
                            >
                                <div className={styles.clientInfo}>
                                    <h3>{clientProduct.client.name}</h3>
                                    <span>{clientProduct.product.name}</span>
                                </div>
                                <div
                                    className={styles.interestScore}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInterestClick(clientProduct);
                                    }}
                                >
                                    Interest: {clientProduct.interest}
                                </div>
                            </div>
                        ))
                ) : (
                    <p>No clients found.</p>
                )}
            </div>

            {/* --- Client Details Modal --- */}
            {showClientDetailsModal && selectedClient && (
                <div className={styles.popupOverlay} onClick={() => setShowClientDetailsModal(false)}>
                    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                        <h3>Client Details</h3>
                        <div className={styles.popupContent}>
                            <div className={styles.detailRow}><span>Client Name:</span> {selectedClient.client.name}</div>
                            <div className={styles.detailRow}><span>Email:</span> {selectedClient.client.email}</div>
                            <div className={styles.detailRow}><span>Phone:</span> {selectedClient.client.phone}</div>
                            <div className={styles.detailRow}><span>Address:</span> {selectedClient.client.address}</div>
                            <div className={styles.detailRow}><span>Product:</span> {selectedClient.product.name}</div>
                            <div className={styles.detailRow}><span>Description:</span> {selectedClient.product.description}</div>
                            <div className={styles.detailRow}><span>Price:</span> ₹{selectedClient.product.price}</div>
                        </div>
                        <div className={styles.popupButtons}>
                            <button
                                onClick={() => {
                                    setError(""); // clear previous error if any
                                    setShowAssignProductModal(true);
                                    setShowClientDetailsModal(false);
                                }}
                            >
                                Assign to Another Product
                            </button>
                            <button
                                onClick={() => setShowClientDetailsModal(false)}
                                className={styles.cancelButton}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Interest Score Modal --- */}
            {showInterestScoreModal && selectedClient && (
                <div className={styles.popupOverlay} onClick={() => setShowInterestScoreModal(false)}>
                    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                        <h3>Change Interest Score</h3>
                        <div>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                value={newInterestScore}
                                onChange={(e) => setNewInterestScore(parseInt(e.target.value))}
                            />
                            <label>Reason (Required):</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason for update..."
                            ></textarea>
                            {error && <p className={styles.errorMessage}>{error}</p>}

                            <div className={styles.popupButtons}>
                                <button onClick={handleSave} disabled={!reason.trim()}>
                                    Save
                                </button>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowInterestScoreModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Assign Product Modal --- */}
            {showAssignProductModal && selectedClient && (
                <div className={styles.popupOverlay} onClick={() => setShowAssignProductModal(false)}>
                    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                        <h3>Assign Product</h3>
                        <div>
                            <label>Select Product:</label>
                            <select
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                            >
                                <option value="">-- Select Product --</option>
                                {products.map((product) => (
                                    <option key={product.product_id} value={product.product_id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>

                            <label>Interest Score:</label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                value={assignInterestScore}
                                onChange={(e) => setAssignInterestScore(parseInt(e.target.value))}
                            />

                            {/* --- Error Message for Assign Product Modal --- */}
                            {error && <p className={styles.errorMessage}>{error}</p>}

                            <div className={styles.popupButtons}>
                                <button onClick={handleAssignProduct} disabled={!selectedProductId}>
                                    Assign
                                </button>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowAssignProductModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Clients;

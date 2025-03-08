import NavBar from "./dashboardComponents/navBar";
import styles from "../style/addInteraction.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
export default function AddInteraction(){

    const navigate = useNavigate();

    const localData = JSON.parse(localStorage.getItem("user"));
    const [ formData, setFormData] = useState({
        type: "",
        date: "",
        summary: "",
        followUpDate: "",
        notes: "",
        client_id: "",
        agent_id: localData.user_id
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        const searchClients = async () => {
            if (searchTerm.length > 0) {
                try {
                    const response = await axios.get(`http://localhost:8000/client/${localData.user_id}`);
                    const filteredClients = response.data.data.filter(client => 
                        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        client.email.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setSearchResults(filteredClients);
                } catch (error) {
                    console.log(error);
                }
            } else {
                setSearchResults([]);
            }
        };
        searchClients();
    }, [searchTerm]);

    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setFormData({...formData, client_id: client.client_id});
        setSearchTerm("");
        setSearchResults([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name] : value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{

            const response = await axios.post('http://localhost:8000/interaction', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(response.status === 201){
                alert("Interaction created successfully");
                navigate('/interactions');
            }
        }catch(error){
            console.log(error);
        }
    }

    return(
        <div>
            <NavBar />
            <div className={styles.container}>
                <h2>Add New Interaction</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Client *</label>
                        <input
                            type="text"
                            placeholder="Search for client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={selectedClient}
                        />
                        {searchResults.length > 0 && !selectedClient && (
                            <div className={styles.searchResults}>
                                {searchResults.map(client => (
                                    <div 
                                        key={client.client_id}
                                        className={styles.searchResult}
                                        onClick={() => handleClientSelect(client)}
                                    >
                                        {client.name} - {client.email}
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedClient && (
                            <div className={styles.selectedClient}>
                                Selected: {selectedClient.name}
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setSelectedClient(null);
                                        setFormData({...formData, client_id: ""});
                                    }}
                                >
                                    Change
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Type *</label>
                        <select 
                            required
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="">Select type</option>
                            <option value="EMAIL">Email</option>
                            <option value="CALL">Call</option>
                            <option value="MEETING">Meeting</option>
                            <option value="CHAT">Chat</option>
                            <option value="OTHER">other</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Date *</label>
                        <input 
                            name="date"
                            type="datetime-local"
                            required
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Summary *</label>
                        <textarea
                            name="summary"
                            required
                            value={formData.summary}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Follow Up Date</label>
                        <input 
                            name= "followUpDate"
                            type="datetime-local"
                            value={formData.followUpDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Follow Up Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={!selectedClient}
                    >
                        Add Interaction
                    </button>
                </form>
            </div>
        </div>
    )
}
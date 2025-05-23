exports.setUserInLocalStorage = async (userEmail) => {
    try{
        const response = await fetch(`http://localhost:8000/user/${userEmail}`);
        if(!response){
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        const { user_id, name, email, image, role_id } = data.data;

        localStorage.setItem("user", JSON.stringify({ user_id, name, email, image, role_id}));
    }catch(error){
        console.log("Error in setting up localstorage: ", error);
    }
}


exports.getUserInLocalStorage = async (userEmail) => {
    try{
        const response = await fetch(`http://localhost:8000/user/${userEmail}`);
        if(!response){
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data.data;

    }catch(error){
        console.log("Error in fetching data: ", error);
    }
}




exports.saveEmailConfig = async (userEmail) => {
    const { email, password, appPassword } = userEmail;
    
    localStorage.setItem('emailConfig', JSON.stringify({ email, password, appPassword }));
}
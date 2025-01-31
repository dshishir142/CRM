exports.setUserInLocalStorage = async (userEmail) => {
    try{
        const response = await fetch(`http://localhost:8000/user/${userEmail}`);
        if(!response){
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        const { user_id, name, email, image } = data.data;

        localStorage.setItem("user", JSON.stringify({ user_id, name, email, image}));
    }catch(error){
        console.log("Error in setting up localstorage: ", error);
    }
}

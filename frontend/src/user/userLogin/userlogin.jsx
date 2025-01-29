import style from './userLogin.module.css'
export default function userLogin() {
    return (

        <div class="container">
            <h2>Sign In</h2>
            <form action="/signin" method="POST">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required></input>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required></input>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required></input>
                </div>
                <div class="form-group">
                    <label for="role_id">Role ID</label>
                    <input type="number" id="role_id" name="role_id" required></input>
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>

    )
}
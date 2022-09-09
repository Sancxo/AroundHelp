import axios from "axios";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Forms.css';

interface User {
    first_name: string,
    last_name: string,
    password: string,
    password_confirmation: string,
    birthdate?: Date,
    about?: string,
    address_id?: number,
    id_card?: string,
    avatar?: string
}

export default function SignIn(): ReactElement {
    const [user, setUser] = useState<User>({
        first_name: "",
        last_name: "",
        password: "",
        password_confirmation: ""
    });
    const navigate = useNavigate();

    function handleInputs(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const name = e.target.name;
        const value = e.target.value;

        setUser(values => ({ ...values, [name]: value }));
    }

    function handleSubmit() {
        axios
            .post<User>(`${process.env.REACT_APP_BACKEND_URL}/users`, { user })
            .then(resp => {
                if (resp.status === 200) {
                    console.info("Success!");
                    navigate("/");
                }
            })
            .catch(err => console.error(err));
    }

    return (
        <div>
            <form name="user" id="user-infos" method="POST" action={`${process.env.REACT_APP_BACKEND_URL}/users`} encType='multipart/form-data'>
                <fieldset>
                    <legend>About you: </legend>

                    <label htmlFor="first-name-input">First name:</label>
                    <input type="text" name="first_name" id="first-name-input" onChange={handleInputs} />

                    <label htmlFor="last-name-input">Last name:</label>
                    <input type="text" name="last_name" id="last-name-input" onChange={handleInputs} />

                    <label htmlFor="password-input">Password:</label>
                    <input type="password" name="password" id="password-input" onChange={handleInputs} />

                    <label htmlFor="password-confirmation-input">Confirm password:</label>
                    <input type="password" name="password_confirmation" id="password-confirmation-input" onChange={handleInputs} />

                    <label htmlFor="birthdate-input">Birthdate:</label>
                    <input type="date" name="birthdate" id="birthdate-input" onChange={handleInputs} />

                    <label htmlFor="about-input">About:</label>
                    <textarea name="about" id="about" cols={30} rows={10} onChange={handleInputs} ></textarea>

                    <label htmlFor="email-input" > Email:</label>
                    <input type="email" name="email" id="email-input" onChange={handleInputs} />

                    <label htmlFor="id-card-input">Id card:</label>
                    <input type="file" name="id_card" id="id-card-input" onChange={handleInputs} />

                    <input type="button" value="Submit" onClick={handleSubmit} />
                </fieldset>
            </form>
        </div >
    )
}
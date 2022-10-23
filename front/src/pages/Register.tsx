import React, { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

import User, { RegistrationValues } from "../shared/interfaces/user.interface";
import { register } from "../shared/helpers/user.helper";


export default function Register({ setUser, setToken }: { setUser: React.Dispatch<React.SetStateAction<User>>, setToken: React.Dispatch<React.SetStateAction<string>> }): ReactElement {
    const [registrationValues, setRegistrationValues] = useState<RegistrationValues>({
        first_name: "",
        last_name: "",
        password: "",
        password_confirmation: "",
        email: ""
    });
    const navigate = useNavigate();

    function handleInputs(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const name = e.target.name;
        const value = e.target.value;

        setRegistrationValues(registrationValues => ({ ...registrationValues, [name]: value }));
    }

    function handleSubmit() {
        register(registrationValues, setUser, setToken, navigate);
    }

    return (
        <form name="user" id="user-infos" encType='multipart/form-data' className="container">
            <h3>Register: </h3>
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

                <label htmlFor="email-input">Email:</label>
                <input type="email" name="email" id="email-input" onChange={handleInputs} />

                <label htmlFor="id-card-input">Id card:</label>
                <input type="file" name="id_card" id="id-card-input" onChange={handleInputs} />

                <input type="button" className="btn-prim" value="Submit" onClick={handleSubmit} />
            </fieldset>
        </form>
    )
}
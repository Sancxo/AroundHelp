import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfos, update } from "../shared/helpers/user.helper";

import User, { RegistrationValues } from "../shared/interfaces/user.interface";

export default function EditProfile({ token, user, setUser, setToken }: {
  token: string,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setToken: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const [registrationValues, setRegistrationValues] = useState<RegistrationValues>({
    first_name: "",
    last_name: "",
    password: "",
    password_confirmation: "",
    email: "",
    avatar: undefined,
    id_card: undefined
  });
  const [userProfile, setUserProfile] = useState<User>(user)
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);


  const navigate = useNavigate();

  // useEffect(() => {
  //   if (token) {
  //     getUserInfos(`${user.id!}`, token, setUserProfile, setIsLoaded, setError);
  //   }
  // }, [token, user.id])

  function handleInputs(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setRegistrationValues(registrationValues => ({ ...registrationValues, [name]: value }));
  }
  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    (e.target.id === "avatar-input") && setRegistrationValues(registrationValues => ({ ...registrationValues, 'avatar': e.target.files![0] }));
    e.target.id === "id-card-input" && setRegistrationValues(registrationValues => ({ ...registrationValues, 'id_card': e.target.files![0] }));
  }

  function handleSubmit() {
    update(registrationValues, setUser, setToken, navigate);
  }

  return (
    <form name="user" id="user-infos" encType='multipart/form-data' className="container">
      <h3>Register: </h3>
      <fieldset>
        <legend>About you: </legend>

        <label htmlFor="first-name-input">First name:</label>
        <input type="text" name="first_name" id="first-name-input" value={userProfile.first_name as string} onChange={handleInputs} />

        <label htmlFor="last-name-input">Last name:</label>
        <input type="text" name="last_name" id="last-name-input" value={userProfile.last_name as string} onChange={handleInputs} />

        <label htmlFor="avatar-input">Profile picture:</label>
        <input type="file" name="avatar" id="avatar-input" accept="image/png, image/jpeg, image/gif, image/webp, image/avif" onChange={handleImages} />

        {/* <label htmlFor="birthdate-input">Birthdate:</label>
        <input type="date" name="birthdate" id="birthdate-input" value={userProfile.birthdate } onChange={handleInputs} /> */}

        <label htmlFor="about-input">About:</label>
        <textarea name="about" id="about" cols={30} rows={10} onChange={handleInputs} value={userProfile.about as string} ></textarea>

        <label htmlFor="email-input">Email:</label>
        <input type="email" name="email" id="email-input" value={userProfile.email as string} onChange={handleInputs} />

        <label htmlFor="id-card-input">Id card:</label>
        <input type="file" name="id_card" id="id-card-input" accept="application/pdf, image/png, image/jpeg, image/gif, image/webp, image/avif" onChange={handleImages} />

        <input type="button" className="btn-prim" value="Submit" onClick={handleSubmit} />
      </fieldset>
    </form>
  )
}
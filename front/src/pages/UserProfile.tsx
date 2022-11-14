import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getUserInfos } from "../shared/helpers/user.helper";

import defaultUserAvatar from "../shared/imgs/default-user.png";

import User from "../shared/interfaces/user.interfaces";

export default function UserProfile({ defaultUser, user, token }: {
    defaultUser: User,
    user: User,
    token: string
}): ReactElement {
    const urlParams = useParams();

    const [userProfile, setUserProfile] = useState<User>(defaultUser)
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            getUserInfos(urlParams.id!, token, setUserProfile, setIsLoaded, setError);
        }
    }, [urlParams.id, token])

    if (!isLoaded) return <div><p>Please, wait ...</p></div>

    if (error || !userProfile) {
        return (
            <div>
                <p>Oops ... This user doesn't seem to exists !</p>
            </div>
        )
    }

    return (
        <div>
            {/* Public infos */}
            {/* Avatar */}
            <img src={`${process.env.REACT_APP_BACKEND_URL}${userProfile.avatar ? userProfile.avatar : defaultUserAvatar}`} alt="avatar" width={200} height={200} />
            {/* <img src="" alt="" /> */}
            <p>Hello {userProfile.first_name} {userProfile.last_name}!</p>
            <p>Born: <>{userProfile.birthdate}</></p>
            {userProfile.about &&
                <div>
                    <p>About me: </p>
                    <p>{userProfile.about}</p>
                </div>
            }
            {/* => calculer l'âge */}
            {/* <p>Member since: <>{userProfile.created_at}</></p> */}

            {/* Private infos (if urlParams.id === user.id) */}
            <p>{userProfile.email}</p>
            <p>{`${userProfile.address_id}`}</p>

            {userProfile.id === user.id && <Link to="/profile-edit" title="Edit your informations">Edit profile</Link>}
        </div >
    )
}   
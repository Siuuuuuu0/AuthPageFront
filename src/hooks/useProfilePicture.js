import { useState, useEffect } from "react"

const useProfilePicture = () => {
    
    const [profilePictureLS, setProfilePictureLS] = useState(JSON.parse(localStorage.getItem("profilePicture")) || false);
    useEffect(() => {
        localStorage.setItem("profilePicture", JSON.stringify(profilePictureLS))
    }, [profilePictureLS])
    console.log(profilePictureLS)

    return [profilePictureLS, setProfilePictureLS]
}

// const [profilePictureLS, setProfilePictureLS] = useState(JSON.parse(localStorage.getItem("profilePicture")) || false);
// useEffect(() => {
//     localStorage.setItem("profilePicture", JSON.stringify(profilePictureLS))
// }, [profilePictureLS])

export default useProfilePicture
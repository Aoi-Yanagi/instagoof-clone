import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useUserProfileStore from "../store/userProfileStore";

const useEditProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const authuser = useAuthStore((state) => state.user);
  const setauthuser = useAuthStore((state) => state.setUser);
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

  const showToast = useShowToast();

  const editProfile = async (inputs, selectedFile) => {
    if (isUpdating || !authuser) return;
    setIsUpdating(true);

    const storageRef = ref(storage, `profilePics/${authuser.uid}`);
    const userDocRef = doc(firestore, "users", authuser.uid);

    let URL = "";
    try {
      if (selectedFile) {
        await uploadString(storageRef, selectedFile, "data_url");
        URL = await getDownloadURL(ref(storage, `profilePics/${authuser.uid}`));
      }

      const updatedUser = {
        ...authuser,
        fullName: inputs.fullName || authuser.fullName,
        username: inputs.username || authuser.username,
        bio: inputs.bio || authuser.bio,
        profilePicURL: URL || authuser.profilePicURL,
      };

      await updateDoc(userDocRef, updatedUser);
      localStorage.setItem("user-info", JSON.stringify(updatedUser));
      setauthuser(updatedUser);
      setUserProfile(updatedUser);
      showToast("Success", "Profile updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return { editProfile, isUpdating };
};

export default useEditProfile;

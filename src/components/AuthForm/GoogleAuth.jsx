import { Flex, Image, Text } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import { doc, getDoc, setDoc } from "firebase/firestore";

const GoogleAuth = ({ prefix }) => {
  const [signInWithGoogle, error] = useSignInWithGoogle(auth);
  const showToast = useShowToast();
  const loginUser = useAuthStore((state) => state.login);
  const handleGoogleAuth = async () => {
    try {
      const newUser = await signInWithGoogle();
      if (!newUser && error) {
        showToast("Error", error.message, "error");
        return;
      }
      const userRef = doc(firestore, "users", newUser.user.uid);
      const userSnap = await getDoc(userRef);

      //johndoe@gmail.com
      if (userSnap.exists()) {
        userSnap.data();
        localStorage.setItem("user-info", JSON.stringify(userSnap.data()));
        loginUser(userSnap.data());
      } else {
        //sign up
        const userDoc = {
          uid: newUser.user.uid,
          email: newUser.user.email,
          username: newUser.user.email.split("@")[0], //johndoe
          fullName: newUser.user.displayName,
          bio: "",
          profilePicURL: newUser.user.photoURL,
          followers: [],
          following: [],
          posts: [],
          createdAt: Date.now(),
        };
        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
        localStorage.setItem("user-info", JSON.stringify(userDoc));
        showToast("Success", "New account is created.", "success");
        loginUser(userDoc);
      }
    } catch (err) {
      showToast("Error", error.message, "error");
    }
  };
  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        cursor={"pointer"}
        onClick={handleGoogleAuth}
      >
        <Image src="/google.png" w={5} alt="Google Logo" />
        <Text mx="2" color="blue.500">
          {prefix} with Google
        </Text>
      </Flex>
    </>
  );
};

export default GoogleAuth;

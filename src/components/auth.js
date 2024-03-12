import { useState } from "react";
import { auth } from "../functions/dbConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const signIn = async () => {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((e) => {
                console.log("success: " + JSON.stringify(e));
            })
            .catch((e) => {
            console.log("error: " + e);
        });
    };
    return (
        <div>
            <input
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                placeholder="Password..."
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={signIn}> Sign In</button>
        </div>
    );
}
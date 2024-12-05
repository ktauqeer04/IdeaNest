import { ChangeEvent } from "react";
import { Link } from "react-router-dom"
import { SignupInputs } from "tauqeer_zod_validation";
import { useState } from "react";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {

    const [postInputs, setPostInputs] = useState<SignupInputs>({
        name: "",
        email: "",
        password:""
    })

    


    return <div className="h-screen flex justify-center flex-col">
        {/* {JSON.stringify(postInputs)} */}
        <div className="flex justify-center">
            <div>

                <div className="px-10">
                    <div className="text-3xl font-bold">
                        Create An Account
                    </div>

                    <div className=" flex justify-center text-slate-400">
                        { type === "signin" ? "Don't have an Account?" : "Already have an Account?" }  
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                
                
                <div className="pt-4">
                    <div>
                        <LabelledInput label="Name" placeholder="John Marston" type="text" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                name: e.target.value
                            })
                        }}/>
                    </div>
                    <div className="pt-2">
                        <LabelledInput label="Email" placeholder="anything@example.com" type="text" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                email: e.target.value
                            })
                        }}/>
                    </div>
                    <div className="pt-2">
                        <LabelledInput label="Password" placeholder="***********" type="password" onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value
                            })
                        }}/>
                    </div>
                    <div className="pt-4">
                        <button type="button" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            {type === "signup" ? "Sign Up" : "Sign In"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
}

interface LabelledInputType{
    label: string;
    placeholder: string;
    onChange: (e : ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function LabelledInput({ label, placeholder, onChange, type}: LabelledInputType){
    return <div>
        <label className="block mb-2 font-semibold text-black">{label}</label>
        <input onChange={onChange}type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}
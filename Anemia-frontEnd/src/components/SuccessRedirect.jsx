



import React, { useState, useEffect } from "react";
import axios from "axios";

function SuccessReset() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://a7db4c829af3f4f7985d8f62705bf031-1032979001.ap-south-1.elb.amazonaws.com:3006/auth/activate/${token}", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "http://a9b1f116386444cbabbd084800b9a8ba-1625930597.ap-south-1.elb.amazonaws.com:5173/",
                },
            })
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div className="bg-white px-6 py-8 rounded-3xl shadow-xl shadow-gray-400 text-black w-full max-w-screen-lg mx-auto">

                <h2 className="text-center text-black font-medium text-2xl">
                    👍 Account activated. You can now log in.
                </h2>
            </div>
        </div>
    );
}

export default SuccessReset;

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../config/endpoints";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import "./Profile.css"; // Import styles

const Profile = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const [profilePic, setProfilePic] = useState("/default-avatar.png");
    const { userId } = useParams();

    // Verification state
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOtp] = useState("");

    useEffect(() => {
        if (!userId) {
            toast.error("User ID not found. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchProfileAndPosts = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    toast.error("Unauthorized. Please log in.");
                    setLoading(false);
                    return;
                }

                // Fetch user profile
                const userResponse = await fetch(ENDPOINTS.USERS_BY_ID(userId), {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                const userData = await userResponse.json();

                if (userResponse.status === 200) {
                    setUser(userData.dataValues);
                    setProfilePic(userData.url?.[0]?.url || "/default-avatar.png");
                } else {
                    toast.error(userData.message || "Failed to fetch user profile.");
                }

                // Fetch user posts
                const postsResponse = await fetch(`${ENDPOINTS.CRIME_REPORTS}?userId=${userId}`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                const postsData = await postsResponse.json();

                if (postsResponse.status === 200) {
                    setPosts(Array.isArray(postsData.data) ? postsData.data : []);
                    toast.success("Posts loaded successfully!");
                } else {
                    toast.error(postsData.message || "Failed to fetch posts.");
                }
            } catch (error) {
                toast.error("Network error. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndPosts();
    }, [userId]);

    const handleEditClick = () => {
        setUpdatedData({
            email: user?.email || "",
            phone_number: user?.phone_number || "",
            bio: user?.bio || "",
            contact_info: user?.contact_info || "",
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await fetch(ENDPOINTS.USERS_BY_ID(userId), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (response.status === 200) {
                setUser({ ...user, ...updatedData });
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(data.message || "Failed to update profile.");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        }
    };

    // ✅ Step 1: Send OTP for Identity Verification
    const handleSendOTP = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await fetch(ENDPOINTS.SEND_OTP, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ phone_number: "+8801639317127" }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`OTP sent to your phone number`);
                setIsVerifying(true); // Show OTP input field
            } else {
                toast.error(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            toast.error("Network error while sending OTP.");
        }
    };

    // ✅ Step 2: Verify OTP and update user state
    const handleVerifyOTP = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await fetch(ENDPOINTS.VERIFY_OTP, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ otp: otp }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Identity verified successfully!");
                setUser({ ...user, is_verified: true }); // ✅ Update UI
                setIsVerifying(false);
            } else {
                toast.error(data.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            toast.error("Network error while verifying OTP.");
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src={profilePic} alt="Profile" className="profile-pic" />
                <h2>{user?.email}</h2>
                <p>Joined: {new Date(user?.created_at).toLocaleDateString()}</p>
            </div>

            {/* ✅ Identity Verification Section */}
            <div className="profile-verification">
                <h3>Identity Verification</h3>
                {user?.is_verified ? (
                    <p className="verified-badge">✅ Verified</p>
                ) : (
                    <>
                        {!isVerifying ? (
                            <button className="verify-btn" onClick={handleSendOTP}>
                                Verify Identity
                            </button>
                        ) : (
                            <div className="otp-verification">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <button onClick={handleVerifyOTP}>Submit OTP</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="profile-details">
                <h3>Profile Details</h3>
                <p>Email: {user?.email}</p>
                <p>Phone: {user?.phone_number || "Not provided"}</p>
                <p>Bio: {user?.bio || "No bio available"}</p>
                <p>Contact Info: {user?.contact_info || "Not provided"}</p>
                {userId === user?.id && <button onClick={handleEditClick}>Edit Profile</button>}
            </div>

            <div className="profile-posts">
                <h3>Your Posts</h3>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <h4>{post.title}</h4>
                            <p>{post.description}</p>
                            <p>Location: {post.districts?.name}, {post.districts?.divisions?.name}</p>
                            <p>Crime Time: {new Date(post.crime_time).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../config/endpoints";
import "./Admin.css";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchUsers();
        fetchCrimeReports();
    }, []);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await fetch(ENDPOINTS.GET_ALL_USERS, {
                method: "GET",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });

            const data = await response.json();

            if (response.ok) {
                // Filter users where isAnonymous is false
                const filteredUsers = data.data.filter(user =>
                    !user.is_anonymous && user.email !== "admin@admin.com"
                );

                setUsers(filteredUsers);
                toast.success("Users loaded successfully!");
            } else {
                toast.error("Failed to fetch users.");
            }
        } catch (error) {
            toast.error("Network error while fetching users.");
        } finally {
            setLoadingUsers(false);
        }
    };

    // Fetch all crime reports
    const fetchCrimeReports = async () => {
        try {
            const response = await fetch(ENDPOINTS.CRIME_REPORTS, {
                method: "GET",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            const data = await response.json();
            if (response.ok) {
                setPosts(data.data);
                toast.success("Crime reports loaded successfully!");
            } else {
                toast.error("Failed to fetch crime reports.");
            }
        } catch (error) {
            toast.error("Network error while fetching reports.");
        } finally {
            setLoadingPosts(false);
        }
    };

    // Ban a user
    const handleBanUser = async (userId) => {
        try {
            const response = await fetch(ENDPOINTS.BAN_USER(userId), {
                method: "PUT",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            console.log("Banning user ID:", userId);
            if (response.ok) {
                toast.success("User banned successfully!");
                fetchUsers();
            } else {
                toast.error("Failed to ban user.");
            }
        } catch (error) {
            toast.error("Network error while banning user.");
        }
    };

    // Delete a crime report
    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(ENDPOINTS.DELETE_CRIME_REPORT(postId), {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            if (response.ok) {
                toast.success("Crime report deleted successfully!");
                fetchCrimeReports();
            } else {
                toast.error("Failed to delete report.");
            }
        } catch (error) {
            toast.error("Network error while deleting report.");
        }
    };

    // Delete a comment
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(ENDPOINTS.DELETE_COMMENT(commentId), {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
            if (response.ok) {
                toast.success("Comment deleted successfully!");
                fetchCrimeReports();
            } else {
                toast.error("Failed to delete comment.");
            }
        } catch (error) {
            toast.error("Network error while deleting comment.");
        }
    };

    // ✅ Handle Flag Check
    const handleFlagCheck = async (post) => {
        try {
            // Extract description and image URLs
            const requestBody = {
                description: post.description,
                imageUrls: post.url.map((img) => img.url) || [], // Ensure an array
            };

            console.log("Flag Check Request:", JSON.stringify(requestBody, null, 2));

            const response = await fetch(ENDPOINTS.ANALYSE_REPORT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            console.log("Flag Check Response:", data);

            if (response.ok && data.success) {
                if (data.data.flagged) {
                    toast.error(`Post flagged with confidence score: ${data.data.confidenceScore}%`);
                } else {
                    toast.success(`Post is safe. Confidence score: ${data.data.confidenceScore}%`);
                }
            } else {
                toast.error("Failed to analyze report.");
            }
        } catch (error) {
            toast.error("Network error while analyzing report.");
        }
    };
    const handleVerifyReport = async (postId) => {
        try {
            const response = await fetch(ENDPOINTS.VERIFY_REPORT(postId), {
                method: "PUT",
                headers: { "Authorization": `Bearer ${accessToken}` },
            });
    
            if (response.ok) {
                toast.success("Report verified successfully!");
                fetchCrimeReports(); // Refresh reports
            } else {
                toast.error("Failed to verify report.");
            }
        } catch (error) {
            toast.error("Network error while verifying report.");
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Users Section */}
            <div className="users-section">
                <h2>All Users</h2>
                {loadingUsers ? (
                    <p>Loading users...</p>
                ) : (
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                {user.email}
                                <button className="ban-btn" onClick={() => handleBanUser(user.id)}>Ban</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Posts Section */}
            <div className="posts-section">
                <h2>All Crime Reports</h2>
                {loadingPosts ? (
                    <p>Loading posts...</p>
                ) : (
                    <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            {post.url.length > 0 && (
                                <div className="post-images">
                                    {post.url.map((image, index) => (
                                        <img key={index} src={image.url} alt={image.name} />
                                    ))}
                                </div>
                            )}
                            <button onClick={() => setSelectedPost(post)}>Show More</button>
                            <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>Delete</button>
                            <button className="flag-check-btn" onClick={() => handleFlagCheck(post)}>Flag Check</button>

                            {/* ✅ Verify Button Logic */}
                            {post.is_admin_verified ? (
                                <span className="verified-badge">✅ Already Verified</span>
                            ) : (
                                <button className="verify-btn" onClick={() => handleVerifyReport(post.id)}>Verify</button>
                            )}
                        </li>
                    ))}
                </ul>
                )}

                {/* Show More Modal */}
                {selectedPost && (
                    <div className="modal-backdrop">
                        <div className="post-modal">
                            <h2>{selectedPost.title}</h2>
                            <p><strong>Description:</strong> {selectedPost.description}</p>
                            <p><strong>Division:</strong> {selectedPost.districts?.divisions?.name || "Unknown"}</p>
                            <p><strong>District:</strong> {selectedPost.districts?.name || "Unknown"}</p>
                            <p><strong>Crime Time:</strong> {new Date(selectedPost.crime_time).toLocaleString()}</p>

                            {/* Display comments */}
                            <h3>Comments:</h3>
                            <ul>
                                {selectedPost.comments?.map((comment) => (
                                    <li key={comment.id}>
                                        <p>{comment.content}</p>
                                        <button className="delete-btn" onClick={() => handleDeleteComment(comment.id)}>Delete Comment</button>
                                    </li>
                                ))}
                            </ul>

                            <button className="close-btn" onClick={() => setSelectedPost(null)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;

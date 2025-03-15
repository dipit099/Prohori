import React, { useState, useEffect } from "react";
import {
  MdSend,
  MdClose,
  MdSearch,
  MdThumbUp,
  MdThumbDown,
  MdComment,
} from "react-icons/md";
import { toast } from "react-toastify";
import { ENDPOINTS } from "../../config/endpoints";
import "./CrimeFeed.css";

import { storageService } from "../../storage_config/storage";
const CrimeFeed = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [divisions, setDivisions] = useState({});
    const [loading, setLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
   
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    // Search, Filter & Sort
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");

    // Division & District Filtering
    const [selectedDivision, setSelectedDivision] = useState("");
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");

    // Crime Report Submission
    const [crimeTitle, setCrimeTitle] = useState("");
    const [crimeDescription, setCrimeDescription] = useState("");
    const [crimeDate, setCrimeDate] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    // Comment Modal
    const [commentText, setCommentText] = useState("");
    const [commentImage, setCommentImage] = useState(null);
    // Function to show comments of a selected post
    

          
            // const handleFileChange = (event) => {
            //   const file = event.target.files[0];
          
            //   if (file) {
            //     const reader = new FileReader();
          
            //     // Reading the file as an ArrayBuffer (binary data)
            //     reader.readAsArrayBuffer(file);
          
            //     reader.onload = () => {
            //       // You can access the file data as a binary buffer (ArrayBuffer)
            //       setCommentImage(reader.result);
            //       console.log(reader.result); // This will log the ArrayBuffer (binary data)
            //     };
          
            //     reader.onerror = (error) => {
            //       console.error("Error reading file: ", error);
            //     };
            //   }
            // }

            const handleFileChange = async (event) => {
                const file = event.target.files[0];
                if (file) {
                  try {
                    const blob = new Blob([file], { type: file.type });
                    // Convert blob to binary data
                    const arrayBuffer = await blob.arrayBuffer();
                    
                    setCommentImage(Array.from(new Uint8Array(arrayBuffer)))
                    
                  } catch (error) {
                    console.error("error:", error);
                  }
                }
              };
            

    const accessToken = localStorage.getItem("accessToken");
    

    // Fetch feed data and divisions/districts on component mount
    useEffect(() => {
        fetchFeedData();
        fetchDivisionsAndDistricts();
    }, []);

    // Apply filters whenever dependencies change
    useEffect(() => {
        applyFilters();
    }, [searchQuery, filter, sort, selectedDivision, selectedDistrict, posts]);

    // Fetch feed data
    const fetchFeedData = async () => {
        try {
            setLoading(true);
            const response = await fetch(ENDPOINTS.CRIME_REPORTS, {
                method: "GET",
                headers: { "Accept": "application/json" },
            });
            const data = await response.json();
    
            if (response.ok && data.success) {
                // Process each post and include emergency contacts
                const processedPosts = data.data.map((post) => ({
                    ...post,
                    upvoteCount: calculateUpvoteCount(post),
                    verificationScore: calculateVerificationScore(post),
                    emergencyContacts: post.districts?.emergency_contacts || [], // Extract emergency contacts
                }));
                setPosts(processedPosts);
                setFilteredPosts(processedPosts);
                toast.success("Crime reports and emergency contacts loaded successfully!");
            } else {
                toast.error("Failed to fetch crime reports.");
            }
        } catch (error) {
            toast.error("Network error while fetching crime reports.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleReportContact = async (contactId) => {
        try {
            const response = await fetch(ENDPOINTS.REPORT_CONTACT(contactId), {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${accessToken}` 
                },
            });
    
            if (response.ok) {
                toast.success("Contact reported successfully!");
                fetchFeedData(); // Refresh data
            } else {
                toast.error("Failed to report the contact.");
            }
        } catch (error) {
            toast.error("Network error while reporting contact.");
        }
    };
    

    // Calculate upvote count for a post
    const calculateUpvoteCount = (post) => {
        if (!post.votes) return 0;
        return post.votes.filter((vote) => vote.vote_type === "upvote").length;
    };

    // Calculate verification score for a post
    const calculateVerificationScore = (post) => {
        if (!post.votes || !post.comments) return 0;
        const upvotes = post.votes.filter((vote) => vote.vote_type === "upvote").length;
        const downvotes = post.votes.filter((vote) => vote.vote_type === "downvote").length;
        const commentsCount = post.comments.length;
        return upvotes - downvotes + commentsCount;
    };

    // Fetch divisions and districts
    const fetchDivisionsAndDistricts = async () => {
        try {
            const response = await fetch(ENDPOINTS.GET_DISTRICTS);
            const data = await response.json();

            if (response.ok && data.success) {
                setDivisions(data.data);
                toast.success("Divisions and districts loaded successfully!");
            } else {
                toast.error("Failed to fetch divisions and districts.");
            }
        } catch (error) {
            toast.error("Network error while fetching divisions and districts.");
        }
    };

    // Apply filters and sorting
    const applyFilters = () => {
        let filtered = [...posts];

        // Search
        if (searchQuery) {
            filtered = filtered.filter((post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

const CrimeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [divisions, setDivisions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);

  // Function to fetch and show comments in a modal
  const handleShowComments = (post) => {
    setSelectedPostId(post.id);
    setSelectedComments(post.comments || []); // Set comments for the post
    setShowCommentsModal(true); // Open modal
  };

  // Search, Filter & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  // Division & District Filtering
  const [selectedDivision, setSelectedDivision] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Crime Report Submission
  const [crimeTitle, setCrimeTitle] = useState("");
  const [crimeDescription, setCrimeDescription] = useState("");
  const [crimeDate, setCrimeDate] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  // Comment Modal
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState(null);

  const handleFileChange = (event) => {
    setCommentImage(event.target.files[0]);
  };

  const accessToken = localStorage.getItem("accessToken");

  // Fetch feed data and divisions/districts on component mount
  useEffect(() => {
    fetchFeedData();
    fetchDivisionsAndDistricts();
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filter, sort, selectedDivision, selectedDistrict, posts]);

  // Fetch feed data
  const fetchFeedData = async () => {
    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.CRIME_REPORTS, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        // Calculate upvote count and verification score for each post
        const processedPosts = data.data.map((post) => ({
          ...post,
          upvoteCount: calculateUpvoteCount(post),
          verificationScore: calculateVerificationScore(post),
        }));
        setPosts(processedPosts);
        setFilteredPosts(processedPosts);
        toast.success("Crime reports loaded successfully!");
      } else {
        toast.error("Failed to fetch crime reports.");
      }
    } catch (error) {
      toast.error("Network error while fetching crime reports.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate upvote count for a post
  const calculateUpvoteCount = (post) => {
    if (!post.votes) return 0;
    return post.votes.filter((vote) => vote.vote_type === "upvote").length;
  };

  // Calculate verification score for a post
  const calculateVerificationScore = (post) => {
    if (!post.votes || !post.comments) return 0;
    const upvotes = post.votes.filter(
      (vote) => vote.vote_type === "upvote"
    ).length;
    const downvotes = post.votes.filter(
      (vote) => vote.vote_type === "downvote"
    ).length;
    const commentsCount = post.comments.length;
    return upvotes - downvotes + commentsCount;
  };

  // Fetch divisions and districts
  const fetchDivisionsAndDistricts = async () => {
    try {
      const response = await fetch(ENDPOINTS.GET_DISTRICTS);
      const data = await response.json();

      if (response.ok && data.success) {
        setDivisions(data.data);
        toast.success("Divisions and districts loaded successfully!");
      } else {
        toast.error("Failed to fetch divisions and districts.");
      }
    } catch (error) {
      toast.error("Network error while fetching divisions and districts.");
    }
  };

  // Apply filters and sorting
  const applyFilters = () => {
    let filtered = [...posts];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Division & District
    if (selectedDivision) {
      filtered = filtered.filter(
        (post) => post.districts?.divisions?.name === selectedDivision
      );
    }
    if (selectedDistrict) {
      filtered = filtered.filter(
        (post) => post.districts?.name === selectedDistrict
      );
    }

    // Filter by Verification Score
    if (filter === "verification") {
      filtered = filtered.filter((post) => post.verificationScore > 0);
    }

    // Sorting
    if (sort === "date") {
      filtered.sort((a, b) => new Date(b.crime_time) - new Date(a.crime_time));
    } else if (sort === "upvotes") {
      filtered.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (sort === "verification") {
      filtered.sort((a, b) => b.verificationScore - a.verificationScore);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle image upload and caption generation
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const confirmImageUpload = async () => {
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch(ENDPOINTS.FETCH_CAPTION, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setCrimeDescription(data.caption);
        toast.success("Caption generated successfully!");
      } else {
        toast.error("Failed to generate caption.");
      }
    } catch (error) {
      toast.error("Network error while generating caption.");
    }
  };

  // Handle division change for district selection
  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value);
    setSelectedDistrict("");
    const selectedDivisionData = divisions[e.target.value];
    if (selectedDivisionData) {
      setDistricts(selectedDivisionData.districts);
    } else {
      setDistricts([]);
    }
  };

  // Handle crime report submission
  const handleSubmitPost = async () => {
    try {
      // Retrieve user data
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const user_id = user?.id;

      if (!user_id) {
        console.error("User ID not found.");
        toast.error("User not logged in.");
        return;
      }

      // Convert images to Base64 (needed for JSON transfer)
      const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      // Convert all images to Base64 format
      const imagePromises = imageFiles.map((file) => convertToBase64(file));
      const base64Images = await Promise.all(imagePromises);

      // ✅ Construct JSON payload
      const requestBody = {
        user_id: user_id,
        title: crimeTitle,
        description: crimeDescription,
        crime_time: crimeDate,
        division_id: selectedDivision,
        district_id: selectedDistrict,
        fileArray: base64Images, // ✅ Send images as Base64 array
      };

      // ✅ Print Request Body Before Sending
      console.log("Request Payload:", JSON.stringify(requestBody, null, 2));

      // ✅ Send JSON Request
      const response = await fetch(ENDPOINTS.CREATE_CRIME_REPORT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Required for JSON
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok && data.success) {
        toast.success("Crime report submitted successfully!");
        setShowPostModal(false);
        fetchFeedData(); // Refresh the feed
      } else {
        toast.error("Failed to submit crime report.");
      }
    } catch (error) {
      console.error("Network error while submitting crime report:", error);
      toast.error("Network error while submitting crime report.");
    }
  };

  // Handle upvote/downvote
  const handleVote = async (postId, voteType) => {
    try {
      // Retrieve user data from localStorage and parse it
      const userData = localStorage.getItem("user"); // Corrected key to "user"
      const user = userData ? JSON.parse(userData) : null;
      const user_id = user?.id; // Extract `id` safely

      if (!user_id) {
        console.error("User ID not found.");
        toast.error("User not logged in.");
        return;
      }

      // Construct the request body
      const requestBody = {
        crime_report_id: postId,
        vote_type: voteType,
        user_id: user_id, // Corrected `user_id`
      };

      // Print the request body BEFORE sending
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      // Send the vote request
      const response = await fetch(ENDPOINTS.VOTE_ON_POST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      // Wait for the response
      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok && data.success) {
        toast.success(`Post ${voteType}d successfully!`);
        fetchFeedData(); // Refresh the feed
      } else {
        toast.error(`Failed to ${voteType} post.`);
      }
    } catch (error) {
      console.error("Network error while voting:", error);
      toast.error("Network error while voting.");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    try {
      // Retrieve user data from localStorage and parse it
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const user_id = user?.id;

      if (!user_id) {
        console.error("User ID not found.");
        toast.error("User not logged in.");
        return;
      }

      // Construct FormData for submission
      // const formData = new FormData();
      // formData.append("crime_report_id", selectedPostId);
      // formData.append("content", commentText);
      // formData.append("user_id", user_id);

      // // ✅ Ensure image is always wrapped in an array format [image.jpg]
      // if (commentImage) {
      //     formData.append("image[]", commentImage); // Image key remains the same
      // }
      // console.log("commentImage", commentImage);

      console.log("Request Body:", {
        crime_report_id: selectedPostId,
        content: commentText,
        user_id: user_id,
        fileArray: commentImage ? [`${commentImage}`] : [], // Wrapping single image in array format
      });

      const requestBody = {
        crime_report_id: selectedPostId,
        content: commentText,
        user_id: user_id,
        //fileArray: commentImage ? [`${commentImage}`] : [], // Wrapping single image in array format
      };

      // ✅ Print Stringified Request Body BEFORE Sending
      console.log(
        "Stringified Request Body:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await fetch(ENDPOINTS.COMMENT_ON_POST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Ensure JSON content type is set
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      // Wait for response
      const data = await response.json();

      console.log(data);

      try {
        if (commentImage) {
          const uploadResult = await storageService.uploadFile(
            "prohori",
            [{ fileName: `${data.data.id}.jpg`, file: commentImage }],
            `comments/${data.data.id}`
          );

          if (uploadResult[0].error) {
            toast.error("Image upload failed");
            return;
          }
        }

      } catch (err) {
        console.log(err);
      }
      console.log("Response Data:", data);

      // Wait for response

      if (response.ok && data.success) {
        toast.success("Comment added successfully!");
        setShowCommentModal(false);
        fetchFeedData(); // Refresh the feed
      } else {
        toast.error("Failed to add comment.");
      }
    } catch (error) {
      console.error("Network error while adding comment:", error);
      toast.error("Network error while adding comment.");
    }
  };

  return (
    <div className="crime-feed">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="crime-feed-container">
          {/* Left Side: Post Crime Report & Search */}
          <div className="crime-feed-left">
            <button
              className="whats-on-mind-btn"
              onClick={() => setShowPostModal(true)}
            >
              What's on your mind?
            </button>
            <div className="search-container">
              <MdSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search crime reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Display Posts */}
            <div className="posts-container">
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <div key={post.id} className="post-card">
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <p>
                      <strong>District:</strong>{" "}
                      {post.districts?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Division:</strong>{" "}
                      {post.districts?.divisions?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Crime Time:</strong>{" "}
                      {new Date(post.crime_time).toLocaleString()}
                    </p>
                    {post.url.length > 0 && (
                      <div className="post-images">
                        {post.url.map((image, index) => (
                          <img key={index} src={image.url} alt={image.name} />
                        ))}
                      </div>
                    )}
                    <div className="post-actions">
                      <button onClick={() => handleVote(post.id, "upvote")}>
                        <MdThumbUp /> {post.upvoteCount || 0}
                      </button>
                      <button onClick={() => handleVote(post.id, "downvote")}>
                        <MdThumbDown />{" "}
                        {post.votes?.filter(
                          (vote) => vote.vote_type === "downvote"
                        ).length || 0}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPostId(post.id);
                          setShowCommentModal(true);
                        }}
                      >
                        <MdComment /> {post.comments?.length || 0}
                      </button>
                      <button onClick={() => handleShowComments(post)}>
                        <MdComment /> Show Comments
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPostId(post.id);
                          setShowCommentModal(true);
                        }}
                      >
                        📝 Wanna submit a Comment?
                      </button>
    };
    
        // Handle comment submission
        const handleCommentSubmit = async () => {
            try {
                // Retrieve user data from localStorage and parse it
                const userData = localStorage.getItem("user"); 
                const user = userData ? JSON.parse(userData) : null;
                const user_id = user?.id; 
        
                if (!user_id) {
                    console.error("User ID not found.");
                    toast.error("User not logged in.");
                    return;
                }
        
                // Construct FormData for submission
                // const formData = new FormData();
                // formData.append("crime_report_id", selectedPostId);
                // formData.append("content", commentText);
                // formData.append("user_id", user_id);
        
                // // ✅ Ensure image is always wrapped in an array format [image.jpg]
                // if (commentImage) {
                //     formData.append("image[]", commentImage); // Image key remains the same
                // }
                // console.log("commentImage", commentImage);
        
               
                console.log("Request Body:", {
                    crime_report_id: selectedPostId,
                    content: commentText,
                    user_id: user_id,
                    fileArray: commentImage ? [`${commentImage}`] : [] // Wrapping single image in array format
                });
        
                const requestBody = {
                    crime_report_id: selectedPostId,
                    content: commentText,
                    user_id: user_id,
                    fileArray: commentImage ? [`${commentImage}`] : [], // Wrapping single image in array format
                };
                
                // ✅ Print Stringified Request Body BEFORE Sending
                console.log("Stringified Request Body:", JSON.stringify(requestBody, null, 2));
                
                const response = await fetch(ENDPOINTS.COMMENT_ON_POST, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // ✅ Ensure JSON content type is set
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(requestBody),
                });
                
                // Wait for response
                const data = await response.json();
                console.log("Response Data:", data);
                
                // Wait for response
               
        
                if (response.ok && data.success) {
                    toast.success("Comment added successfully!");
                    setShowCommentModal(false);
                    fetchFeedData(); // Refresh the feed
                } else {
                    toast.error("Failed to add comment.");
                }
            } catch (error) {
                console.error("Network error while adding comment:", error);
                toast.error("Network error while adding comment.");
            }
        };
        
        // Function to show comments of a selected post
    // State to handle comment modal visibility & selected comments
        const [showCommentsModal, setShowCommentsModal] = useState(false);
        const [selectedComments, setSelectedComments] = useState([]);

        // Function to fetch and show comments in a modal
        const handleShowComments = (post) => {
            setSelectedPostId(post.id);
            setSelectedComments(post.comments || []); // Set comments for the post
            setShowCommentsModal(true); // Open modal
        };


        
    return (
        <div className="crime-feed">
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="crime-feed-container">
                    {/* Left Side: Post Crime Report & Search */}
                    <div className="crime-feed-left">
                        <button className="whats-on-mind-btn" onClick={() => setShowPostModal(true)}>What's on your mind?</button>
                        <div className="search-container">
                            <MdSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search crime reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Display Posts */}
                        <div className="posts-container">
                            {currentPosts.length > 0 ? (
                                currentPosts.map((post) => (
                                    <div key={post.id} className="post-card">
                                    <h3>{post.title}</h3>
                                    <p>{post.description}</p>
                                    <p><strong>District:</strong> {post.districts?.name || "Unknown"}</p>
                                    <p><strong>Division:</strong> {post.districts?.divisions?.name || "Unknown"}</p>
                                    <p><strong>Crime Time:</strong> {new Date(post.crime_time).toLocaleString()}</p>
                                    
                                    {post.url.length > 0 && (
                                        <div className="post-images">
                                            {post.url.map((image, index) => (
                                                <img key={index} src={image.url} alt={image.name} />
                                            ))}
                                        </div>
                                    )}
                                
                                    {/* Emergency Contacts Section */}
                                    {post.emergencyContacts.length > 0 && (
                                        <div className="emergency-contacts">
                                            <h4>Emergency Contacts:</h4>
                                            <ul>
                                                {post.emergencyContacts.map((contact) => (
                                                    <li key={contact.id} className="contact-item">
                                                        <p><strong>Type:</strong> {contact.type.replace("_", " ")}</p>
                                                        <p><strong>Location:</strong> {contact.location}</p>
                                                        <p><strong>Phone:</strong> {contact.phone_number}</p>
                                                        <p><strong>Email:</strong> {contact.email}</p>
{/*                                 
                                                        {!contact.is_reported ? (
                                                            <button 
                                                                className="report-contact-btn" 
                                                                onClick={() => handleReportContact(contact.id)}
                                                            >
                                                                🚨 Report Contact
                                                            </button>
                                                        ) : (
                                                            <span className="reported-badge">⚠️ Reported</span>
                                                        )} */}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                
                                    <div className="post-actions">
                                        <button onClick={() => handleVote(post.id, "upvote")}>
                                            <MdThumbUp /> {post.upvoteCount || 0}
                                        </button>
                                        <button onClick={() => handleVote(post.id, "downvote")}>
                                            <MdThumbDown /> {post.votes?.filter((vote) => vote.vote_type === "downvote").length || 0}
                                        </button>
                                        <button onClick={() => handleShowComments(post)}>
                                            <MdComment /> Show Comments
                                        </button>
                                        <button onClick={() => { setSelectedPostId(post.id); setShowCommentModal(true); }}>
                                            📝 Wanna submit a Comment?
                                        </button>
                                    </div>
                                
                                    <p><strong>Verification Score:</strong> {post.verificationScore}</p>
                                </div>
                                
                                ))
                            ) : (
                                <p>No crime reports found.</p>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="pagination">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    </div>

                    {/* Right Side: Filters & Sorting */}
                    <div className="crime-feed-right">
                        <h2>Filters & Sorting</h2>

                        {/* Division Selection */}
                        <select onChange={(e) => setSelectedDivision(e.target.value)} value={selectedDivision}>
                            <option value="">Select Division</option>
                            {Object.keys(divisions).map((division) => (
                                <option key={divisions[division].division_id} value={division}>
                                    {division}
                                </option>
                            ))}
                        </select>

                        {/* District Selection */}
                        <select onChange={(e) => setSelectedDistrict(e.target.value)} value={selectedDistrict} disabled={!selectedDivision}>
                            <option value="">Select District</option>
                            {selectedDivision &&
                                divisions[selectedDivision]?.districts?.map((district) => (
                                    <option key={district.id} value={district.name}>{district.name}</option>
                                ))}
                        </select>

                        {/* Filters */}
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="">Filter by</option>
                            <option value="verification">Verification Score</option>
                        </select>

                        {/* Sorting */}
                        <select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="">Sort by</option>
                            <option value="date">Date</option>
                            <option value="upvotes">Upvotes</option>
                            <option value="verification">Verification Score</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Modal for submitting a crime report */}
            {showPostModal && (
                <div className="modal-backdrop">
                    <div className="post-modal">
                        <button className="close-btn" onClick={() => setShowPostModal(false)}><MdClose /></button>
                        <h3>Submit a Crime Report</h3>

                        <input type="text" placeholder="Title" value={crimeTitle} onChange={(e) => setCrimeTitle(e.target.value)} />

                        {/* Image Upload */}
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                        <button onClick={confirmImageUpload}>Confirm Images & Generate Caption</button>
                        {imageUrls.length > 0 && <p>{imageUrls.length} Images Confirmed ✅</p>}

                        {/* Description Input */}
                        <textarea placeholder="Description" value={crimeDescription} onChange={(e) => setCrimeDescription(e.target.value)} />

                        {/* Date Picker */}
                        <input type="date" value={crimeDate} onChange={(e) => setCrimeDate(e.target.value)} />

                        {/* Division Selection */}
                        <select onChange={handleDivisionChange} value={selectedDivision}>
                            <option value="">Select Division</option>
                            {Object.keys(divisions).map((division) => (
                                <option key={divisions[division].division_id} value={division}>
                                    {division}
                                </option>
                            ))}
                        </select>

                        {/* District Selection */}
                        <select onChange={(e) => setSelectedDistrict(e.target.value)} value={selectedDistrict} disabled={!selectedDivision}>
                            <option value="">Select District</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>{district.name}</option>
                            ))}
                        </select>

                        <button onClick={handleSubmitPost}><MdSend /> Submit</button>
                    </div>
                    <p>
                      <strong>Verification Score:</strong>{" "}
                      {post.verificationScore}
                    </p>
                  </div>
                ))
              ) : (
                <p>No crime reports found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          {/* Right Side: Filters & Sorting */}
          <div className="crime-feed-right">
            <h2>Filters & Sorting</h2>

            {/* Division Selection */}
            <select
              onChange={(e) => setSelectedDivision(e.target.value)}
              value={selectedDivision}
            >
              <option value="">Select Division</option>
              {Object.keys(divisions).map((division) => (
                <option key={divisions[division].division_id} value={division}>
                  {division}
                </option>
              ))}
            </select>

            {/* District Selection */}
            <select
              onChange={(e) => setSelectedDistrict(e.target.value)}
              value={selectedDistrict}
              disabled={!selectedDivision}
            >
              <option value="">Select District</option>
              {selectedDivision &&
                divisions[selectedDivision]?.districts?.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
            </select>

            {/* Filters */}
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">Filter by</option>
              <option value="verification">Verification Score</option>
            </select>

            {/* Sorting */}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Sort by</option>
              <option value="date">Date</option>
              <option value="upvotes">Upvotes</option>
              <option value="verification">Verification Score</option>
            </select>
          </div>
        </div>
      )}

      {/* Modal for submitting a crime report */}
      {showPostModal && (
        <div className="modal-backdrop">
          <div className="post-modal">
            <button
              className="close-btn"
              onClick={() => setShowPostModal(false)}
            >
              <MdClose />
            </button>
            <h3>Submit a Crime Report</h3>

            <input
              type="text"
              placeholder="Title"
              value={crimeTitle}
              onChange={(e) => setCrimeTitle(e.target.value)}
            />

            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <button onClick={confirmImageUpload}>
              Confirm Images & Generate Caption
            </button>
            {imageUrls.length > 0 && (
              <p>{imageUrls.length} Images Confirmed ✅</p>
            )}
            {/* Modal for showing comments */}
{showCommentsModal && (
    <div className="modal-backdrop">
        <div className="comments-modal">
            <button className="close-btn" onClick={() => setShowCommentsModal(false)}>
                <MdClose />
            </button>
            <h3>All Comments</h3>

            {selectedComments.length > 0 ? (
                <ul>
                    {selectedComments.map((comment, index) => (
                        <li key={index} className="comment-item">
                            <p><strong>{comment.user?.email || "Anonymous"}:</strong> {comment.content}</p>
                            {comment.url?.length > 0 && (
                                <img src={comment.url[0].url} alt="Comment Image" className="comment-image" />
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No comments available for this post.</p>
            )}
        </div>
    </div>
)}


            {/* Description Input */}
            <textarea
              placeholder="Description"
              value={crimeDescription}
              onChange={(e) => setCrimeDescription(e.target.value)}
            />

            {/* Date Picker */}
            <input
              type="date"
              value={crimeDate}
              onChange={(e) => setCrimeDate(e.target.value)}
            />

            {/* Division Selection */}
            <select onChange={handleDivisionChange} value={selectedDivision}>
              <option value="">Select Division</option>
              {Object.keys(divisions).map((division) => (
                <option key={divisions[division].division_id} value={division}>
                  {division}
                </option>
              ))}
            </select>

            {/* District Selection */}
            <select
              onChange={(e) => setSelectedDistrict(e.target.value)}
              value={selectedDistrict}
              disabled={!selectedDivision}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>

            <button onClick={handleSubmitPost}>
              <MdSend /> Submit
            </button>
          </div>
        </div>
      )}
      {/* Modal for showing comments */}
      {showCommentsModal && (
        <div className="modal-backdrop">
          <div className="comments-modal">
            <button
              className="close-btn"
              onClick={() => setShowCommentsModal(false)}
            >
              <MdClose />
            </button>
            <h3>All Comments</h3>

            {selectedComments.length > 0 ? (
              <ul>
                {selectedComments.map((comment, index) => (
                  <li key={index} className="comment-item">
                    <p>
                      <strong>{comment.user?.email || "Anonymous"}:</strong>{" "}
                      {comment.content}
                    </p>
                    {comment.url?.length > 0 && (
                      <img
                        src={comment.url[0].url}
                        alt="Comment Image"
                        className="comment-image"
                      />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments available for this post.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal for adding a comment */}
      {showCommentModal && (
        <div className="modal-backdrop">
          <div className="comment-modal">
            <button
              className="close-btn"
              onClick={() => setShowCommentModal(false)}
            >
              <MdClose />
            </button>
            <h3>Add a Comment</h3>

            <textarea
              placeholder="Comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            {/* Image Upload for Comment */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleFileChange(e);
              }}
            />

            <button onClick={handleCommentSubmit}>
              <MdSend /> Submit Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrimeFeed;

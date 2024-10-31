// Blog.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "contentful";
import "../css/Blog.css";
import Footer from "./Footer";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  // Contentful client initialization
  const client = createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await client.getEntries({
          content_type: process.env.REACT_APP_CONTENTFUL_CONTENT_TYPE,
        });
        setBlogs(response.items);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [client]);

  const handleBlogClick = (slug, id) => {
    navigate(`/blogs/${slug}/${id}`);
  };

  return (
    <div className="blogs-wrapper">
      <div className="events-container">
        <div className="events">
          {blogs.map((blog) => (
            <div
              key={blog.sys.id}
              className="event"
              onClick={() => handleBlogClick(blog.fields.slug, blog.sys.id)}
            >
              <div className="event-thumb-container">
                <img
                  src={blog.fields.featuredImage.fields.file.url}
                  alt="thumbnail"
                  className="event-thumbnail"
                />
              </div>
              <div className="event-description">
                <p className="event-name">{blog.fields.title}</p>
                <p className="event-info">
                  Written By: {blog.fields.writtenBy}
                </p>
                <p className="event-info">Date: {blog.fields.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;

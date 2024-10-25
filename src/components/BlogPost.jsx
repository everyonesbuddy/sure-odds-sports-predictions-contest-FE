import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "contentful";
import ReactMarkdown from "react-markdown";
import "../css/BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const client = createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  });

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await client.getEntries({
          content_type: process.env.REACT_APP_CONTENTFUL_CONTENT_TYPE,
          "sys.id": id,
        });

        if (response.items.length > 0) {
          setBlogPost(response.items[0]);
        } else {
          console.error("Blog post not found");
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [client, id]);

  if (loading) return <p>Loading...</p>;
  if (!blogPost) return <p>Blog post not found.</p>;

  return (
    <div className="blog-post">
      <h1 className="blog-post-title">{blogPost.fields.title}</h1>
      <div className="blog-post-meta">
        <p>Written by: {blogPost.fields.writtenBy}</p>
        <p>Date: {blogPost.fields.date}</p>
      </div>
      {blogPost.fields.featuredImage && (
        <img
          src={blogPost.fields.featuredImage.fields.file.url}
          alt={blogPost.fields.title}
          className="blog-post-image"
        />
      )}
      {/* Render markdown content */}
      <div className="blog-post-content">
        <ReactMarkdown>{blogPost.fields.content2}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogPost;

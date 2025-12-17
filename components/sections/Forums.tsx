
import React, { useState, useEffect } from 'react';
import { ForumPost, UserType } from '../../types';
import { getForumPosts } from '../../services/mockDataService';
import { useAppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';

const Forums: React.FC = () => {
  const { userType } = useAppContext();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const results = await getForumPosts();
      setPosts(results);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-brand-dark">Forums</h1>
        {userType === UserType.PATIENT && <Button>Ask a Question</Button>}
        {userType === UserType.RESEARCHER && <Button variant="secondary">Create Community</Button>}
      </div>

      {isLoading ? <p>Loading posts...</p> : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <span className="text-sm font-bold text-brand-blue">{post.category}</span>
              <h3 className="text-2xl font-bold text-brand-dark mt-1">{post.title}</h3>
              <p className="text-xs text-gray-500 mb-4">by {post.author}</p>
              <p className="text-brand-text mb-6">{post.content}</p>

              {post.replies.length > 0 && (
                <div className="border-t border-brand-gray pt-4 space-y-4">
                  {post.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-bold text-brand-green">{reply.author}</p>
                      <p className="text-brand-text">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {userType === UserType.RESEARCHER && (
                <div className="mt-4">
                  <textarea className="w-full p-2 border border-brand-gray rounded-lg" rows={2} placeholder="Write a reply..."></textarea>
                  <Button size="sm" variant="secondary" className="mt-2">Reply</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forums;

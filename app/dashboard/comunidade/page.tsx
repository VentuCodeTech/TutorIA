'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';

interface ForumPost {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  content: string;
  exam_tag: string | null;
  likes: number;
  replies_count: number;
  created_at: string;
}

interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  likes: number;
  created_at: string;
}

const categories = ['Todos', 'ENEM', 'Vestibular', 'Concursos', 'Dicas', 'Conquistas', 'Duvidas', 'OAB', 'CPA-20'];

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return Math.floor(diff / 60) + ' min atras';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h atras';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd atras';
  if (diff < 2592000) return Math.floor(diff / 604800) + ' sem atras';
  if (diff < 31536000) return Math.floor(diff / 2592000) + ' mes atras';
  return Math.floor(diff / 31536000) + ' ano atras';
}

export default function ComunidadePage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Dicas');
  const [showNewPost, setShowNewPost] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [shareMsg, setShareMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [repliesMap, setRepliesMap] = useState<Record<string, ForumReply[]>>({});
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<string | null>(null);
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const channelRef = useRef<any>(null);
  const supabase = createClient();

  const fetchPosts = async () => {
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('forum_posts')
        .select('id, user_id, title, content, exam_tag, likes, replies_count, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) {
        setError('Erro ao carregar posts. Tente novamente.');
      } else if (data) {
        const mapped: ForumPost[] = data.map((p: Record<string, unknown>) => {
          const rawTitle = p.title as string;
          const hasDelimiter = rawTitle.includes('||');
          return {
            id: p.id as string,
            user_id: p.user_id as string,
            user_name: hasDelimiter ? rawTitle.split('||')[0] : 'Usuario',
            title: hasDelimiter ? rawTitle.split('||')[1] : rawTitle,
            content: p.content as string,
            exam_tag: p.exam_tag as string | null,
            likes: p.likes as number,
            replies_count: p.replies_count as number,
            created_at: p.created_at as string,
          };
        });
        setPosts(mapped);
      }
    } catch {
      setError('Erro de conexao. Tente novamente.');
    }
  };

  const fetchReplies = async (postId: string) => {
    setLoadingReplies((prev) => new Set(prev).add(postId));
    try {
      const { data, error: fetchError } = await supabase
        .from('forum_replies')
        .select('id, post_id, user_id, content, likes, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!fetchError && data) {
        const mapped: ForumReply[] = data.map((r: Record<string, unknown>) => {
          const rawContent = r.content as string;
          const hasDelimiter = rawContent.includes('||');
          return {
            id: r.id as string,
            post_id: r.post_id as string,
            user_id: r.user_id as string,
            user_name: hasDelimiter ? rawContent.split('||')[0] : 'Usuario',
            content: hasDelimiter ? rawContent.split('||')[1] : rawContent,
            likes: r.likes as number,
            created_at: r.created_at as string,
          };
        });
        setRepliesMap((prev) => ({ ...prev, [postId]: mapped }));
      }
    } catch {}
    setLoadingReplies((prev) => { const s = new Set(prev); s.delete(postId); return s; });
  };

  const toggleReplies = async (postId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      if (!repliesMap[postId]) {
        await fetchReplies(postId);
      }
    }
    setExpandedReplies(newExpanded);
  };

  const handleSubmitReply = async (postId: string) => {
    const content = replyContent[postId]?.trim();
    if (!content || !userId) return;
    setSubmittingReply(postId);
    try {
      const contentField = userName + '||' + content;
      const { error: insertError } = await supabase
        .from('forum_replies')
        .insert([{
          post_id: postId,
          user_id: userId,
          content: contentField,
          likes: 0,
        }]);

      if (!insertError) {
        setReplyContent((prev) => ({ ...prev, [postId]: '' }));
        await fetchReplies(postId);
        const post = posts.find((p) => p.id === postId);
        if (post) {
          const newCount = post.replies_count + 1;
          await supabase.from('forum_posts').update({ replies_count: newCount }).eq('id', postId);
          setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, replies_count: newCount } : p));
        }
      }
    } catch {}
    setSubmittingReply(null);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
        setUserName(name);
        const savedLikes = localStorage.getItem('liked_posts_' + user.id);
        if (savedLikes) {
          try { setLikedPosts(new Set(JSON.parse(savedLikes))); } catch {}
        }
      }
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };
    init();

    const channel = supabase
      .channel('forum_posts_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'forum_posts',
      }, (payload: { new: any }) => {
        const newPost = payload.new;
        const rawTitle = newPost.title as string;
        const hasDelimiter = rawTitle.includes('||');
        const mapped: ForumPost = {
          id: newPost.id as string,
          user_id: newPost.user_id as string,
          user_name: hasDelimiter ? rawTitle.split('||')[0] : 'Usuario',
          title: hasDelimiter ? rawTitle.split('||')[1] : rawTitle,
          content: newPost.content as string,
          exam_tag: newPost.exam_tag as string | null,
          likes: newPost.likes as number,
          replies_count: newPost.replies_count as number,
          created_at: newPost.created_at as string,
        };
        setPosts((prev) => {
          if (prev.some((p) => p.id === mapped.id)) return prev;
          return [mapped, ...prev];
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'forum_posts',
      }, (payload: { new: any }) => {
        const updated = payload.new;
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, likes: updated.likes as number, replies_count: updated.replies_count as number } : p)));
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const filteredPosts = selectedCategory === 'Todos'
    ? posts
    : posts.filter((p) => p.exam_tag === selectedCategory);

  const handleSubmitPost = async () => {
    if (!newPostContent.trim() || !userId) return;
    setSubmitting(true);
    setError('');

    const titleField = userName + '||' + (newPostTitle.trim() || newPostContent.trim().substring(0, 60));

    const { error: insertError } = await supabase
      .from('forum_posts')
      .insert([{
        user_id: userId,
        title: titleField,
        content: newPostContent.trim(),
        exam_tag: newCategory,
        subject_tag: newCategory,
        likes: 0,
        replies_count: 0,
      }]);

    if (insertError) {
      setError('Erro ao publicar: ' + insertError.message);
    } else {
      setNewPostContent('');
      setNewPostTitle('');
      setShowNewPost(false);
      await fetchPosts();
    }
    setSubmitting(false);
  };

  const handleLike = async (id: string) => {
    if (!userId) return;
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const newLiked = new Set(likedPosts);
    let newLikes: number;

    if (likedPosts.has(id)) {
      newLiked.delete(id);
      newLikes = Math.max(0, post.likes - 1);
    } else {
      newLiked.add(id);
      newLikes = post.likes + 1;
    }

    setLikedPosts(newLiked);
    setPosts(posts.map((p) => (p.id === id ? { ...p, likes: newLikes } : p)));
    localStorage.setItem('liked_posts_' + userId, JSON.stringify(Array.from(newLiked)));

    await supabase.from('forum_posts').update({ likes: newLikes }).eq('id', id);
  };

  const handleShare = async (post: ForumPost) => {
    const url = globalThis.location.origin + '/dashboard/comunidade';
    const text = '"' + post.content.substring(0, 100) + '..." — Tirei10 Comunidade';
    if (navigator.share) {
      try { await navigator.share({ title: 'Tirei10 Comunidade', text, url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareMsg(post.id);
        setTimeout(() => setShareMsg(''), 2000);
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">Comunidade</div>
    </div>
  );
}

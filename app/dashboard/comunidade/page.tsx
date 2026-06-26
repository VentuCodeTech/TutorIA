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
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
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
    } catch { /* silently ignore */ }
    setLoadingReplies((prev) => {
      const s = new Set(prev);
      s.delete(postId);
      return s;
    });
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
    } catch { /* silently ignore */ }
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
          try { setLikedPosts(new Set(JSON.parse(savedLikes))); } catch { /* silently ignore */ }
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
      }, (payload: { new: Record<string, unknown> }) => {
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
      }, (payload: { new: Record<string, unknown> }) => {
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
      try { await navigator.share({ title: 'Tirei10 Comunidade', text, url }); } catch { /* silently ignore */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareMsg(post.id);
        setTimeout(() => setShareMsg(''), 2000);
      } catch { /* silently ignore */ }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">👥 Comunidade</h1>
            <p className="text-gray-600 mt-1">Conecte-se com outros estudantes</p>
          </div>
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {userId && (
            <div className="mb-6">
              {!showNewPost ? (
                <button
                  onClick={() => setShowNewPost(true)}
                  className="w-full bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-left"
                >
                  ✏️ Compartilhe algo com a comunidade...
                </button>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4">Nova Publicação</h3>
                  <input
                    type="text"
                    placeholder="Título (opcional)"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-3 text-sm focus:outline-none focus:border-indigo-400"
                  />
                  <textarea
                    placeholder="O que você quer compartilhar?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-3 text-sm focus:outline-none focus:border-indigo-400 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                    >
                      {categories.filter((c) => c !== 'Todos').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => setShowNewPost(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
                      <button
                        onClick={handleSubmitPost}
                        disabled={submitting || !newPostContent.trim()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {submitting ? 'Publicando...' : 'Publicar'}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
              )}
            </div>
          )}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Carregando posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">💬</div>
              <p>Nenhum post encontrado. Seja o primeiro a compartilhar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const isExpanded = expandedReplies.has(post.id);
                const replies = repliesMap[post.id] || [];
                const isLoadingReplies = loadingReplies.has(post.id);
                return (
                  <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                          {post.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{post.user_name}</p>
                          <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
                        </div>
                      </div>
                      {post.exam_tag && (
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{post.exam_tag}</span>
                      )}
                    </div>
                    {post.title && <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 hover:text-indigo-600 transition-colors ${likedPosts.has(post.id) ? 'text-indigo-600' : ''}`}>
                        {likedPosts.has(post.id) ? '❤️' : '🤍'} {post.likes}
                      </button>
                      <button onClick={() => toggleReplies(post.id)} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                        💬 {post.replies_count} {post.replies_count === 1 ? 'resposta' : 'respostas'}
                      </button>
                      <button onClick={() => handleShare(post)} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                        {shareMsg === post.id ? '✅ Copiado!' : '🔗 Compartilhar'}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-100">
                        {isLoadingReplies ? (
                          <p className="text-sm text-gray-400">Carregando respostas...</p>
                        ) : (
                          <>
                            {replies.map((reply) => (
                              <div key={reply.id} className="mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-xs">
                                    {reply.user_name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">{reply.user_name}</span>
                                  <span className="text-xs text-gray-400">{timeAgo(reply.created_at)}</span>
                                </div>
                                <p className="text-sm text-gray-600 ml-9">{reply.content}</p>
                              </div>
                            ))}
                            {userId && (
                              <div className="flex gap-2 mt-3">
                                <input
                                  type="text"
                                  placeholder="Escreva uma resposta..."
                                  value={replyContent[post.id] || ''}
                                  onChange={(e) => setReplyContent((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitReply(post.id); }}
                                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                                />
                                <button
                                  onClick={() => handleSubmitReply(post.id)}
                                  disabled={submittingReply === post.id || !replyContent[post.id]?.trim()}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                  {submittingReply === post.id ? '...' : 'Responder'}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);
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
      }, (payload: { new: Record<string, unknown> }) => { // NOSONAR
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
        setPosts((prev) => { // NOSONAR
          if (prev.some((p) => p.id === mapped.id)) return prev; // NOSONAR
          return [mapped, ...prev];
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'forum_posts',
      }, (payload: { new: Record<string, unknown> }) => { // NOSONAR
        const updated = payload.new;
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, likes: updated.likes as number, replies_count: updated.replies_count as number } : p))); // NOSONAR
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
      <div className="ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comunidade</h1>
              <p className="text-gray-600 mt-1">Forum da Tirei10 — compartilhe duvidas, dicas e conquistas em tempo real</p>
            </div>
            {userId && (
              <button
                onClick={() => setShowNewPost(!showNewPost)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                + Nova Publicacao
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
              Forum ao vivo — {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button onClick={fetchPosts} className="text-red-600 underline ml-4 hover:text-red-800">Tentar novamente</button>
            </div>
          )}

          {showNewPost && userId && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Nova Publicacao</h3>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Titulo (opcional)"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                maxLength={120}
              />
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Compartilhe uma duvida, dica ou conquista com a comunidade..."
                className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-4">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.filter((c) => c !== 'Todos').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowNewPost(false); setNewPostContent(''); setNewPostTitle(''); }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitPost}
                    disabled={!newPostContent.trim() || submitting}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {submitting ? 'Publicando...' : 'Publicar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!userId && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-6 text-center">
              <p className="text-indigo-800 text-sm font-medium">Faca login para publicar no forum e interagir com a comunidade.</p>
            </div>
          )}

          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={'px-4 py-2 rounded-full text-sm font-medium transition-colors ' + (selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300')}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? ( // NOSONAR
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length === 0 ? ( // NOSONAR
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">&#128172;</p>
              <p className="font-medium text-gray-500">Nenhum post nesta categoria ainda.</p>
              <p className="text-sm mt-1">Seja o primeiro a publicar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => {  const replyWord = post.replies_count === 1 ? 'resposta' : 'respostas'; // NOSONAR  return (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {post.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{post.user_name}</p>
                          <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
                        </div>
                      </div>
                      {post.exam_tag && (
                        <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium flex-shrink-0">
                          {post.exam_tag}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">{post.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        disabled={!userId}
                        className={'flex items-center gap-1.5 transition-colors text-sm font-medium ' + (likedPosts.has(post.id) ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-red-500')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likes}
                      </button>
                      <button
                        onClick={() => toggleReplies(post.id)}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.replies_count > 0 ? post.replies_count + ' ' + replyWord : 'Responder'}
                        {expandedReplies.has(post.id) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleShare(post)}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        {shareMsg === post.id ? 'Link copiado!' : 'Compartilhar'}
                      </button>
                    </div>
                  </div>

                  {expandedReplies.has(post.id) && (
                    <div className="border-t border-gray-100 bg-gray-50 rounded-b-2xl px-6 py-4">
                      {loadingReplies.has(post.id) ? (
                        <div className="flex justify-center py-4">
                          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(repliesMap[post.id] || []).length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-2">Nenhuma resposta ainda. Seja o primeiro!</p>
                          )}
                          {(repliesMap[post.id] || []).map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-purple-600 font-semibold text-xs">
                                  {reply.user_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 bg-white rounded-xl p-3 border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900 text-xs">{reply.user_name}</span>
                                  <span className="text-gray-400 text-xs">{timeAgo(reply.created_at)}</span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                          {userId && (
                            <div className="flex gap-3 mt-3 pt-3 border-t border-gray-200">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-600 font-semibold text-xs">
                                  {userName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={replyContent[post.id] || ''}
                                  onChange={(e) => setReplyContent((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                  placeholder="Escreva sua resposta..."
                                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
                                  rows={2}
                                  maxLength={1000}
                                />
                                <div className="flex justify-end mt-2">
                                  <button
                                    onClick={() => handleSubmitReply(post.id)}
                                    disabled={!replyContent[post.id]?.trim() || submittingReply === post.id}
                                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                  >
                                    {submittingReply === post.id ? 'Enviando...' : 'Responder'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
            ); }))
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

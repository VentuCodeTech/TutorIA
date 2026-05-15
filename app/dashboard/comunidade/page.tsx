'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';

interface Post {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  category: string;
  likes: number;
  created_at: string;
}

const mockPosts: Post[] = [
  { id: '1', user_id: 'u1', user_name: 'Ana Silva', content: 'Alguém tem dicas para estudar Matemática para o ENEM? Estou com dificuldade em logaritmos!', category: 'ENEM', likes: 12, created_at: '2024-01-10' },
  { id: '2', user_id: 'u2', user_name: 'Carlos Mendes', content: 'Compartilhando minha rotina de estudos: 2h de manhã e 2h à noite. Resultados incríveis em 3 meses!', category: 'Dicas', likes: 34, created_at: '2024-01-09' },
  { id: '3', user_id: 'u3', user_name: 'Beatriz Costa', content: 'Consegui passar na FUVEST! Obrigada TutorIA pela ajuda com as questões de Redação!', category: 'Conquistas', likes: 89, created_at: '2024-01-08' },
  { id: '4', user_id: 'u4', user_name: 'Rafael Lima', content: 'Quem mais está estudando para concursos da área policial? Vamos criar um grupo de estudos?', category: 'Concursos', likes: 23, created_at: '2024-01-07' },
  { id: '5', user_id: 'u5', user_name: 'Juliana Ferreira', content: 'Dica: A técnica Pomodoro funciona muito bem! 25 min estudando, 5 min de pausa. Testei e aprovei!', category: 'Dicas', likes: 45, created_at: '2024-01-06' },
];

const categories = ['Todos', 'ENEM', 'Vestibular', 'Concursos', 'Dicas', 'Conquistas', 'Dúvidas'];

export default function ComunidadePage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [newPost, setNewPost] = useState('');
  const [newCategory, setNewCategory] = useState('Dicas');
  const [showNewPost, setShowNewPost] = useState(false);
  const [userName, setUserName] = useState('Você');
  const [userId, setUserId] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [shareMsg, setShareMsg] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Você');
        // Carregar likes já dados pelo usuário (localStorage por post)
        const savedLikes = localStorage.getItem(`liked_posts_${user.id}`);
        if (savedLikes) {
          setLikedPosts(new Set(JSON.parse(savedLikes)));
        }
      }
    };
    getUser();
  }, []);

  const filteredPosts = selectedCategory === 'Todos'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      user_id: userId,
      user_name: userName,
      content: newPost,
      category: newCategory,
      likes: 0,
      created_at: new Date().toISOString().split('T')[0],
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setShowNewPost(false);
  };

  const handleLike = (id: string) => {
    if (likedPosts.has(id)) {
      // Remover like
      const newLiked = new Set(likedPosts);
      newLiked.delete(id);
      setLikedPosts(newLiked);
      setPosts(posts.map(p => p.id === id ? { ...p, likes: Math.max(0, p.likes - 1) } : p));
      localStorage.setItem(`liked_posts_${userId}`, JSON.stringify(Array.from(newLiked)));
    } else {
      // Adicionar like (apenas 1 por usuário por post)
      const newLiked = new Set(likedPosts);
      newLiked.add(id);
      setLikedPosts(newLiked);
      setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
      localStorage.setItem(`liked_posts_${userId}`, JSON.stringify(Array.from(newLiked)));
    }
  };

  const handleShare = async (post: Post) => {
    const url = `${window.location.origin}/dashboard/comunidade?post=${post.id}`;
    const text = `${post.user_name} na TutorIA: "${post.content.substring(0, 100)}..." - Confira!`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'TutorIA - Comunidade', text, url });
      } catch {}
    } else {
      // Fallback: copiar link
      try {
        await navigator.clipboard.writeText(url);
        setShareMsg(post.id);
        setTimeout(() => setShareMsg(''), 2000);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setShareMsg(post.id);
        setTimeout(() => setShareMsg(''), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">👥 Comunidade</h1>
              <p className="text-gray-600 mt-1">Conecte-se com outros estudantes, compartilhe dicas e conquistas</p>
            </div>
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              + Nova Publicação
            </button>
          </div>

          {showNewPost && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Nova Publicação</h3>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Compartilhe uma dúvida, dica ou conquista com a comunidade..."
                className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
              />
              <div className="flex items-center justify-between mt-4">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.filter(c => c !== 'Todos').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitPost}
                    disabled={!newPost.trim()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {post.user_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{post.user_name}</p>
                      <p className="text-xs text-gray-400">{post.created_at}</p>
                    </div>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{post.content}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 transition-colors text-sm font-medium ${
                      likedPosts.has(post.id)
                        ? 'text-red-500 hover:text-red-700'
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                    title={likedPosts.has(post.id) ? 'Remover curtida' : 'Curtir (1 curtida por conta)'}
                  >
                    {likedPosts.has(post.id) ? '❤️' : '🤍'} {post.likes}
                  </button>
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors text-sm"
                    title="Copiar link de compartilhamento"
                  >
                    🔗 {shareMsg === post.id ? 'Link copiado!' : 'Compartilhar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

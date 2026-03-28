import { useState, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const VIDEOS = [
  {
    id: 1,
    user: "@dance_king",
    avatar: "🕺",
    title: "Уличный танец под неоновыми огнями #dance #viral",
    thumbnail: "https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/6e714e5c-5c44-4506-8993-bb7443677f2e.jpg",
    likes: 142800,
    dislikes: 320,
    comments: 4200,
    shares: 18900,
    song: "Neon Nights — DJ Sigma",
  },
  {
    id: 2,
    user: "@foodie_life",
    avatar: "👩‍🍳",
    title: "Готовлю тайскую лапшу за 5 минут 🍜 #food #cooking",
    thumbnail: "https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/470facc7-0cfb-4b56-8363-6a2eb0780efe.jpg",
    likes: 89400,
    dislikes: 120,
    comments: 2800,
    shares: 9300,
    song: "Cooking Vibes — Lo-Fi Mix",
  },
  {
    id: 3,
    user: "@skate_pro",
    avatar: "🛹",
    title: "Новый трюк на закате! Месяц тренировок 💪 #skate #sports",
    thumbnail: "https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/a59a051f-e68f-4aad-9e2b-4c8d98a566e3.jpg",
    likes: 234100,
    dislikes: 450,
    comments: 8100,
    shares: 31200,
    song: "Skater Boy Remix — Pop Punk",
  },
  {
    id: 4,
    user: "@travel_soul",
    avatar: "✈️",
    title: "Санторини в золотой час — лучшее место на земле 🌅 #travel",
    thumbnail: "https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/6c597169-69f0-43a7-9fda-e4e7836d1850.jpg",
    likes: 312600,
    dislikes: 280,
    comments: 12400,
    shares: 56800,
    song: "Mediterranean Summer — Acoustic",
  },
  {
    id: 5,
    user: "@dj_vibes",
    avatar: "🎧",
    title: "Фестиваль электронной музыки — ты там был? 🎶 #music #rave",
    thumbnail: "https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/1f467918-516d-4954-b206-a7be2cdae1bf.jpg",
    likes: 189300,
    dislikes: 210,
    comments: 6700,
    shares: 24100,
    song: "Electric Feel — MGMT Remix",
  },
];

const NOTIFICATIONS = [
  { id: 1, type: "like", user: "@dance_king", text: "оценил ваше видео", time: "2м", avatar: "🕺", read: false },
  { id: 2, type: "follow", user: "@travel_soul", text: "подписался на вас", time: "15м", avatar: "✈️", read: false },
  { id: 3, type: "comment", user: "@foodie_life", text: 'прокомментировал: "🔥🔥🔥 супер!"', time: "1ч", avatar: "👩‍🍳", read: false },
  { id: 4, type: "like", user: "@skate_pro", text: "оценил ваш комментарий", time: "2ч", avatar: "🛹", read: true },
  { id: 5, type: "mention", user: "@dj_vibes", text: "упомянул вас в видео", time: "3ч", avatar: "🎧", read: true },
  { id: 6, type: "like", user: "@city_nights", text: "оценил ваше видео", time: "5ч", avatar: "🌆", read: true },
  { id: 7, type: "follow", user: "@art_world", text: "подписался на вас", time: "8ч", avatar: "🎨", read: true },
];

const TRENDING = ["#dance", "#food", "#travel", "#music", "#sports", "#comedy", "#fashion", "#tech", "#art", "#gaming"];

const SEARCH_RESULTS = [
  { id: 1, user: "@dance_king", title: "Лучший уличный танец 2024", views: "2.1М", thumbnail: "https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/6e714e5c-5c44-4506-8993-bb7443677f2e.jpg" },
  { id: 2, user: "@travel_soul", title: "Топ-10 мест для путешествий", views: "5.8М", thumbnail: "https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/6c597169-69f0-43a7-9fda-e4e7836d1850.jpg" },
  { id: 3, user: "@dj_vibes", title: "Лучший фестиваль лета", views: "3.4М", thumbnail: "https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/1f467918-516d-4954-b206-a7be2cdae1bf.jpg" },
  { id: 4, user: "@foodie_life", title: "Рецепты за 5 минут", views: "1.2М", thumbnail: "https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/470facc7-0cfb-4b56-8363-6a2eb0780efe.jpg" },
];

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "М";
  if (n >= 1000) return (n / 1000).toFixed(1) + "К";
  return String(n);
}

type Tab = "feed" | "search" | "profile" | "notifications";

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [dislikes, setDislikes] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(VIDEOS.map((v) => [v.id, v.likes]))
  );
  const [dislikeCounts, setDislikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(VIDEOS.map((v) => [v.id, v.dislikes]))
  );
  const [likeAnim, setLikeAnim] = useState<Record<number, boolean>>({});
  const [hearts, setHearts] = useState<{ x: number; y: number; id: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const heartIdRef = useRef(0);
  const feedScrollRef = useRef<HTMLDivElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [feedTab, setFeedTab] = useState<"foryou" | "following">("foryou");

  const scrollToVideo = useCallback((index: number) => {
    const el = feedScrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(VIDEOS.length - 1, index));
    setCurrentVideoIndex(clamped);
    el.scrollTo({ top: clamped * el.clientHeight, behavior: "smooth" });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLike = useCallback((videoId: number, e: React.MouseEvent) => {
    const wasLiked = likes[videoId];
    const wasDisliked = dislikes[videoId];

    setLikes((prev) => ({ ...prev, [videoId]: !wasLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [videoId]: prev[videoId] + (wasLiked ? -1 : 1),
    }));

    if (wasDisliked) {
      setDislikes((prev) => ({ ...prev, [videoId]: false }));
      setDislikeCounts((prev) => ({ ...prev, [videoId]: prev[videoId] - 1 }));
    }

    if (!wasLiked) {
      setLikeAnim((prev) => ({ ...prev, [videoId]: true }));
      setTimeout(() => setLikeAnim((prev) => ({ ...prev, [videoId]: false })), 400);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const id = ++heartIdRef.current;
      setHearts((prev) => [...prev, { x: rect.left + rect.width / 2, y: rect.top, id }]);
      setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 1000);
    }
  }, [likes, dislikes]);

  const handleDislike = useCallback((videoId: number) => {
    const wasDisliked = dislikes[videoId];
    const wasLiked = likes[videoId];
    setDislikes((prev) => ({ ...prev, [videoId]: !wasDisliked }));
    setDislikeCounts((prev) => ({
      ...prev,
      [videoId]: prev[videoId] + (wasDisliked ? -1 : 1),
    }));
    if (wasLiked) {
      setLikes((prev) => ({ ...prev, [videoId]: false }));
      setLikeCounts((prev) => ({ ...prev, [videoId]: prev[videoId] - 1 }));
    }
  }, [likes, dislikes]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-nunito text-white overflow-hidden">
      {/* Floating hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="float-heart fixed text-3xl z-50 select-none pointer-events-none"
          style={{ left: h.x - 20, top: h.y - 20 }}
        >
          ❤️
        </div>
      ))}

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #b44dff 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #ff2d78 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-rubik font-black tracking-tight gradient-text">VibeFlow</span>
          {activeTab === "feed" && (
            <div className="flex gap-1 glass rounded-full p-1">
              <button
                onClick={() => setFeedTab("foryou")}
                className="px-3 py-1 text-xs font-bold rounded-full transition-all duration-300"
                style={feedTab === "foryou"
                  ? { background: "linear-gradient(135deg, #ff2d78, #b44dff)", color: "white" }
                  : { color: "rgba(255,255,255,0.4)" }}
              >
                Для тебя
              </button>
              <button
                onClick={() => setFeedTab("following")}
                className="px-3 py-1 text-xs font-bold rounded-full transition-all duration-300"
                style={feedTab === "following"
                  ? { background: "linear-gradient(135deg, #b44dff, #00e5ff)", color: "white" }
                  : { color: "rgba(255,255,255,0.4)" }}
              >
                Подписки
              </button>
            </div>
          )}
          {activeTab !== "feed" && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center glass cursor-pointer hover:scale-110 transition-transform">
              <Icon name="Settings" size={15} className="text-white/60" />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className={`max-w-md mx-auto relative z-10 ${activeTab !== "feed" ? "pt-16 pb-20" : ""}`}>

        {/* ---- FEED ---- */}
        {activeTab === "feed" && (
          <div className="relative">
          {/* Up button */}
          <button
            onClick={() => scrollToVideo(currentVideoIndex - 1)}
            disabled={currentVideoIndex === 0}
            className="fixed left-1/2 -translate-x-1/2 z-30 flex items-center justify-center transition-all duration-300"
            style={{
              top: "68px",
              width: "44px", height: "44px",
              borderRadius: "50%",
              background: currentVideoIndex === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              opacity: currentVideoIndex === 0 ? 0.3 : 1,
            }}
          >
            <Icon name="ChevronUp" size={22} className="text-white" />
          </button>

          {/* Down button */}
          <button
            onClick={() => scrollToVideo(currentVideoIndex + 1)}
            disabled={currentVideoIndex === VIDEOS.length - 1}
            className="fixed left-1/2 -translate-x-1/2 z-30 flex items-center justify-center transition-all duration-300"
            style={{
              bottom: "84px",
              width: "44px", height: "44px",
              borderRadius: "50%",
              background: currentVideoIndex === VIDEOS.length - 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              opacity: currentVideoIndex === VIDEOS.length - 1 ? 0.3 : 1,
            }}
          >
            <Icon name="ChevronDown" size={22} className="text-white" />
          </button>

          <div
            ref={feedScrollRef}
            className="scrollbar-hide"
            style={{ overflowY: "scroll", height: "calc(100vh - 112px)", scrollSnapType: "y mandatory" }}
            onScroll={(e) => {
              const el = e.currentTarget;
              const idx = Math.round(el.scrollTop / el.clientHeight);
              setCurrentVideoIndex(idx);
            }}
          >
            {VIDEOS.map((video, i) => (
              <div
                key={video.id}
                className="relative w-full flex-shrink-0"
                style={{ height: "calc(100vh - 112px)", scrollSnapAlign: "start" }}
              >
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center"
                    style={{ border: "2px solid rgba(255,255,255,0.3)" }}>
                    <Icon name="Play" size={24} className="text-white ml-1" />
                  </div>
                </div>

                {/* Right actions */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
                  {/* Like */}
                  <button
                    onClick={(e) => handleLike(video.id, e)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={`w-12 h-12 rounded-full glass flex items-center justify-center transition-all duration-200 ${likeAnim[video.id] ? "like-burst" : ""} hover:scale-110`}
                      style={likes[video.id]
                        ? { background: "rgba(255,45,120,0.3)", border: "1.5px solid #ff2d78", boxShadow: "0 0 20px rgba(255,45,120,0.6)" }
                        : {}}
                    >
                      <Icon name="Heart" size={22} className={likes[video.id] ? "text-[#ff2d78]" : "text-white"} />
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow">{formatCount(likeCounts[video.id])}</span>
                  </button>

                  {/* Dislike */}
                  <button
                    onClick={() => handleDislike(video.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-12 h-12 rounded-full glass flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={dislikes[video.id]
                        ? { background: "rgba(0,229,255,0.2)", border: "1.5px solid #00e5ff", boxShadow: "0 0 20px rgba(0,229,255,0.5)" }
                        : {}}
                    >
                      <Icon name="ThumbsDown" size={20} className={dislikes[video.id] ? "text-[#00e5ff]" : "text-white"} />
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow">{formatCount(dislikeCounts[video.id])}</span>
                  </button>

                  {/* Comment */}
                  <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                      <Icon name="MessageCircle" size={22} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow">{formatCount(video.comments)}</span>
                  </button>

                  {/* Share */}
                  <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                      <Icon name="Share2" size={20} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow">{formatCount(video.shares)}</span>
                  </button>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-16 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #ff2d78, #b44dff)" }}>
                      {video.avatar}
                    </div>
                    <span className="font-bold text-sm text-white">{video.user}</span>
                    <button className="ml-1 px-3 py-1 rounded-full text-xs font-bold border border-white/40 text-white hover:bg-white/10 transition-colors flex-shrink-0">
                      + Подписаться
                    </button>
                  </div>
                  <p className="text-sm text-white/90 font-semibold leading-snug mb-2 line-clamp-2">{video.title}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #ff2d78, #b44dff)" }}>
                      <Icon name="Music" size={10} className="text-white" />
                    </div>
                    <span className="text-xs text-white/60 font-medium truncate">{video.song}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}

        {/* ---- SEARCH ---- */}
        {activeTab === "search" && (
          <div className="px-4 py-4 animate-fade-in">
            <div className="relative mb-5">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="Search" size={18} className="text-white/40" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск видео, авторов, тегов..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-semibold text-white placeholder-white/30 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Тренды</h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105"
                    style={activeTag === tag
                      ? { background: "linear-gradient(135deg, #ff2d78, #b44dff)", color: "white" }
                      : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Популярное</h3>
              <div className="grid grid-cols-2 gap-3">
                {SEARCH_RESULTS.map((item, i) => (
                  <div
                    key={item.id}
                    className="rounded-2xl overflow-hidden cursor-pointer group"
                    style={{ animation: `scale-in 0.3s ease-out ${i * 0.07}s both` }}
                  >
                    <div className="relative" style={{ aspectRatio: "9/14" }}>
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-xs font-bold text-white leading-tight line-clamp-2">{item.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon name="Eye" size={10} className="text-white/50" />
                          <span className="text-[10px] text-white/50">{item.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---- NOTIFICATIONS ---- */}
        {activeTab === "notifications" && (
          <div className="px-4 py-4 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-rubik font-bold text-white">Уведомления</h2>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                  style={{ background: "rgba(180,77,255,0.15)", color: "#b44dff", border: "1px solid rgba(180,77,255,0.3)" }}
                >
                  Всё прочитано
                </button>
              )}
            </div>
            <div className="space-y-2">
              {notifications.map((notif, i) => (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                  style={{
                    background: notif.read ? "rgba(255,255,255,0.03)" : "rgba(255,45,120,0.07)",
                    border: notif.read ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,45,120,0.15)",
                    animation: `slide-in-right 0.3s ease-out ${i * 0.05}s both`,
                  }}
                  onClick={() => setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n))}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                      style={{ background: "linear-gradient(135deg, #1a1a2e, #252540)" }}>
                      {notif.avatar}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px]"
                      style={{
                        background: notif.type === "like"
                          ? "linear-gradient(135deg, #ff2d78, #b44dff)"
                          : notif.type === "follow"
                          ? "linear-gradient(135deg, #b44dff, #00e5ff)"
                          : notif.type === "comment"
                          ? "linear-gradient(135deg, #00e5ff, #b44dff)"
                          : "linear-gradient(135deg, #ff2d78, #ff8c42)"
                      }}>
                      {notif.type === "like" ? "❤️" : notif.type === "follow" ? "➕" : notif.type === "comment" ? "💬" : "@"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold gradient-text">{notif.user}</p>
                    <p className="text-xs text-white/50 truncate">{notif.text}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] text-white/30 font-medium">{notif.time}</span>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full badge-pulse" style={{ background: "#ff2d78" }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- PROFILE ---- */}
        {activeTab === "profile" && (
          <div className="animate-fade-in">
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://cdn.poehali.dev/projects/f3cb3d48-bf1d-4fc3-9197-dd6e6bdc89ee/files/1f467918-516d-4954-b206-a7be2cdae1bf.jpg"
                className="w-full h-full object-cover"
                alt="cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,15,0.2), rgba(10,10,15,0.95))" }} />
            </div>

            <div className="px-4 -mt-14 relative">
              <div className="relative inline-block mb-3">
                <div className="w-20 h-20 rounded-full p-0.5"
                  style={{ background: "linear-gradient(135deg, #ff2d78, #b44dff, #00e5ff)" }}>
                  <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center text-2xl">
                    🎬
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #ff2d78, #b44dff)" }}>
                  <Icon name="Plus" size={12} className="text-white" />
                </div>
              </div>

              <h2 className="text-xl font-rubik font-bold text-white mb-0.5">@my_vibeflow</h2>
              <p className="text-sm text-white/40 mb-4">Создай своё первое видео ✨</p>

              <div className="flex gap-8 mb-5">
                {[
                  { label: "Видео", value: "0" },
                  { label: "Подписчики", value: "0" },
                  { label: "Подписки", value: "0" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <span className="text-xl font-rubik font-bold gradient-text">{stat.value}</span>
                    <span className="text-xs text-white/40 font-semibold">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-8">
                <button className="flex-1 py-2.5 rounded-2xl font-bold text-sm text-white hover:opacity-90 active:scale-95 transition-all"
                  style={{ background: "linear-gradient(135deg, #ff2d78, #b44dff)" }}>
                  Редактировать профиль
                </button>
                <button className="w-12 h-10 rounded-2xl font-bold text-sm flex items-center justify-center hover:scale-105 transition-transform"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon name="Share2" size={16} className="text-white" />
                </button>
              </div>

              <div className="text-center py-14">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Icon name="Video" size={32} className="text-white/20" />
                </div>
                <p className="text-white/30 font-bold mb-1">Нет видео</p>
                <p className="text-white/20 text-sm mb-4">Загрузи своё первое видео!</p>
                <button className="px-6 py-2.5 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ff2d78, #b44dff)" }}>
                  + Загрузить видео
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/5">
        <div className="max-w-md mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            {([
              { id: "feed", icon: "Home", label: "Лента" },
              { id: "search", icon: "Search", label: "Поиск" },
              { id: "notifications", icon: "Bell", label: "Уведомл.", badge: unreadCount },
              { id: "profile", icon: "User", label: "Профиль" },
            ] as const).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`flex flex-col items-center gap-1 relative transition-all duration-300 ${
                  activeTab === item.id ? "nav-active scale-110" : "text-white/30 hover:text-white/60 hover:scale-105"
                }`}
              >
                <div className="relative">
                  <Icon name={item.icon} size={22} />
                  {"badge" in item && item.badge > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                      style={{ background: "linear-gradient(135deg, #ff2d78, #b44dff)" }}
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold">{item.label}</span>
                {activeTab === item.id && (
                  <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full glow-pulse"
                    style={{ background: "#ff2d78" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Video, Sparkles, Clock, BookOpen } from 'lucide-react';
import { YOUTUBE_LINKS } from '@/data/videoConfig';
import Sidebar from '@/components/Sidebar';

/**
 * Extracts YouTube video ID from various URL formats
 */
const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/**
 * Processes a YouTube URL/config and returns video data object
 */
const processVideoUrl = (item, index) => {
  const url = typeof item === 'string' ? item : item.url;
  const title = typeof item === 'string' ? `Lesson ${index + 1}` : (item.title || `Lesson ${index + 1}`);
  const description = typeof item === 'string' ? '' : (item.description || '');
  const category = item.category || 'English Course';
  const duration = item.duration || '';
  const level = item.level || 'All Levels';

  const videoId = extractVideoId(url);
  if (!videoId) return null;

  return {
    id: `video-${index}-${videoId}`,
    videoId,
    title,
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    url,
    description,
    category,
    duration,
    level,
  };
};

// Process all URLs from config
const processedVideos = YOUTUBE_LINKS
  .map((item, index) => processVideoUrl(item, index))
  .filter(Boolean);

const VideoCard = ({ video, onClick }) => {
  return (
    <div
      className="video-card cursor-pointer group overflow-hidden flex flex-col rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10"
      onClick={() => onClick(video)}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-xl bg-slate-900">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
          }}
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-semibold text-primary border border-primary/30">
            {video.category}
          </span>
        </div>

        {video.duration && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-medium text-white/90">
            <Clock size={11} />
            <span>{video.duration}</span>
          </div>
        )}

        <div className="video-thumbnail-overlay">
          <div className="video-play-btn">
            <Play className="w-6 h-6 text-background ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1.5">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground/80 font-medium">
          <span className="flex items-center gap-1">
            <BookOpen size={12} className="text-primary/70" />
            {video.level}
          </span>
          <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
            Watch Lesson →
          </span>
        </div>
      </div>
    </div>
  );
};

const CinemaMode = ({ video, onClose }) => {
  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto animate-in slide-in-from-bottom-10 fade-in">
      <div className="min-h-screen p-4 sm:p-6 md:p-12 pb-32">
        {/* Cinema Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8 max-w-5xl mx-auto w-full">
          <button
            type="button"
            onClick={handleBackClick}
            className="btn-outline-purple flex items-center gap-2 text-sm md:text-base cursor-pointer !px-4 !py-2 !rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span>Back to Lessons</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-card/80 border border-border/50 hover:bg-muted/80 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
            >
              Watch on YouTube ↗
            </a>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              {video.category}
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-5xl">
            {/* Glow Effect */}
            <div className="absolute -inset-8 md:-inset-16 rounded-2xl bg-gradient-to-b from-primary/20 to-secondary/20 blur-3xl opacity-60 animate-pulse pointer-events-none" />

            {/* Video Frame */}
            <div className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden video-frame-glow shadow-2xl border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Video Information */}
          <div className="w-full max-w-5xl mt-6 md:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              {video.title}
            </h2>
            
            {video.description && (
              <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Lesson Overview & Objectives
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {video.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Communication = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseCinema = () => {
    setSelectedVideo(null);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Cinema Mode
  if (selectedVideo) {
    return <CinemaMode video={selectedVideo} onClose={handleCloseCinema} />;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <div className="relative flex-1 lg:ml-64 overflow-x-hidden bg-background">
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="glow-orb absolute top-0 left-1/4 w-96 h-96 bg-primary/15" />
          <div className="glow-orb absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/15" style={{ animationDelay: '1s' }} />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-background/50">
          <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="flex items-center justify-between">
              {/* Back Button + Logo / Title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToHome}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center hover:bg-muted/50 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Video className="w-5 h-5 md:w-6 md:h-6 text-background" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                      Communication & <span className="text-gradient-purple">English Hub</span>
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                      Master spoken English, fluency, job interview communication, and pronunciation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 md:py-10 relative z-10 max-w-7xl">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">
                English Speaking & Fluency Courses
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/20">
              {processedVideos.length} Courses
            </span>
          </div>

          {/* Video Grid */}
          {processedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {processedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={handleVideoClick}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card py-16 text-center">
              <Video className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No videos configured</h3>
              <p className="text-muted-foreground">Add YouTube URLs to src/data/videoConfig.js</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Communication;

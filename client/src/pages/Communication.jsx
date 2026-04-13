import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Video, Sparkles } from 'lucide-react';
import { YOUTUBE_LINKS } from '@/data/videoConfig';

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
 * Supports both string URLs and { url, description } objects
 */
const processVideoUrl = (item, index) => {
  // Handle both string and object formats
  const url = typeof item === 'string' ? item : item.url;
  const description = typeof item === 'string' ? '' : (item.description || '');

  const videoId = extractVideoId(url);
  if (!videoId) return null;

  return {
    id: `video-${index}-${videoId}`,
    videoId,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    url,
    description,
  };
};

// Process all URLs from config
const processedVideos = YOUTUBE_LINKS
  .map((item, index) => processVideoUrl(item, index))
  .filter(Boolean);

const VideoCard = ({ video, onClick }) => {
  return (
    <div
      className="video-card cursor-pointer group overflow-hidden"
      onClick={() => onClick(video)}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <img
          src={video.thumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
          }}
        />
        <div className="video-thumbnail-overlay">
          <div className="video-play-btn">
            <Play className="w-7 h-7 text-background ml-1" fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-muted-foreground font-mono truncate">
          {video.videoId}
        </p>
        {video.description && (
          <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2">
            {video.description}
          </p>
        )}
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
      <div className="min-h-screen p-6 md:p-12 pb-32">
        {/* Cinema Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            type="button"
            onClick={handleBackClick}
            className="btn-outline-purple flex items-center gap-2 text-sm md:text-base cursor-pointer !px-4 !py-2 !rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Back to Library</span>
            <span className="sm:hidden">Back</span>
          </button>

          <p className="text-muted-foreground font-mono text-sm">
            {video.videoId}
          </p>

          <div className="w-20 md:w-32" />
        </div>

        {/* Video Container */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-6xl">
            {/* Glow Effect */}
            <div className="absolute -inset-8 md:-inset-16 rounded-2xl bg-gradient-to-b from-primary/20 to-secondary/20 blur-3xl opacity-60 animate-pulse pointer-events-none" />

            {/* Video Frame */}
            <div className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden video-frame-glow">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Video Description */}
          {video.description && (
            <div className="w-full max-w-4xl mt-8 md:mt-12">
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                About this video
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {video.description}
              </p>
            </div>
          )}
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
    <div className="min-h-screen">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="glow-orb absolute top-0 left-1/4 w-96 h-96 bg-primary/20" />
        <div className="glow-orb absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-background/50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            {/* Back Button + Logo / Title */}
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button
                onClick={handleBackToHome}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center hover:bg-muted/50 hover:border-primary/50 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Video className="w-5 h-5 md:w-6 md:h-6 text-background" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">
                    Video <span className="text-gradient-purple">Library</span>
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                    Communication Learning Hub
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Your Collection
          </h2>
          <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
            {processedVideos.length} videos
          </span>
        </div>

        {/* Video Grid */}
        {processedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
  );
};

export default Communication; 

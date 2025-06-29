import React from 'react';
import { X, Twitter, Facebook, Link2, Download } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  translatedText: string;
  originalText: string;
  style: string;
  rageLevel: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  translatedText,
  originalText,
  style,
  rageLevel
}) => {
  if (!isOpen) return null;

  const shareText = `Check out my rage translation! 🔥\n\nOriginal: "${originalText}"\n\nTranslated (${style}, Level ${rageLevel}): "${translatedText}"\n\nMade with Anger Translator`;
  const shareUrl = window.location.href;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadImage = () => {
    // Create a canvas to generate an image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Dark cyberpunk background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f1724');
    gradient.addColorStop(0.5, '#0a0f1b');
    gradient.addColorStop(1, '#030712');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title with glow effect
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 20;
    ctx.fillText('Anger Translator 🔥', canvas.width / 2, 80);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Original text
    ctx.fillStyle = '#9ca3af';
    ctx.font = '20px Arial';
    ctx.fillText('Original:', canvas.width / 2, 150);
    ctx.font = '18px Arial';
    ctx.fillStyle = '#d1d5db';
    const originalLines = wrapText(ctx, originalText, canvas.width - 100);
    originalLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 180 + (index * 25));
    });

    // Translated text with glow
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 20px Arial';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.fillText(`Translated (${style}, Level ${rageLevel}):`, canvas.width / 2, 300);
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#fca5a5';
    const translatedLines = wrapText(ctx, translatedText, canvas.width - 100);
    translatedLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 330 + (index * 25));
    });

    // Download
    const link = document.createElement('a');
    link.download = 'anger-translation.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="cyber-card rounded-2xl shadow-cyber max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Share Your Rage
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-500/20 rounded-full transition-colors text-gray-400 hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleTwitterShare}
            className="w-full flex items-center gap-3 p-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border border-blue-500/30 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Twitter size={20} />
            Share on Twitter
          </button>

          <button
            onClick={handleFacebookShare}
            className="w-full flex items-center gap-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border border-blue-600/30 hover:border-blue-600/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            <Facebook size={20} />
            Share on Facebook
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-4 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border border-gray-600/30 hover:border-gray-600/50 hover:shadow-[0_0_20px_rgba(75,85,99,0.3)]"
          >
            <Link2 size={20} />
            Copy Link
          </button>

          <button
            onClick={handleDownloadImage}
            className="w-full flex items-center gap-3 p-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border border-purple-600/30 hover:border-purple-600/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
          >
            <Download size={20} />
            Download as Image
          </button>
        </div>
      </div>
    </div>
  );
};
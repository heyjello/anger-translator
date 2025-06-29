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

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#ef4444');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Anger Translator 🔥', canvas.width / 2, 80);

    // Original text
    ctx.font = '20px Arial';
    ctx.fillText('Original:', canvas.width / 2, 150);
    ctx.font = '18px Arial';
    const originalLines = wrapText(ctx, originalText, canvas.width - 100);
    originalLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 180 + (index * 25));
    });

    // Translated text
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Translated (${style}, Level ${rageLevel}):`, canvas.width / 2, 300);
    ctx.font = 'bold 18px Arial';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Share Your Rage
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleTwitterShare}
            className="w-full flex items-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            <Twitter size={20} />
            Share on Twitter
          </button>

          <button
            onClick={handleFacebookShare}
            className="w-full flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            <Facebook size={20} />
            Share on Facebook
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            <Link2 size={20} />
            Copy Link
          </button>

          <button
            onClick={handleDownloadImage}
            className="w-full flex items-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            <Download size={20} />
            Download as Image
          </button>
        </div>
      </div>
    </div>
  );
};
/**
 * EnhancedFooter Component
 * 
 * Branded footer with social links and enhanced styling
 */

import React from 'react';
import { Github, Twitter, Heart, Zap } from 'lucide-react';

export const EnhancedFooter: React.FC = () => {
  return (
    <footer className="text-center mt-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Main footer content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-6">
          <div className="flex flex-col items-center gap-6">
            
            {/* Built with Bolt badge */}
            <div className="flex items-center gap-3 text-white">
              <span className="text-lg font-medium">Built with</span>
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full shadow-lg animate-pulse-glow">
                <Zap size={20} className="text-white animate-bounce" />
                <span className="font-black text-white text-xl">Bolt</span>
                <Zap size={20} className="text-white animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>

            {/* Tagline */}
            <p className="text-white/80 text-lg font-medium max-w-md">
              Transform your politeness into comedic rage with AI-powered translation magic
            </p>

            {/* Social links placeholders */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                aria-label="Follow on Twitter"
              >
                <Twitter size={18} className="text-white group-hover:text-blue-300 transition-colors" />
                <span className="text-white text-sm font-medium">Twitter</span>
              </a>
              
              <a
                href="#"
                className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                aria-label="View on GitHub"
              >
                <Github size={18} className="text-white group-hover:text-gray-300 transition-colors" />
                <span className="text-white text-sm font-medium">GitHub</span>
              </a>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-red-400 animate-pulse" />
              <span>for frustrated humans everywhere</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-white/50 text-sm">
          © 2025 Anger Translator. All rights reserved. • Powered by AI Magic ✨
        </div>
      </div>
    </footer>
  );
};
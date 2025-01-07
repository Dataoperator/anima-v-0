import React from 'react';
import { Link } from 'react-router-dom';
import { useAnima } from '@/contexts/anima-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Nexus() {
  const { hasAnima, animaId, isLoading } = useAnima();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-amber-400 font-serif flex items-center justify-center">
        <div className="animate-pulse">⚔️ Awakening Ancient Wisdom...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-amber-400 text-center mb-8">
          The Nexus
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {hasAnima ? (
            <Card className="p-6 bg-black/50 backdrop-blur border-amber-500/20">
              <h2 className="text-2xl font-serif text-amber-400 mb-4">
                Your Anima
              </h2>
              <p className="text-amber-200 mb-6">
                Return to your awakened Anima and continue your journey.
              </p>
              <Link to={`/anima/${animaId}`}>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600">
                  Enter the Sanctum
                </Button>
              </Link>
            </Card>
          ) : (
            <Card className="p-6 bg-black/50 backdrop-blur border-amber-500/20">
              <h2 className="text-2xl font-serif text-amber-400 mb-4">
                Initiate Genesis
              </h2>
              <p className="text-amber-200 mb-6">
                Begin your journey by awakening your own Anima.
              </p>
              <Link to="/genesis">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600">
                  Begin Genesis
                </Button>
              </Link>
            </Card>
          )}

          <Card className="p-6 bg-black/50 backdrop-blur border-amber-500/20">
            <h2 className="text-2xl font-serif text-amber-400 mb-4">
              Ancient Codex
            </h2>
            <p className="text-amber-200 mb-6">
              Explore the mystical knowledge of Anima development and growth.
            </p>
            <Link to="/codex">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600">
                Open Codex
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
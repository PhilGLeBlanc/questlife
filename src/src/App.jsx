import React, { useState, useEffect } from 'react';
import { Sword, Users, Book, Heart, Trophy, Target, Plus, Check, Sparkles, TrendingUp, Star, Zap } from 'lucide-react';

const QuestLife = () => {
  const [screen, setScreen] = useState('welcome');
  const [character, setCharacter] = useState(null);
  const [quests, setQuests] = useState([]);
  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalCompleted: 0,
    streak: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const charResult = await window.storage.get('questlife-character');
        const questsResult = await window.storage.get('questlife-quests');
        const statsResult = await window.storage.get('questlife-stats');
        
        if (charResult?.value) {
          setCharacter(JSON.parse(charResult.value));
          setScreen('dashboard');
        }
        if (questsResult?.value) {
          setQuests(JSON.parse(questsResult.value));
        }
        if (statsResult?.value) {
          setStats(JSON.parse(statsResult.value));
        }
      } catch (error) {
        console.log('No saved data found');
      }
    };
    loadData();
  }, []);

  const saveData = async (char, questList, statsList) => {
    try {
      if (char) await window.storage.set('questlife-character', JSON.stringify(char));
      if (questList) await window.storage.set('questlife-quests', JSON.stringify(questList));
      if (statsList) await window.storage.set('questlife-stats', JSON.stringify(statsList));
    } catch (error) {
      console.error('Save error:', error);
    }
  };const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <Sparkles className="w-20 h-20 mx-auto mb-4 text-purple-400" />
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
            QuestLife
          </h1>
          <p className="text-2xl text-purple-300 mb-2">Level Up Your Real Life</p>
          <p className="text-lg text-slate-400">
            Transform daily tasks into epic quests. Gain XP, level up, and become the hero of your own story.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
            <h3 className="font-bold mb-2">Complete Quests</h3>
            <p className="text-sm text-slate-400">Turn real-life tasks into rewarding adventures</p>
          </div>
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6">
            <Star className="w-12 h-12 mx-auto mb-3 text-purple-400" />
            <h3 className="font-bold mb-2">Gain Experience</h3>
            <p className="text-sm text-slate-400">Level up as you accomplish your goals</p>
          </div>
          <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6">
            <Users className="w-12 h-12 mx-auto mb-3 text-blue-400" />
            <h3 className="font-bold mb-2">Build Relationships</h3>
            <p className="text-sm text-slate-400">Earn rewards for meaningful connections</p>
          </div>
        </div>
        <button
          onClick={() => setScreen('character')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg transition-all"
        >
          Begin Your Journey
        </button>
        <p className="mt-6 text-sm text-slate-500">Your data is saved locally</p>
      </div>
    </div>
  );

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen />}
      {screen === 'character' && <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 flex items-center justify-center"><div className="text-center"><h2 className="text-4xl font-bold mb-4">Character Creation Coming Soon!</h2><p className="text-slate-400 mb-6">Feature in development</p><button onClick={() => setScreen('welcome')} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg">Back to Home</button></div></div>}
      {screen === 'dashboard' && <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 flex items-center justify-center"><div className="text-center"><h2 className="text-4xl font-bold mb-4">Dashboard Coming Soon!</h2><p className="text-slate-400 mb-6">Feature in development</p><button onClick={() => setScreen('welcome')} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg">Back to Home</button></div></div>}
    </>
  );
};

export default QuestLife;

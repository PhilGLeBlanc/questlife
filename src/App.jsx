import React, { useState, useEffect } from 'react';
import { Sword, Users, Book, Heart, Trophy, Target, Calendar, Plus, Check, X, Sparkles, TrendingUp, Star, Award, Zap } from 'lucide-react';

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
        console.log('No saved data found, starting fresh');
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
      console.error('Error saving data:', error);
    }
  };

  const CharacterCreation = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      name: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      personality: null,
      class: null,
      goals: []
    });

    const personalityQuestions = [
      {
        q: "After a long week, you prefer to:",
        options: [
          { text: "Go out with friends and socialize", type: "extrovert", points: 2 },
          { text: "Relax at home with a book or movie", type: "introvert", points: 2 },
          { text: "Maybe see one close friend", type: "ambivert", points: 1 }
        ]
      },
      {
        q: "At a party, you typically:",
        options: [
          { text: "Mingle with everyone", type: "extrovert", points: 2 },
          { text: "Stick with people you know", type: "introvert", points: 2 },
          { text: "Mix of both", type: "ambivert", points: 1 }
        ]
      },
      {
        q: "You gain energy from:",
        options: [
          { text: "Being around others", type: "extrovert", points: 2 },
          { text: "Time alone", type: "introvert", points: 2 },
          { text: "Depends on my mood", type: "ambivert", points: 1 }
        ]
      }
    ];

    const [answers, setAnswers] = useState([]);

    const calculatePersonality = () => {
      const scores = { extrovert: 0, introvert: 0, ambivert: 0 };
      answers.forEach(answer => {
        scores[answer.type] += answer.points;
      });
      
      if (scores.ambivert >= 2) return 'ambivert';
      return scores.extrovert > scores.introvert ? 'extrovert' : 'introvert';
    };

    const classes = [
      {
        id: 'warrior',
        name: 'The Warrior',
        icon: Sword,
        desc: 'Action-oriented achiever',
        personality: 'extrovert',
        color: 'red',
        strengths: 'Physical quests, social challenges, leadership'
      },
      {
        id: 'mage',
        name: 'The Mage',
        icon: Book,
        desc: 'Knowledge seeker',
        personality: 'introvert',
        color: 'purple',
        strengths: 'Learning, creativity, deep focus'
      },
      {
        id: 'ranger',
        name: 'The Ranger',
        icon: Target,
        desc: 'Balanced explorer',
        personality: 'ambivert',
        color: 'green',
        strengths: 'Versatile, adaptable, balanced life'
      },
      {
        id: 'paladin',
        name: 'The Paladin',
        icon: Heart,
        desc: 'Community builder',
        personality: 'extrovert',
        color: 'yellow',
        strengths: 'Relationships, service, helping others'
      }
    ];

    const goals = [
      { id: 'fitness', label: 'Improve Fitness', icon: TrendingUp },
      { id: 'social', label: 'Build Relationships', icon: Users },
      { id: 'career', label: 'Advance Career', icon: Trophy },
      { id: 'learning', label: 'Learn New Skills', icon: Book },
      { id: 'creativity', label: 'Creative Projects', icon: Sparkles },
      { id: 'wellness', label: 'Mental Wellness', icon: Heart }
    ];

    const handleComplete = () => {
      const personality = calculatePersonality();
      const recommendedClasses = classes.filter(c => 
        c.personality === personality || c.id === 'ranger'
      );
      
      const finalChar = {
        ...formData,
        personality,
        createdAt: new Date().toISOString()
      };
      
      setCharacter(finalChar);
      generateInitialQuests(finalChar);
      saveData(finalChar, null, stats);
      setScreen('dashboard');
    };

    const generateInitialQuests = (char) => {
      const baseQuests = [
        {
          id: '1',
          title: 'Have a meaningful conversation',
          description: 'Talk with someone for at least 15 minutes',
          category: 'social',
          difficulty: 'easy',
          xp: 20,
          completed: false
        },
        {
          id: '2',
          title: 'Complete a workout',
          description: '30 minutes of physical activity',
          category: 'fitness',
          difficulty: 'medium',
          xp: 30,
          completed: false
        },
        {
          id: '3',
          title: 'Learn something new',
          description: 'Spend 20 minutes learning a new skill',
          category: 'learning',
          difficulty: 'easy',
          xp: 20,
          completed: false
        },
        {
          id: '4',
          title: 'Help someone today',
          description: 'Do something kind for another person',
          category: 'social',
          difficulty: 'easy',
          xp: 25,
          completed: false
        },
        {
          id: '5',
          title: 'Work on a personal project',
          description: 'Make progress on something important to you',
          category: 'creativity',
          difficulty: 'medium',
          xp: 35,
          completed: false
        }
      ];

      const filtered = baseQuests.filter(q => 
        char.goals.includes(q.category)
      );
      
      const finalQuests = filtered.length > 0 ? filtered : baseQuests.slice(0, 3);
      setQuests(finalQuests);
      saveData(null, finalQuests, null);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between mb-2 text-sm text-purple-300">
              <span>Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Create Your Character
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Character Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="170"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="70"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => formData.name && setStep(2)}
                disabled={!formData.name}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Personality Assessment
              </h2>
              
              {answers.length < personalityQuestions.length ? (
                <div>
                  <p className="text-lg mb-6">{personalityQuestions[answers.length].q}</p>
                  <div className="space-y-3">
                    {personalityQuestions[answers.length].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAnswers([...answers, option])}
                        className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-purple-500 text-left p-4 rounded-lg transition-all"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-2xl font-bold mb-4">Assessment Complete!</h3>
                  <p className="text-lg text-purple-300 mb-6">
                    You're an <span className="font-bold text-white">{calculatePersonality()}</span>
                  </p>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg"
                  >
                    Choose Your Class
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Choose Your Class
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((cls) => {
                  const Icon = cls.icon;
                  const isRecommended = cls.personality === calculatePersonality() || cls.id === 'ranger';
                  
                  return (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setFormData({...formData, class: cls.id});
                        setStep(4);
                      }}
                      className={`relative bg-slate-700 hover:bg-slate-600 border-2 ${
                        isRecommended ? 'border-yellow-500' : 'border-slate-600'
                      } p-6 rounded-lg text-left transition-all hover:scale-105`}
                    >
                      {isRecommended && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                          RECOMMENDED
                        </div>
                      )}
                      <Icon className={`w-12 h-12 mb-3 text-${cls.color}-400`} />
                      <h3 className="text-xl font-bold mb-2">{cls.name}</h3>
                      <p className="text-sm text-slate-400 mb-2">{cls.desc}</p>
                      <p className="text-xs text-purple-300">{cls.strengths}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Select Your Goals
              </h2>
              <p className="text-slate-400 mb-6">Choose at least 2 focus areas</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  const selected = formData.goals.includes(goal.id);
                  
                  return (
                    <button
                      key={goal.id}
                      onClick={() => {
                        const newGoals = selected
                          ? formData.goals.filter(g => g !== goal.id)
                          : [...formData.goals, goal.id];
                        setFormData({...formData, goals: newGoals});
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selected
                          ? 'bg-purple-600 border-purple-400'
                          : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{goal.label}</p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleComplete}
                disabled={formData.goals.length < 2}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Begin Your Journey
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const [showAddQuest, setShowAddQuest] = useState(false);
    const [newQuest, setNewQuest] = useState({
      title: '',
      description: '',
      category: 'social',
      difficulty: 'easy'
    });

    const completeQuest = (questId) => {
      const quest = quests.find(q => q.id === questId);
      if (!quest || quest.completed) return;

      const updatedQuests = quests.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      );

      const newXp = stats.xp + quest.xp;
      const newLevel = Math.floor(newXp / 100) + 1;
      const newStats = {
        ...stats,
        xp: newXp,
        level: newLevel,
        xpToNext: newLevel * 100,
        totalCompleted: stats.totalCompleted + 1,
        streak: stats.streak + 1
      };

      setQuests(updatedQuests);
      setStats(newStats);
      saveData(null, updatedQuests, newStats);
    };

    const addCustomQuest = () => {
      const xpValues = { easy: 20, medium: 30, hard: 50 };
      const quest = {
        id: Date.now().toString(),
        ...newQuest,
        xp: xpValues[newQuest.difficulty],
        completed: false
      };

      const updatedQuests = [...quests, quest];
      setQuests(updatedQuests);
      saveData(null, updatedQuests, null);
      setShowAddQuest(false);
      setNewQuest({ title: '', description: '', category: 'social', difficulty: 'easy' });
    };

    const categories = {
      social: { icon: Users, color: 'blue' },
      fitness: { icon: TrendingUp, color: 'red' },
      learning: { icon: Book, color: 'purple' },
      creativity: { icon: Sparkles, color: 'pink' },
      wellness: { icon: Heart, color: 'green' },
      career: { icon: Trophy, color: 'yellow' }
    };

    const activeQuests = quests.filter(q => !q.completed);
    const completedQuests = quests.filter(q => q.completed);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {character?.name}
                </h1>
                <p className="text-slate-400">Level {stats.level} - {character?.class}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-5 h-5" />
                  <span className="text-2xl font-bold">{stats.level}</span>
                </div>
                <p className="text-sm text-slate-400">Level</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>XP</span>
                <span>{stats.xp % 100} / 100</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                  style={{ width: `${(stats.xp % 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-700 rounded-lg p-3">
                <Trophy className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                <p className="text-2xl font-bold">{stats.totalCompleted}</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <Zap className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                <p className="text-2xl font-bold">{stats.streak}</p>
                <p className="text-xs text-slate-400">Streak</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <Target className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                <p className="text-2xl font-bold">{activeQuests.length}</p>
                <p className="text-xs text-slate-400">Active</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Active Quests</h2>
              <button
                onClick={() => setShowAddQuest(true)}
                className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeQuests.map((quest) => {
                const CategoryIcon = categories[quest.category]?.icon || Target;
                const color = categories[quest.category]?.color || 'purple';
                
                return (
                  <div key={quest.id} className="bg-slate-800 rounded-lg p-4 shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CategoryIcon className={`w-5 h-5 text-${color}-400`} />
                          <span className={`text-xs px-2 py-1 bg-${color}-900 text-${color}-300 rounded`}>
                            {quest.difficulty}
                          </span>
                          <span className="text-xs text-yellow-400 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {quest.xp} XP
                          </span>
                        </div>
                        <h3 className="font-bold mb-1">{quest.title}</h3>
                        <p className="text-sm text-slate-400">{quest.description}</p>
                      </div>
                      <button
                        onClick={() => completeQuest(quest.id)}
                        className="ml-4 bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-all"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {activeQuests.length === 0 && (
                <div className="bg-slate-800 rounded-lg p-8 text-center">
                  <Target className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400">No active quests. Add one to get started!</p>
                </div>
              )}
            </div>
          </div>

          {completedQuests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Completed</h2>
              <div className="space-y-2">
                {completedQuests.slice(-5).reverse().map((quest) => (
                  <div key={quest.id} className="bg-slate-800 bg-opacity-50 rounded-lg p-3 opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="font-medium">{quest.title}</span>
                      </div>
                      <span className="text-sm text-yellow-400">+{quest.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showAddQuest && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4">Create New Quest</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quest Title</label>
                    <input
                      type="text"
                      value={newQuest.title}
                      onChange={(e) => setNewQuest({...newQuest, title: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      placeholder="What do you want to accomplish?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newQuest.description}
                      onChange={(e) => setNewQuest({...newQuest, description: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      rows="3"
                      placeholder="Add details..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={newQuest.category}
                      onChange={(e) => setNewQuest({...newQuest, category: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                    >
                      <option value="social">Social</option>
                      <option value="fitness">Fitness</option>
                      <option value="learning">Learning</option>
                      <option value="creativity">Creativity</option>
                      <option value="wellness">Wellness</option>
                      <option value="career">Career</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={newQuest.difficulty}
                      onChange={(e) => setNewQuest({...newQuest, difficulty: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                    >
                      <option value="easy">Easy (20 XP)</option>
                      <option value="medium">Medium (30 XP)</option>
                      <option value="hard">Hard (50 XP)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddQuest(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCustomQuest}
                    disabled={!newQuest.title}
                    className="flex-1
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    Create Quest
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <Sparkles className="w-20 h-20 mx-auto mb-4 text-purple-400 animate-pulse" />
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
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          Begin Your Journey
        </button>

        <p className="mt-6 text-sm text-slate-500">
          Your data is saved locally on your device
        </p>
      </div>
    </div>
  );

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen />}
      {screen === 'character' && <CharacterCreation />}
      {screen === 'dashboard' && <Dashboard />}
    </>
  );
};

export default QuestLife;

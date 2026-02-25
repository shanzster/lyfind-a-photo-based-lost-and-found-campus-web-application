import { useState, useEffect } from 'react';
import { Sparkles, Activity, TrendingUp, Eye, Settings, RefreshCw, CheckCircle, Image as ImageIcon, Zap, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Match {
  id: string;
  lostItemId: string;
  foundItemId: string;
  score: number;
  viewedByLost: boolean;
  viewedByFound: boolean;
  createdAt: any;
}

interface MatchStats {
  totalMatches: number;
  avgScore: number;
  highScoreMatches: number;
  viewedMatches: number;
  successfulMatches: number;
}

export default function AIMatching() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<MatchStats>({
    totalMatches: 0,
    avgScore: 0,
    highScoreMatches: 0,
    viewedMatches: 0,
    successfulMatches: 0
  });
  const [loading, setLoading] = useState(true);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    loadMatchData();
  }, []);

  const loadMatchData = async () => {
    setLoading(true);
    try {
      // Get recent matches
      const matchesQuery = query(
        collection(db, 'matches'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const matchesSnap = await getDocs(matchesQuery);
      const matchesData = matchesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Match[];

      setMatches(matchesData);

      // Calculate statistics
      if (matchesData.length > 0) {
        const totalScore = matchesData.reduce((sum, m) => sum + m.score, 0);
        const avgScore = totalScore / matchesData.length;
        const highScoreMatches = matchesData.filter(m => m.score >= 80).length;
        const viewedMatches = matchesData.filter(m => m.viewedByLost || m.viewedByFound).length;
        
        setStats({
          totalMatches: matchesData.length,
          avgScore: Math.round(avgScore * 100) / 100,
          highScoreMatches,
          viewedMatches,
          successfulMatches: viewedMatches // Approximate
        });
      }
    } catch (error) {
      console.error('Error loading match data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 80) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  };

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff7400]"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />
      
      <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12 bg-[#2f1632]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                AI Photo Matching
              </h1>
              <p className="text-white/60">Monitor AI matching performance and statistics</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowHowItWorks(true)}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-medium transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                How It Works
              </button>
              <button
                onClick={loadMatchData}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.totalMatches}</h3>
              <p className="text-sm text-white/60">Total Matches</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.avgScore}%</h3>
              <p className="text-sm text-white/60">Avg Match Score</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.highScoreMatches}</h3>
              <p className="text-sm text-white/60">High Score (80%+)</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.viewedMatches}</h3>
              <p className="text-sm text-white/60">Viewed by Users</p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Matching</h3>
                <p className="text-purple-200/80 text-sm mb-3">
                  LyFind uses TensorFlow.js and MobileNet to automatically match lost and found items based on visual similarity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-purple-300 font-medium mb-1">1. Feature Extraction</p>
                    <p className="text-white/60 text-xs">MobileNet extracts 1024 features from each photo</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-purple-300 font-medium mb-1">2. Similarity Comparison</p>
                    <p className="text-white/60 text-xs">Cosine similarity computed between feature vectors</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-purple-300 font-medium mb-1">3. Match Scoring</p>
                    <p className="text-white/60 text-xs">Scores 70%+ are considered potential matches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Matches */}
          {matches.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No AI Matches Yet</h2>
              <p className="text-white/60 mb-6">AI matching data will appear here once users start posting items with photos</p>
              <div className="max-w-2xl mx-auto text-left">
                <h3 className="text-white font-semibold mb-3">How AI Matching Works:</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>When a user posts an item with photos, AI extracts visual features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>System compares with opposite type items (lost vs found)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Matches with 70%+ similarity are automatically suggested</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Users receive notifications about potential matches</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Recent Matches</h3>
                <p className="text-white/60 text-sm">Latest AI-generated matches</p>
              </div>
              <div className="divide-y divide-white/10">
                {matches.map((match) => (
                  <div key={match.id} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getScoreColor(match.score)}`}>
                              {match.score}% Match
                            </span>
                            {(match.viewedByLost || match.viewedByFound) && (
                              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400">
                                Viewed
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 text-sm">
                            Lost Item: {match.lostItemId.substring(0, 8)}... ↔ Found Item: {match.foundItemId.substring(0, 8)}...
                          </p>
                          <p className="text-white/50 text-xs mt-1">
                            {match.createdAt?.toDate().toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/items/${match.lostItemId}`)}
                          className="px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium transition-all"
                        >
                          View Lost
                        </button>
                        <button
                          onClick={() => navigate(`/admin/items/${match.foundItemId}`)}
                          className="px-3 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-medium transition-all"
                        >
                          View Found
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-[#2f1632] border border-white/10 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">How AI Matching Works</h3>
              </div>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Technology Stack */}
              <div>
                <h4 className="text-white font-semibold mb-3">Technology Stack</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-purple-400 font-medium mb-1">TensorFlow.js</p>
                    <p className="text-white/60 text-sm">Machine learning framework</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-purple-400 font-medium mb-1">MobileNet</p>
                    <p className="text-white/60 text-sm">Pre-trained image model</p>
                  </div>
                </div>
              </div>

              {/* Process Steps */}
              <div>
                <h4 className="text-white font-semibold mb-3">Matching Process</h4>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Feature Extraction</p>
                      <p className="text-white/60 text-sm">MobileNet analyzes the image and extracts 1024 numerical features representing visual characteristics (colors, shapes, textures, objects).</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Candidate Selection</p>
                      <p className="text-white/60 text-sm">System fetches opposite type items (lost items match with found, found with lost) that are currently active.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Similarity Computation</p>
                      <p className="text-white/60 text-sm">Cosine similarity is calculated between feature vectors. This measures how similar two images are on a scale of 0-100%.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                      4
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Match Filtering</p>
                      <p className="text-white/60 text-sm">Only matches with 70% or higher similarity are stored and shown to users as potential matches.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                      5
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">User Notification</p>
                      <p className="text-white/60 text-sm">Users receive notifications about potential matches and can view them in their dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Interpretation */}
              <div>
                <h4 className="text-white font-semibold mb-3">Score Interpretation</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <span className="text-green-400 font-bold">90-100%</span>
                    <span className="text-white/70 text-sm">Excellent match - Very likely the same item</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <span className="text-blue-400 font-bold">80-89%</span>
                    <span className="text-white/70 text-sm">Good match - Strong similarity</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <span className="text-yellow-400 font-bold">70-79%</span>
                    <span className="text-white/70 text-sm">Possible match - Worth checking</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-500/10 border border-gray-500/20">
                    <span className="text-gray-400 font-bold">&lt;70%</span>
                    <span className="text-white/70 text-sm">Low similarity - Not shown to users</span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div>
                <h4 className="text-white font-semibold mb-3">Performance</h4>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Runs automatically in background after item is posted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Processing time: ~2-5 seconds per item</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Model loads once and stays in memory for fast processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Runs entirely in browser - no server costs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowItWorks(false)}
              className="w-full mt-6 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}

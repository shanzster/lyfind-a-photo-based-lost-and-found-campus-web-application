import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Image as ImageIcon, Loader2, CheckCircle, XCircle, Clock, Sparkles, TrendingUp } from 'lucide-react';
import LyceanSidebar from '@/components/lycean-sidebar';

interface QueueItem {
  id: string;
  imageUrl: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  uploadedAt: Date;
  results?: MatchResult[];
  error?: string;
  position?: number;
  progress?: number;
  currentStep?: string;
  analysisDetails?: AnalysisDetails;
}

interface AnalysisDetails {
  imageSize: string;
  detectedObjects: string[];
  dominantColors: string[];
  features: number;
  comparedItems: number;
  processingTime: number;
}

interface MatchResult {
  itemId: string;
  title: string;
  type: 'lost' | 'found';
  score: number;
  imageUrl: string;
  location: string;
  date: string;
  postedBy: string;
}

export default function PhotoMatchPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);

    // Simulate getting image dimensions
    const img = new Image();
    img.src = previewUrl;
    await new Promise(resolve => { img.onload = resolve; });
    const imageSize = `${img.width}x${img.height}`;

    const queueItem: QueueItem = {
      id: Date.now().toString(),
      imageUrl: previewUrl,
      status: 'queued',
      uploadedAt: new Date(),
      position: queue.filter(q => q.status === 'queued' || q.status === 'processing').length + 1,
      progress: 0,
      currentStep: 'Waiting in queue...',
    };

    setQueue([queueItem, ...queue]);
    setSelectedImage(null);
    setPreviewUrl('');
    setIsUploading(false);

    // Simulate queue wait time
    const queueDelay = queueItem.position! * 1000;
    
    setTimeout(() => {
      // Start processing
      setQueue(prev => prev.map(item => 
        item.id === queueItem.id 
          ? { ...item, status: 'processing', position: undefined, progress: 5, currentStep: 'Uploading image...' }
          : item
      ));

      // Simulate realistic processing steps
      const steps = [
        { progress: 15, step: 'Preparing image...', delay: 800 },
        { progress: 25, step: 'Loading visual analyzer...', delay: 600 },
        { progress: 35, step: 'Extracting visual features...', delay: 1200 },
        { progress: 50, step: 'Analyzing color patterns...', delay: 900 },
        { progress: 60, step: 'Detecting objects and shapes...', delay: 1000 },
        { progress: 70, step: 'Building visual signature...', delay: 800 },
        { progress: 80, step: 'Comparing with 247 items...', delay: 1500 },
        { progress: 90, step: 'Calculating similarity scores...', delay: 700 },
        { progress: 95, step: 'Ranking results...', delay: 500 },
      ];

      let currentDelay = 0;
      steps.forEach((stepData, index) => {
        currentDelay += stepData.delay;
        setTimeout(() => {
          setQueue(prev => prev.map(item => 
            item.id === queueItem.id 
              ? { ...item, progress: stepData.progress, currentStep: stepData.step }
              : item
          ));
        }, currentDelay);
      });

      // Complete processing
      setTimeout(() => {
        // Generate realistic analysis details
        const detectedObjects = ['backpack', 'fabric', 'zipper', 'straps'];
        const dominantColors = ['#2563eb', '#1e40af', '#1e3a8a'];
        const features = 512;
        const comparedItems = 247;
        const processingTime = (currentDelay + 500) / 1000;

        const mockResults: MatchResult[] = [
          {
            itemId: '1',
            title: 'Blue Backpack',
            type: 'found',
            score: 95,
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
            location: 'Library - 2nd Floor',
            date: '2024-02-15',
            postedBy: 'Alex Student',
          },
          {
            itemId: '2',
            title: 'Navy Blue Backpack',
            type: 'found',
            score: 87,
            imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=200&h=200&fit=crop',
            location: 'Cafeteria',
            date: '2024-02-14',
            postedBy: 'Jordan Lee',
          },
          {
            itemId: '3',
            title: 'Dark Blue Backpack',
            type: 'found',
            score: 78,
            imageUrl: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=200&h=200&fit=crop',
            location: 'Gym Locker Room',
            date: '2024-02-13',
            postedBy: 'Sam Chen',
          },
          {
            itemId: '4',
            title: 'Blue School Bag',
            type: 'found',
            score: 72,
            imageUrl: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=200&h=200&fit=crop',
            location: 'Student Center',
            date: '2024-02-12',
            postedBy: 'Taylor Kim',
          },
        ];

        setQueue(prev => prev.map(item => 
          item.id === queueItem.id 
            ? { 
                ...item, 
                status: 'completed', 
                results: mockResults, 
                progress: 100,
                currentStep: 'Analysis complete!',
                analysisDetails: {
                  imageSize,
                  detectedObjects,
                  dominantColors,
                  features,
                  comparedItems,
                  processingTime,
                }
              }
            : item
        ));
      }, currentDelay + 500);
    }, queueDelay);
  };

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'processing':
        return (
          <div className="w-5 h-5 animate-spin">
            <img 
              src="/Untitled design (3).png" 
              alt="Processing" 
              className="w-full h-full object-contain grayscale brightness-200"
            />
          </div>
        );
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getStatusText = (status: QueueItem['status'], position?: number) => {
    switch (status) {
      case 'queued':
        return `Queued - Position #${position}`;
      case 'processing':
        return 'Analyzing image...';
      case 'completed':
        return 'Analysis complete';
      case 'failed':
        return 'Analysis failed';
    }
  };

  const activeQueueCount = queue.filter(q => q.status === 'queued' || q.status === 'processing').length;

  return (
    <>
      <LyceanSidebar />
      
      <main className="min-h-screen pt-6 lg:pt-12 pb-24 lg:pb-12 px-4 lg:px-6 lg:pl-80 lg:pr-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-5xl font-medium text-white mb-3 lg:mb-4">Photo Matcher</h1>
            <p className="text-white/60 text-base lg:text-lg">Upload a photo to find similar items instantly</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Upload Photo</h2>
                <div className="px-3 py-1 rounded-full bg-[#ff7400]/20 text-[#ff7400] text-sm font-medium">
                  Step 1
                </div>
              </div>
              
              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 p-12 cursor-pointer hover:border-[#ff7400]/50 transition-all bg-white/5 hover:bg-white/10">
                  <div className="w-16 h-16 rounded-full bg-[#ff7400]/20 flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-[#ff7400]" />
                  </div>
                  <p className="font-semibold text-white mb-1">Click to upload</p>
                  <p className="text-sm text-white/60">PNG, JPG, WebP up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                    <button
                      onClick={() => { setPreviewUrl(''); setSelectedImage(null); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-[#ff7400] to-[#ff7400]/80 hover:shadow-lg hover:shadow-[#ff7400]/30 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Adding to Queue...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        Add to Queue
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-white/80 leading-relaxed">
                  <strong className="text-white">How it works:</strong> Upload a photo of your lost or found item, and we'll search through all posted items to find the best matches based on visual similarity. Results typically ready in under 10 seconds!
                </p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Processing Queue</h2>
                <div className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
                  {activeQueueCount} Active
                </div>
              </div>

              {queue.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white/40" />
                  </div>
                  <p className="text-white/60 mb-1">No items in queue</p>
                  <p className="text-sm text-white/40">Upload a photo to start matching</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {queue.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start gap-4">
                        <img src={item.imageUrl} alt="Queued" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(item.status)}
                            <span className="font-medium text-white text-sm">
                              {getStatusText(item.status, item.position)}
                            </span>
                          </div>
                          <p className="text-xs text-white/50">{new Date(item.uploadedAt).toLocaleString()}</p>
                          
                          {item.status === 'processing' && (
                            <div className="mt-3">
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#ff7400] to-[#ff7400]/60 transition-all duration-500 ease-out" style={{ width: `${item.progress || 0}%` }} />
                              </div>
                              <p className="text-xs text-white/50 mt-1.5 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-[#ff7400] rounded-full animate-pulse"></span>
                                {item.progress}% - {item.currentStep}
                              </p>
                            </div>
                          )}

                          {item.status === 'queued' && (
                            <div className="mt-2 text-xs text-yellow-400/80">
                              ⏱️ Estimated wait: ~{item.position! * 8}s
                            </div>
                          )}

                          {item.status === 'completed' && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                              <TrendingUp className="h-3 w-3" />
                              Found {item.results?.length || 0} matches
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {queue.some(q => q.status === 'completed' && q.results) && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Match Results</h2>
              </div>
              
              {queue.filter(q => q.status === 'completed' && q.results).map((item) => (
                <div key={item.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
                  {/* Analysis Header */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <img src={item.imageUrl} alt="Query" className="w-24 h-24 rounded-2xl object-cover border-2 border-[#ff7400]/30" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
                        Your Photo
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">✓ Analyzed</span>
                      </h3>
                      <p className="text-sm text-white/60 mb-2">
                        Found {item.results?.length || 0} similar items • Processed in {item.analysisDetails?.processingTime.toFixed(1)}s
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-lg bg-white/5 text-white/70">
                          📐 {item.analysisDetails?.imageSize}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-white/5 text-white/70">
                          🔍 {item.analysisDetails?.features} features
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-white/5 text-white/70">
                          📊 {item.analysisDetails?.comparedItems} items compared
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Details */}
                  {item.analysisDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
                      <div className="rounded-2xl bg-white/5 p-4">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs">🎨</span>
                          Detected Colors
                        </h4>
                        <div className="flex gap-2">
                          {item.analysisDetails.dominantColors.map((color, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div 
                                className="w-8 h-8 rounded-lg border border-white/20 shadow-lg" 
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-xs text-white/60">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-4">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-xs">🏷️</span>
                          Detected Objects
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.analysisDetails.detectedObjects.map((obj, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium">
                              {obj}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Match Results */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-1">Top Matches</h3>
                    <p className="text-sm text-white/60">Ranked by visual similarity score</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {item.results?.map((result, idx) => (
                      <Link key={result.itemId} to={`/item/${result.itemId}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-[#ff7400]/50 transition-all group relative">
                        {idx === 0 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow-lg z-10">
                            #1
                          </div>
                        )}
                        <div className="relative mb-3">
                          <img src={result.imageUrl} alt={result.title} className="w-full h-32 object-cover rounded-xl" />
                          <div className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg ${
                            result.score >= 90 ? 'bg-green-500' : result.score >= 75 ? 'bg-yellow-500' : 'bg-orange-500'
                          }`}>
                            {result.score}%
                          </div>
                          <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-lg ${result.type === 'lost' ? 'bg-red-500/80 text-white' : 'bg-green-500/80 text-white'}`}>
                            {result.type === 'lost' ? 'Lost' : 'Found'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-white mb-2 group-hover:text-[#ff7400] transition-colors line-clamp-1">{result.title}</h4>
                        <p className="text-sm text-white/60 mb-1 line-clamp-1">📍 {result.location}</p>
                        <p className="text-xs text-white/40">
                          By {result.postedBy} • {new Date(result.date).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

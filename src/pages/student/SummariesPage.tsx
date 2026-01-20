import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Download, Eye, BookOpen, Clock, Star, Video, ArrowLeft, Pause, Play, SkipForward, SkipBack, Volume2, Maximize, Heart, Share2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SUBJECTS_BY_LEVEL } from '../../types/education';

interface Summary {
  id: string;
  title: string;
  subject: string;
  subjectId: string;
  description: string;
  pages: number;
  downloadCount: number;
  rating: string;
  createdAt: Date;
  type: string;
}

const SummaryViewer: React.FC<{ summary: Summary; onBack: () => void }> = ({ summary, onBack }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'document'>('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(1200); // 20 minutes
  const [isSaved, setIsSaved] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-3 lg:p-0">
      <button
        onClick={onBack}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-4 lg:mb-6 p-2 lg:p-0"
      >
        <ArrowLeft className="h-5 w-5 ml-1" />
        العودة إلى الملخصات
      </button>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6 lg:mb-8 -mx-3 px-3 lg:mx-0 lg:px-0">
        <div className="flex space-x-6 space-x-reverse min-w-max">
          {[
            { id: 'video', label: 'فيديو الملخص', icon: Video },
            { id: 'document', label: 'وثيقة الملخص', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-3 lg:py-4 border-b-2 font-medium text-sm lg:text-base whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary-600 hover:border-primary-300'
              }`}
            >
              <tab.icon className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'video' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 lg:w-20 lg:h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 hover:bg-opacity-30 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    ) : (
                      <Play className="w-8 h-8 lg:w-10 lg:h-10 text-white mr-1" />
                    )}
                  </motion.button>
                  <p className="text-white text-base lg:text-lg font-medium">{summary.title}</p>
                  <p className="text-gray-300 mt-2 text-sm lg:text-base">
                    {isPlaying ? 'جاري التشغيل...' : 'انقر للتشغيل'}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button className="text-white hover:text-gray-300">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-gray-300">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button className="text-white hover:text-gray-300">
                    <SkipForward className="w-5 h-5" />
                  </button>

                  <div className="flex-1 mx-4">
                    <div className="bg-gray-600 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-300"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <button className="text-white hover:text-gray-300">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button className="text-white hover:text-gray-300">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-luxury border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {summary.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {summary.description}
                  </p>

                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 ml-1" />
                      <span>{summary.pages} صفحة</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 ml-1 text-yellow-500" />
                      <span>{summary.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <motion.button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-2 rounded-xl transition-colors ${
                      isSaved
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </motion.button>

                  <motion.button
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'document' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-luxury border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">وثيقة الملخص</h3>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {summary.description}. هذا الملخص يحتوي على أهم النقاط والمفاهيم الأساسية للموضوع مع أمثلة توضيحية وشروحات مفصلة لمساعدتك على الفهم الأعمق والمراجعة السريعة.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const SummariesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Get subjects based on user's education level
  const getSubjectsForUser = () => {
    if (!user) return [];

    const { level, year, stream } = user.education;

    if (level === 'primary' || level === 'middle') {
      return SUBJECTS_BY_LEVEL[level][year as keyof typeof SUBJECTS_BY_LEVEL[typeof level]] || [];
    } else if (level === 'secondary') {
      const streamKey = stream || 'cst';
      return SUBJECTS_BY_LEVEL.secondary[streamKey] || [];
    }

    return [];
  };

  // Generate summaries for a specific subject
  const generateSummariesForSubject = (subjectId: string, subjectName: string) => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: `${subjectId}-summary-${i + 1}`,
      title: `ملخص ${subjectName} - ${['الدوال الأسية', 'المصفوفات', 'التكامل', 'المتتاليات'][i]}`,
      subject: subjectName,
      subjectId,
      description: `ملخص شامل لموضوع ${['الدوال الأسية', 'المصفوفات', 'التكامل', 'المتتاليات'][i]} في مادة ${subjectName}`,
      pages: Math.floor(Math.random() * 10) + 5,
      downloadCount: Math.floor(Math.random() * 500) + 50,
      rating: (4 + Math.random()).toFixed(1),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      type: ['pdf', 'doc', 'ppt'][Math.floor(Math.random() * 3)]
    }));
  };

  const subjects = getSubjectsForUser();

  // Show summary viewer if a summary is selected
  if (selectedSummary) {
    return (
      <div className="max-w-7xl mx-auto lg:px-4 lg:sm:px-6 lg:lg:px-8 py-6 lg:py-12">
        <SummaryViewer
          summary={selectedSummary}
          onBack={() => setSelectedSummary(null)}
        />
      </div>
    );
  }

  // Show summaries for selected subject
  if (selectedSubjectId) {
    const subject = subjects.find(s => s.id === selectedSubjectId);
    const summaries = generateSummariesForSubject(selectedSubjectId, subject?.name || '');

    return (
      <div className="p-3 lg:p-6">
        <button
          onClick={() => setSelectedSubjectId(null)}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-6 p-2 lg:p-0"
        >
          <ArrowLeft className="h-5 w-5 ml-1" />
          العودة إلى المواد
        </button>

        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ملخصات {subject?.name}
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
            مجموعة شاملة من الملخصات لمادة {subject?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((summary) => (
            <motion.div
              key={summary.id}
              className="card hover:shadow-luxury-hover transition-all duration-300 group cursor-pointer"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4 }}
              onClick={() => setSelectedSummary(summary)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {summary.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {summary.description}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${
                  summary.type === 'pdf' ? 'bg-red-100 dark:bg-red-900/30' :
                  summary.type === 'doc' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    summary.type === 'pdf' ? 'text-red-600 dark:text-red-400' :
                    summary.type === 'doc' ? 'text-blue-600 dark:text-blue-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`} />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 ml-1" />
                  {summary.pages} صفحة
                </div>
                <div className="flex items-center">
                  <Download className="w-4 h-4 ml-1" />
                  {summary.downloadCount} تحميل
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 ml-1 text-yellow-500" />
                  {summary.rating}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {summary.createdAt.toLocaleDateString('ar-DZ')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Show subjects
  return (
    <div className="p-3 lg:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            الملخصات الدراسية
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
            اختر مادة دراسية لمشاهدة ملخصاتها الشاملة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              className="card hover:shadow-luxury-hover transition-all duration-300 group cursor-pointer"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedSubjectId(subject.id)}
            >
              <div className="flex items-start">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex-shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-800/30 transition-colors ml-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    ملخصات شاملة لمادة {subject.name}
                  </p>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    عرض الملخصات
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد مواد
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لم يتم العثور على مواد دراسية
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SummariesPage;
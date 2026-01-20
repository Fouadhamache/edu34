import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, BookOpen, Brain, Users, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SUBJECTS_BY_LEVEL } from '../../types/education';

const TestsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const semesters = [
    { id: '1', name: 'الفصل الأول' },
    { id: '2', name: 'الفصل الثاني' },
    { id: '3', name: 'الفصل الثالث' },
  ];

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

  const subjects = getSubjectsForUser();

  const handleQuizTypeSelect = (type: 'multiple-choice' | 'flashcards' | 'challenge') => {
    console.log(`Starting test for ${selectedSubject} in semester ${selectedSemester} with type: ${type}`);
  };

  const handleReset = () => {
    setSelectedSemester(null);
    setSelectedSubject(null);
  };

  return (
    <div className="p-4 lg:p-6 min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            اختبر نفسك
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
            {!selectedSemester
              ? 'اختر الفصل الدراسي للبدء'
              : !selectedSubject
                ? 'اختر المادة التي تريد اختبار نفسك فيها'
                : 'اختر طريقة الاختبار المفضلة لديك'
            }
          </p>
        </div>

        {!selectedSemester && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              اختر الفصل الدراسي
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {semesters.map((semester) => (
                <motion.button
                  key={semester.id}
                  onClick={() => setSelectedSemester(semester.id)}
                  className="p-8 rounded-xl font-medium transition-all bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-luxury border-2 border-gray-200 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white group"
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <Target className="w-12 h-12 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    <span className="text-xl text-gray-900 dark:text-white">
                      {semester.name}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {selectedSemester && !selectedSubject && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-white">
                  {semesters.find(s => s.id === selectedSemester)?.name}
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                تغيير الفصل
              </button>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                اختر المادة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <motion.button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className="p-6 text-right rounded-xl transition-all bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-luxury border-2 border-gray-200 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white group"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {subject.name}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white group-hover:transform group-hover:-translate-x-1 transition-all" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedSemester && selectedSubject && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-white">
                  {subjects.find(s => s.id === selectedSubject)?.name}
                </span>
                <ChevronRight className="w-4 h-4" />
                <span>{semesters.find(s => s.id === selectedSemester)?.name}</span>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                العودة للبداية
              </button>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                اختر طريقة الاختبار
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.button
                  onClick={() => handleQuizTypeSelect('flashcards')}
                  className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:shadow-luxury transition-all"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        بطاقات تعليمية
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        مراجعة سريعة باستخدام البطاقات المرنة
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleQuizTypeSelect('multiple-choice')}
                  className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-200 dark:border-green-700 rounded-xl hover:shadow-luxury transition-all"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        أسئلة متعددة الخيارات
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        اختر الإجابة الصحيحة من بين عدة خيارات
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleQuizTypeSelect('challenge')}
                  className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-2 border-orange-200 dark:border-orange-700 rounded-xl hover:shadow-luxury transition-all"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        تنافس مع صديق
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        تحدى طالب آخر وتنافسوا على النتيجة
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TestsPage;
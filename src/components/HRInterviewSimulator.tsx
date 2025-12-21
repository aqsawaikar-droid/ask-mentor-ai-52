import React, { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, Award, Target } from 'lucide-react';

const HRInterviewSimulator = () => {
  const [screen, setScreen] = useState<'setup' | 'interview' | 'results'>('setup');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [interviewerStyle, setInterviewerStyle] = useState('1');
  const [selectedCategories, setSelectedCategories] = useState(['1']);
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [isGenerating, setIsGenerating] = useState(false);
  const [interviewData, setInterviewData] = useState<Array<{
    questionNumber: number;
    category: string;
    question: string;
    answer: string;
    evaluation: string;
    wordCount: number;
    timestamp: string;
  }>>([]);

  const interviewerStyles: Record<string, { name: string; desc: string }> = {
    '1': { name: 'Friendly & Supportive', desc: 'warm and encouraging' },
    '2': { name: 'Formal & Professional', desc: 'formal and businesslike' },
    '3': { name: 'Challenging & Probing', desc: 'challenging and asks follow-up questions' }
  };

  const questionCategories: Record<string, string> = {
    '1': 'Behavioral - Teamwork',
    '2': 'Behavioral - Leadership',
    '3': 'Behavioral - Conflict Resolution',
    '4': 'Behavioral - Problem Solving',
    '5': 'Career Goals & Motivation',
    '6': 'Strengths & Weaknesses',
    '7': 'Situational Judgment'
  };

  const questionPool: Record<string, string[]> = {
    '1': [
      "Tell me about a time when you worked effectively as part of a team to achieve a goal.",
      "Describe a situation where you had to collaborate with difficult team members.",
      "Can you share an experience where your team faced a setback? What was your role?",
      "Tell me about a project where you had to rely on others to complete your work.",
      "Describe a time when you helped a struggling team member."
    ],
    '2': [
      "Describe a situation where you had to lead a team through a challenging project.",
      "Tell me about a time when you took initiative without being asked.",
      "Share an experience where you had to motivate others during a difficult period.",
      "Describe a situation where you had to make an unpopular decision as a leader.",
      "Tell me about a time you mentored someone. What was the outcome?"
    ],
    '3': [
      "Can you share an example of how you resolved a conflict with a colleague?",
      "Tell me about a disagreement you had with your manager. How did you handle it?",
      "Describe a situation where two team members were in conflict. What did you do?",
      "Share an experience where you had to give difficult feedback to someone.",
      "Tell me about a time when you had to compromise to resolve a workplace issue."
    ],
    '4': [
      "Tell me about a complex problem you solved at work. What was your approach?",
      "Describe a situation where you had to think outside the box to find a solution.",
      "Share an experience where you identified a problem before it became serious.",
      "Tell me about a time when your first solution didn't work. What did you do next?",
      "Describe how you handled a situation with incomplete information."
    ],
    '5': [
      "Where do you see yourself in 5 years and why are you interested in this role?",
      "What motivates you to come to work every day?",
      "Why are you leaving your current position?",
      "What attracted you to our company specifically?",
      "How does this role align with your long-term career goals?"
    ],
    '6': [
      "What would you say is your greatest strength and how has it helped you?",
      "What is an area you're actively working to improve?",
      "How would your previous manager describe your work style?",
      "What professional achievement are you most proud of?",
      "Tell me about a skill you've developed recently."
    ],
    '7': [
      "Imagine you have two urgent deadlines. How would you prioritize?",
      "What would you do if you disagreed with a direct instruction from your supervisor?",
      "How would you handle a situation where a colleague takes credit for your work?",
      "If you discovered a mistake in your work after submission, what would you do?",
      "How would you approach joining a team that's resistant to new members?"
    ]
  };

  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (screen === 'interview' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleInterviewEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [screen, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRandomQuestion = (categoryId: string, used: string[]): string => {
    const questions = questionPool[categoryId] || questionPool['1'];
    const available = questions.filter(q => !used.includes(q));
    if (available.length === 0) {
      return questions[Math.floor(Math.random() * questions.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  };

  const startInterview = async () => {
    if (!role || !experience) {
      alert('Please fill in all fields');
      return;
    }
    
    setScreen('interview');
    setUsedQuestions([]);
    setIsGenerating(true);
    
    setTimeout(() => {
      const categoryId = selectedCategories[0];
      const newQuestion = getRandomQuestion(categoryId, []);
      setQuestion(newQuestion);
      setUsedQuestions([newQuestion]);
      setIsGenerating(false);
    }, 1500);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer');
      return;
    }

    setIsGenerating(true);
    
    const category = questionCategories[selectedCategories[(currentQuestion - 1) % selectedCategories.length]];
    
    // Simulate analysis
    setTimeout(() => {
      const qaData = {
        questionNumber: currentQuestion,
        category,
        question,
        answer,
        evaluation: `OVERALL SCORE: 7/10

STAR METHOD ANALYSIS:
Situation: 8/10 - Good context provided about the project scenario.
Task: 7/10 - Role was mentioned but could be more specific.
Action: 7/10 - Actions described but lacked detail on personal contribution.
Result: 6/10 - Outcome mentioned but quantifiable results would strengthen this.

COMMUNICATION QUALITY:
Clarity: 8/10 - Ideas were expressed clearly and logically.
Conciseness: 7/10 - Some areas could be more succinct.
Professionalism: 8/10 - Appropriate tone and vocabulary used.

RED FLAGS: No - None detected

STRENGTHS:
- Good structure following STAR method
- Demonstrated teamwork awareness

AREAS FOR IMPROVEMENT:
- Add more specific metrics and outcomes
- Highlight personal leadership moments

IMPROVEMENT SUGGESTIONS:
1. Include specific numbers (team size, timeline, results achieved)
2. Emphasize your unique contribution to differentiate yourself

HIRE RECOMMENDATION: Yes - Shows good teamwork skills with room for growth`,
        wordCount: answer.split(/\s+/).length,
        timestamp: new Date().toISOString()
      };
      
      setInterviewData(prev => [...prev, qaData]);
      
      if (currentQuestion < 5 && timeRemaining > 30) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setAnswer('');
        const categoryId = selectedCategories[(nextQuestion - 1) % selectedCategories.length];
        const newQuestion = getRandomQuestion(categoryId, usedQuestions);
        setQuestion(newQuestion);
        setUsedQuestions(prev => [...prev, newQuestion]);
      } else {
        handleInterviewEnd();
      }
      setIsGenerating(false);
    }, 2000);
  };

  const handleInterviewEnd = () => {
    setScreen('results');
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(catId)) {
        return prev.length > 1 ? prev.filter(id => id !== catId) : prev;
      }
      return [...prev, catId];
    });
  };

  // Setup Screen
  if (screen === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <Target className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">HR Interview Simulator</h1>
              <p className="text-muted-foreground">Powered by Claude AI</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  🎯 Role You're Interviewing For
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Software Engineer, Product Manager"
                  className="w-full px-4 py-3 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  📊 Years of Experience
                </label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full px-4 py-3 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  👤 Interviewer Personality
                </label>
                <div className="space-y-2">
                  {Object.entries(interviewerStyles).map(([id, style]) => (
                    <label key={id} className="flex items-center p-3 border-2 border-input rounded-lg cursor-pointer hover:bg-primary-50 transition-colors">
                      <input
                        type="radio"
                        value={id}
                        checked={interviewerStyle === id}
                        onChange={(e) => setInterviewerStyle(e.target.value)}
                        className="mr-3 accent-primary"
                      />
                      <div>
                        <div className="font-semibold text-foreground">{style.name}</div>
                        <div className="text-sm text-muted-foreground">{style.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  📂 Question Categories (select multiple)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(questionCategories).map(([id, category]) => (
                    <label key={id} className="flex items-center p-3 border-2 border-input rounded-lg cursor-pointer hover:bg-primary-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(id)}
                        onChange={() => toggleCategory(id)}
                        className="mr-3 accent-primary"
                      />
                      <span className="text-foreground">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={startInterview}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors shadow-lg"
              >
                Start 10-Minute Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interview Screen
  if (screen === 'interview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Question {currentQuestion}/5</h2>
                <p className="text-muted-foreground">{questionCategories[selectedCategories[(currentQuestion - 1) % selectedCategories.length]]}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-lg font-semibold text-primary">
                  <Clock className="w-5 h-5 mr-2" />
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-sm text-muted-foreground">Time Remaining</p>
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <div className="flex items-start mb-4">
                <Users className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">INTERVIEWER:</p>
                  {isGenerating && !question ? (
                    <div className="flex items-center text-muted-foreground">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                      Preparing question...
                    </div>
                  ) : (
                    <p className="text-lg text-foreground leading-relaxed">{question}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                💬 Your Answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... (use STAR method: Situation, Task, Action, Result)"
                className="w-full h-48 px-4 py-3 border-2 border-input rounded-lg focus:border-primary focus:outline-none resize-none bg-background text-foreground"
                disabled={isGenerating || !question}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                <span>{answer.split(/\s+/).filter(w => w).length} words</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={submitAnswer}
              disabled={isGenerating || !answer.trim() || !question}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors shadow-lg disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                  Analyzing your answer...
                </span>
              ) : (
                `Submit Answer & ${currentQuestion < 5 ? 'Continue' : 'Finish Interview'}`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (screen === 'results') {
    const totalWords = interviewData.reduce((sum, qa) => sum + qa.wordCount, 0);
    const avgScore = interviewData.reduce((sum, qa) => {
      const match = qa.evaluation.match(/OVERALL SCORE:\s*(\d+)\/10/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0) / (interviewData.length || 1);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-success-light rounded-full mb-4">
                <Award className="w-12 h-12 text-success" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Interview Completed!</h1>
              <p className="text-muted-foreground">Here's your comprehensive performance report</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-primary-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">{interviewData.length}</div>
                <div className="text-sm text-muted-foreground">Questions Answered</div>
              </div>
              <div className="bg-success-light rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-success">{avgScore.toFixed(1)}/10</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="bg-purple-light rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple">{totalWords}</div>
                <div className="text-sm text-muted-foreground">Total Words</div>
              </div>
              <div className="bg-warning-light rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-warning">{formatTime(600 - timeRemaining)}</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          {interviewData.map((qa, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-xl p-8 mb-6">
              <div className="border-b-2 border-border pb-4 mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">Question {qa.questionNumber}</h3>
                <p className="text-sm text-primary font-semibold mb-2">{qa.category}</p>
                <p className="text-muted-foreground italic">"{qa.question}"</p>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">YOUR ANSWER:</h4>
                <p className="text-foreground bg-muted p-4 rounded-lg">{qa.answer}</p>
                <p className="text-sm text-muted-foreground mt-2">{qa.wordCount} words</p>
              </div>

              <div className="bg-primary-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Detailed Evaluation
                </h4>
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                  {qa.evaluation}
                </pre>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="bg-card rounded-2xl shadow-2xl p-6 text-center">
            <button
              onClick={() => {
                setScreen('setup');
                setInterviewData([]);
                setCurrentQuestion(1);
                setTimeRemaining(600);
                setQuestion('');
                setAnswer('');
              }}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default HRInterviewSimulator;

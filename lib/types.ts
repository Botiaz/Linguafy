export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Language {
  id: string
  name: string
  code: string
  flag_emoji: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  language_id: string
  created_at: string
  language?: Language
}

export interface Word {
  id: string
  original_word: string
  translated_word: string
  pronunciation: string | null
  example_sentence: string | null
  category_id: string
  language_id: string
  difficulty_level: 'easy' | 'medium' | 'hard'
  created_at: string
  category?: Category
  language?: Language
}

export interface UserVocabulary {
  id: string
  user_id: string
  word_id: string
  mastery_level: number
  times_reviewed: number
  times_correct: number
  last_reviewed: string | null
  next_review: string | null
  created_at: string
  word?: Word
}

export interface TrainingSession {
  id: string
  user_id: string
  language_id: string
  category_id: string | null
  total_words: number
  correct_answers: number
  duration_seconds: number
  completed_at: string
  created_at: string
  language?: Language
  category?: Category
}

export interface TrainingCard {
  word: Word
  userVocabulary?: UserVocabulary
  showAnswer: boolean
}

export interface TrainingStats {
  totalWordsLearned: number
  totalSessions: number
  averageAccuracy: number
  currentStreak: number
  totalTimeSpent: number
}

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);
CREATE POLICY "admin_select_all" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "admin_update_all" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "admin_delete_all" ON public.profiles FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Tabela de idiomas
CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  flag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "languages_select_all" ON public.languages FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "admin_insert_languages" ON public.languages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "admin_update_languages" ON public.languages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "admin_delete_languages" ON public.languages FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_all" ON public.categories FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "admin_insert_categories" ON public.categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "admin_update_categories" ON public.categories FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "admin_delete_categories" ON public.categories FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Tabela de palavras
CREATE TABLE IF NOT EXISTS public.words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  pronunciation TEXT,
  audio_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "words_select_all" ON public.words FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "admin_insert_words" ON public.words FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "admin_update_words" ON public.words FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "admin_delete_words" ON public.words FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Tabela de vocabulário do usuário (palavras salvas pelo usuário)
CREATE TABLE IF NOT EXISTS public.user_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id UUID REFERENCES public.words(id) ON DELETE CASCADE,
  custom_word TEXT,
  custom_translation TEXT,
  language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
  times_reviewed INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_vocabulary_select_own" ON public.user_vocabulary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_vocabulary_insert_own" ON public.user_vocabulary FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_vocabulary_update_own" ON public.user_vocabulary FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_vocabulary_delete_own" ON public.user_vocabulary FOR DELETE USING (auth.uid() = user_id);

-- Tabela de progresso de treino
CREATE TABLE IF NOT EXISTS public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
  total_words INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "training_sessions_select_own" ON public.training_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "training_sessions_insert_own" ON public.training_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "training_sessions_update_own" ON public.training_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, is_admin)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'name', NULL),
    new.email,
    COALESCE((new.raw_user_meta_data ->> 'is_admin')::boolean, FALSE)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Inserir idiomas iniciais
INSERT INTO public.languages (name, code, flag) VALUES
  ('Inglês', 'en', '🇺🇸'),
  ('Português', 'pt', '🇧🇷'),
  ('Espanhol', 'es', '🇪🇸'),
  ('Francês', 'fr', '🇫🇷'),
  ('Alemão', 'de', '🇩🇪'),
  ('Italiano', 'it', '🇮🇹'),
  ('Japonês', 'ja', '🇯🇵'),
  ('Mandarim', 'zh', '🇨🇳'),
  ('Coreano', 'ko', '🇰🇷')
ON CONFLICT (code) DO NOTHING;

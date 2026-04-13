'use server'

import * as deepl from 'deepl-node'
import { createClient } from '@/lib/supabase/server'

const deeplAuthKey = process.env.DEEPL_AUTH_KEY
const deeplServerUrl = process.env.DEEPL_SERVER_URL

function createTranslator() {
  if (!deeplAuthKey) {
    throw new Error('DEEPL_AUTH_KEY nao configurada no servidor')
  }

  const translatorOptions = deeplServerUrl
    ? { serverUrl: deeplServerUrl }
    : deeplAuthKey.endsWith(':fx')
      ? { serverUrl: 'https://api-free.deepl.com' }
      : undefined

  return new deepl.Translator(deeplAuthKey, translatorOptions)
}

function toDeepLTargetLang(languageCode: string) {
  const normalized = languageCode.trim().toLowerCase()

  if (normalized === 'en') return 'EN-US'
  if (normalized === 'pt') return 'PT-BR'

  return normalized.toUpperCase()
}

function toDeepLSourceLang(languageCode?: string) {
  if (!languageCode) return null

  const normalized = languageCode.trim().toLowerCase()
  if (!normalized) return null

  if (normalized === 'en-us' || normalized === 'en-gb') return 'EN'
  if (normalized === 'pt-br' || normalized === 'pt-pt') return 'PT'

  return normalized.split('-')[0].toUpperCase()
}

export async function GET() {
  try {
    const translator = createTranslator()
    const [targetLanguages, sourceLanguages] = await Promise.all([
      translator.getTargetLanguages(),
      translator.getSourceLanguages(),
    ])

    return Response.json({
      success: true,
      provider: 'deepl',
      languages: {
        target: targetLanguages.map((language) => ({
          code: language.code,
          name: language.name,
          supportsFormality: language.supportsFormality,
        })),
        source: sourceLanguages.map((language) => ({
          code: language.code,
          name: language.name,
        })),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar idiomas DeepL:', error)
    return Response.json(
      { error: 'Nao foi possivel carregar idiomas da DeepL' },
      { status: 500 }
    )
  }
}


export async function POST(req: Request) {
  try {
    const {
      word,
      sourceLanguage,
      sourceLanguageCode,
      targetLanguageId,
      targetLanguageName,
      targetLanguageCode,
      userId,
    } = await req.json()

    if (!word || !targetLanguageId || !targetLanguageName || !targetLanguageCode) {
      return Response.json(
        { error: 'Campos obrigatorios ausentes' },
        { status: 400 }
      )
    }

    const translator = createTranslator()

    const deepLTargetLang = toDeepLTargetLang(targetLanguageCode)
    const deepLSourceLang = toDeepLSourceLang(sourceLanguageCode)

    const result = await translator.translateText(
      word,
      deepLSourceLang as deepl.SourceLanguageCode | null,
      deepLTargetLang as deepl.TargetLanguageCode
    )

    const translatedText = Array.isArray(result) ? result[0]?.text : result.text

    const translation = {
      translatedWord: translatedText,
      pronunciation: null,
      exampleSentence: null,
      exampleTranslation: null,
    }

    if (!translation || !translation.translatedWord) {
      return Response.json(
        { error: 'Falha ao traduzir a palavra' },
        { status: 500 }
      )
    }

    // Salvar no banco de dados se o usuario estiver autenticado
    let savedWord = null
    if (userId) {
      const supabase = await createClient()

      // Verificar se a palavra ja existe para este idioma
      const { data: existingWord } = await supabase
        .from('words')
        .select('id')
        .eq('original_word', word.toLowerCase())
        .eq('translated_word', translation.translatedWord.toLowerCase())
        .eq('language_id', targetLanguageId)
        .single()

      if (!existingWord) {
        // Buscar ou criar categoria "Tradutor"
        let { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('name', 'Tradutor')
          .eq('language_id', targetLanguageId)
          .single()

        if (!category) {
          const { data: newCategory } = await supabase
            .from('categories')
            .insert({
              name: 'Tradutor',
              language_id: targetLanguageId,
              description: 'Palavras adicionadas pelo tradutor automatico',
            })
            .select('id')
            .single()
          category = newCategory
        }

        // Inserir a nova palavra
        const { data: newWord, error: insertError } = await supabase
          .from('words')
          .insert({
            original_word: word.toLowerCase(),
            translated_word: translation.translatedWord.toLowerCase(),
            language_id: targetLanguageId,
            category_id: category?.id,
            pronunciation: translation.pronunciation,
            example_sentence: translation.exampleSentence,
            example_translation: translation.exampleTranslation,
          })
          .select()
          .single()

        if (insertError) {
          console.error('Erro ao salvar palavra:', insertError)
        } else {
          savedWord = newWord
        }
      } else {
        savedWord = existingWord
      }

      // Garantir que a palavra traduzida esteja disponivel para treino
      if (savedWord?.id) {
        const { data: existingVocabulary } = await supabase
          .from('user_vocabulary')
          .select('id')
          .eq('user_id', userId)
          .eq('word_id', savedWord.id)
          .maybeSingle()

        if (!existingVocabulary) {
          await supabase
            .from('user_vocabulary')
            .insert({
              user_id: userId,
              word_id: savedWord.id,
              mastery_level: 0,
              times_reviewed: 0,
              times_correct: 0,
              last_reviewed: null,
              next_review: new Date().toISOString(),
            })
        }
      }
    }

    return Response.json({
      success: true,
      translation: {
        original: word,
        translated: translation.translatedWord,
        pronunciation: translation.pronunciation,
        exampleSentence: translation.exampleSentence,
        exampleTranslation: translation.exampleTranslation,
      },
      metadata: {
        provider: 'deepl',
        sourceLanguage: sourceLanguage || sourceLanguageCode || 'auto',
        targetLanguage: targetLanguageName,
      },
      saved: !!savedWord,
      wordId: savedWord?.id,
    })
  } catch (error) {
    console.error('Erro na traducao:', error)
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

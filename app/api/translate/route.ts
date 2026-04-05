'use server'

import { generateText, Output } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { word, sourceLanguage, targetLanguageId, targetLanguageName, userId } = await req.json()

    if (!word || !sourceLanguage || !targetLanguageId || !targetLanguageName) {
      return Response.json(
        { error: 'Campos obrigatorios ausentes' },
        { status: 400 }
      )
    }

    // Traduzir usando AI
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({
        schema: z.object({
          translatedWord: z.string().describe('A palavra traduzida'),
          pronunciation: z.string().nullable().describe('Pronuncia fonetica da palavra traduzida'),
          exampleSentence: z.string().nullable().describe('Uma frase de exemplo usando a palavra traduzida'),
          exampleTranslation: z.string().nullable().describe('Traducao da frase de exemplo'),
        }),
      }),
      prompt: `Traduza a seguinte palavra de ${sourceLanguage} para ${targetLanguageName}.

Palavra: "${word}"

Responda com:
1. A traducao exata da palavra
2. A pronuncia fonetica (se aplicavel)
3. Uma frase de exemplo usando a palavra traduzida
4. A traducao da frase de exemplo para ${sourceLanguage}`,
    })

    const translation = result.output

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

          // Adicionar ao vocabulario do usuario para treino
          await supabase
            .from('user_vocabulary')
            .insert({
              user_id: userId,
              word_id: newWord.id,
              confidence_level: 0,
              times_practiced: 0,
              times_correct: 0,
            })
            .select()
        }
      } else {
        savedWord = existingWord
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

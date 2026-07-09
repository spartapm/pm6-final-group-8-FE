'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { BackButton } from '@/components/ui/BackButton';
import { ChatBubble, TypingBubble, ChatInputBar, ExtraQuestionBubble } from '@/components/record/ChatBubble';
import { CATEGORY_LABELS } from '@/lib/constants/categories';
import { getQuestions, getQuestionHints, EXTRA_QUESTION, EXTRA_QUESTION_HINT, EMPTY_SAVE_MESSAGE, EMPTY_SAVE_SUBMESSAGE } from '@/lib/constants/questions';
import { useRecordDraft } from '@/hooks/useRecordDraft';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import type { Record } from '@/types';

type Phase = 'q1' | 'q2' | 'q3' | 'extra_ask' | 'extra_input' | 'save';

export default function ChatPage() {
  const router = useRouter();
  useRequireAuth();
  const { getToken } = useAuth();
  const { category, emotionLevel, messages, addMessage, recordDate } = useRecordDraft();
  const [phase, setPhase] = useState<Phase>('q1');
  const [displayed, setDisplayed] = useState<Array<{ role: 'bot' | 'user'; content: string; hint?: string }>>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emptyConfirm, setEmptyConfirm] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef(0);
  const questionIndexRef = useRef(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didInitRef = useRef(false);

  const questions = category ? getQuestions(category, emotionLevel) : [];
  const questionHints = category ? getQuestionHints(category, emotionLevel) : [];

  useEffect(() => {
    if (!category) router.replace('/record/category');
  }, [category, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayed, typing]);

  function showBotMessage(text: string, hint?: string, onDone?: () => void) {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
      setTyping(false);
      setDisplayed((d) => [...d, { role: 'bot', content: text, hint }]);
      onDone?.();
    }, 800);
  }

  useEffect(() => {
    if (!category || didInitRef.current) return;
    didInitRef.current = true;

    const [q1] = getQuestions(category, emotionLevel);
    const [h1] = getQuestionHints(category, emotionLevel);
    showBotMessage(q1, h1);

    return () => {
      didInitRef.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setTyping(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, emotionLevel]);

  function sendAnswer(answer: string) {
    const trimmed = answer.trim();
    setDisplayed((d) => [...d, { role: 'user', content: trimmed || '(무응답)' }]);
    addMessage({ role: 'user', content: trimmed, sortOrder: sortRef.current++ });
    setInput('');

    if (phase === 'q1') {
      questionIndexRef.current = 1;
      addMessage({ role: 'bot', content: questions[1], sortOrder: sortRef.current++ });
      showBotMessage(questions[1], questionHints[1], () => setPhase('q2'));
    } else if (phase === 'q2') {
      questionIndexRef.current = 2;
      addMessage({ role: 'bot', content: questions[2], sortOrder: sortRef.current++ });
      showBotMessage(questions[2], questionHints[2], () => setPhase('q3'));
    } else if (phase === 'q3') {
      addMessage({ role: 'bot', content: EXTRA_QUESTION, sortOrder: sortRef.current++ });
      showBotMessage(EXTRA_QUESTION, EXTRA_QUESTION_HINT, () => setPhase('extra_ask'));
    } else if (phase === 'extra_input') {
      setPhase('save');
    }
  }

  async function handleSave(forceEmpty = false) {
    const token = getToken();
    if (!token || !category) return;

    const allMessages = [
      { role: 'bot' as const, content: questions[0], sortOrder: 0 },
      ...messages,
    ];

    const hasUserText = allMessages.some((m) => m.role === 'user' && m.content.trim());
    if (!hasUserText && !forceEmpty) {
      setEmptyConfirm(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const record = (await api.createRecord(token, {
        recordDate,
        category,
        emotionLevel,
        messages: allMessages.map((m, i) => ({
          role: m.role,
          content: m.content,
          sortOrder: m.sortOrder ?? i,
        })),
      })) as Record;
      router.push(`/record/complete?id=${record.id}`);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('저장 실패'));
    } finally {
      setLoading(false);
    }
  }

  if (!category) return null;

  const showInput = ['q1', 'q2', 'q3', 'extra_input'].includes(phase);
  const showSave = phase === 'save';

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="border-b border-[#e8e3d6] bg-white px-3.5 pb-2 pt-2">
        <div className="flex items-center">
          <BackButton
            onClick={() => router.back()}
            className="text-[20px] font-normal text-olive"
          />
          <div className="flex-1 text-center">
            <p className="text-[20px] font-black text-foreground">오늘의 기록</p>
            <p className="mt-0.5 text-[16px] font-semibold text-primary">
              {CATEGORY_LABELS[category]}
            </p>
          </div>
          <div className="w-7" />
        </div>
      </header>

      <p className="py-2 text-center text-[12px] text-[rgba(100,100,100,0.6)]">
        답변은 500자 이내로 작성해주세요.
      </p>

      <div className="flex-1 space-y-4 overflow-y-auto px-3.5 py-2 pb-44">
        {displayed.map((msg, i) => {
          const isExtraQuestion =
            phase === 'extra_ask' &&
            i === displayed.length - 1 &&
            msg.role === 'bot' &&
            msg.content === EXTRA_QUESTION;

          if (isExtraQuestion) {
            return (
              <ExtraQuestionBubble
                key={i}
                content={msg.content}
                hint={msg.hint}
                onSkip={() => {
                  setDisplayed((d) => [...d, { role: 'user', content: '아니 할말 다 했어' }]);
                  setPhase('save');
                }}
                onMore={() => {
                  setDisplayed((d) => [...d, { role: 'user', content: '응 더 이야기 할래' }]);
                  setPhase('extra_input');
                }}
              />
            );
          }

          return (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
              hint={msg.hint}
              showAvatar={msg.role === 'bot'}
            />
          );
        })}
        {typing && <TypingBubble />}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2 bg-white">
        {showInput && (
          <ChatInputBar
            value={input}
            onChange={setInput}
            onSend={(text) => sendAnswer(text)}
            sendDisabled={typing}
          />
        )}

        {showSave && (
          <div className="px-[22px] py-3">
            <Button fullWidth loading={loading} className="h-12" onClick={() => handleSave()}>
              저장하고 결과 보기
            </Button>
          </div>
        )}
      </div>

      <Modal
        open={emptyConfirm}
        onClose={() => setEmptyConfirm(false)}
        confirmLabel="저장하고 결과 보기"
        onConfirm={() => {
          setEmptyConfirm(false);
          handleSave(true);
        }}
      >
        {EMPTY_SAVE_MESSAGE}
        <br />
        {EMPTY_SAVE_SUBMESSAGE}
      </Modal>

      <ErrorModal error={error} onClose={() => setError(null)} onRetry={() => handleSave()} />
    </div>
  );
}

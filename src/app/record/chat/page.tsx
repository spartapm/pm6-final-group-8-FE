'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { BackButton } from '@/components/ui/BackButton';
import { ChatBubble, ChatInputBar, ExtraQuestionBubble } from '@/components/record/ChatBubble';
import { CATEGORY_LABELS } from '@/lib/constants/categories';
import {
  getQuestions,
  getQuestionHints,
  getRandomGreeting,
  INTRO_FIXED,
  EXTRA_QUESTION,
  EXTRA_INPUT_PROMPT,
  EXTRA_MORE_LABEL,
  EMPTY_SAVE_MESSAGE,
  EMPTY_SAVE_SUBMESSAGE,
} from '@/lib/constants/questions';
import { useRecordDraft } from '@/hooks/useRecordDraft';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { AnalyticsEvent, capture } from '@/lib/analytics';
import type { Record } from '@/types';

type Phase = 'q1' | 'q2' | 'q3' | 'extra_ask' | 'extra_input' | 'save';

const BOT_DELAY_MS = 1000;

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
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const latestBotRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didInitRef = useRef(false);

  const questions = category ? getQuestions(category, emotionLevel) : [];
  const questionHints = category ? getQuestionHints(category, emotionLevel) : [];

  useEffect(() => {
    if (!category) router.replace('/record/category');
  }, [category, router]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardOffset(offset);
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  useEffect(() => {
    latestBotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [displayed, typing, keyboardOffset]);

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
    }, BOT_DELAY_MS);
  }

  useEffect(() => {
    if (!category || didInitRef.current) return;
    didInitRef.current = true;

    const greeting = getRandomGreeting(emotionLevel);
    const [q1] = getQuestions(category, emotionLevel);
    const [h1] = getQuestionHints(category, emotionLevel);

    // 인트로: 인사말 + 빈 줄 + 안내문 (같은 말풍선·동일 스타일) → Q1
    const introBubble = `${greeting}\n\n${INTRO_FIXED}`;
    setDisplayed([{ role: 'bot', content: introBubble }]);
    addMessage({
      role: 'bot',
      content: introBubble,
      sortOrder: sortRef.current++,
    });
    showBotMessage(q1, h1, () => {
      addMessage({ role: 'bot', content: q1, sortOrder: sortRef.current++ });
    });

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
      addMessage({ role: 'bot', content: questions[1], sortOrder: sortRef.current++ });
      showBotMessage(questions[1], questionHints[1], () => setPhase('q2'));
    } else if (phase === 'q2') {
      addMessage({ role: 'bot', content: questions[2], sortOrder: sortRef.current++ });
      showBotMessage(questions[2], questionHints[2], () => setPhase('q3'));
    } else if (phase === 'q3') {
      addMessage({ role: 'bot', content: EXTRA_QUESTION, sortOrder: sortRef.current++ });
      showBotMessage(EXTRA_QUESTION, undefined, () => setPhase('extra_ask'));
    } else if (phase === 'extra_input') {
      setPhase('save');
    }
  }

  async function handleSave(forceEmpty = false) {
    const token = getToken();
    if (!token || !category) return;

    const allMessages = messages.length > 0 ? messages : [
      { role: 'bot' as const, content: questions[0], sortOrder: 0 },
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
      capture(AnalyticsEvent.RecordCreated, {
        category,
        emotionLevel,
        status: record.status,
      });
      // reset은 완료 화면에서 수행 — 여기서 reset하면 category=null → /record/category로 튕김
      router.replace(`/record/complete?id=${record.id}`);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('저장 실패'));
    } finally {
      setLoading(false);
    }
  }

  if (!category) return null;

  const showInput = ['q1', 'q2', 'q3', 'extra_input'].includes(phase);
  const showSave = phase === 'save';
  const bottomPad = Math.max(keyboardOffset, 0);

  return (
    <div className="flex min-h-dvh flex-col bg-white" style={{ paddingBottom: bottomPad }}>
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
          const isLast = i === displayed.length - 1;
          const isExtraQuestion =
            phase === 'extra_ask' &&
            isLast &&
            msg.role === 'bot' &&
            msg.content === EXTRA_QUESTION;

          if (isExtraQuestion) {
            return (
              <div key={i} ref={isLast ? latestBotRef : undefined}>
                <ExtraQuestionBubble
                  content={msg.content}
                  hint={msg.hint}
                  onSkip={() => {
                    setPhase('save');
                  }}
                  onMore={() => {
                    setDisplayed((d) => [
                      ...d,
                      { role: 'user', content: EXTRA_MORE_LABEL },
                    ]);
                    addMessage({
                      role: 'user',
                      content: EXTRA_MORE_LABEL,
                      sortOrder: sortRef.current++,
                    });
                    showBotMessage(EXTRA_INPUT_PROMPT, undefined, () => {
                      addMessage({
                        role: 'bot',
                        content: EXTRA_INPUT_PROMPT,
                        sortOrder: sortRef.current++,
                      });
                      setPhase('extra_input');
                    });
                  }}
                />
              </div>
            );
          }

          return (
            <div key={i} ref={msg.role === 'bot' && isLast ? latestBotRef : undefined}>
              <ChatBubble
                role={msg.role}
                content={msg.content}
                hint={msg.hint}
                showAvatar={msg.role === 'bot'}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div
        className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2 bg-white"
        style={{ bottom: bottomPad }}
      >
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

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { figmaAssets } from '@/lib/figma-assets';

const policies = [
  {
    title: '암호화 저장',
    desc: '모든 기록은 안전하게 저장돼요.',
  },
  {
    title: '제3자 미공유',
    desc: '내 기록을 절대 외부에 판매하거나 공유하지 않아요.',
  },
  {
    title: 'AI 코멘트는 이렇게 처리돼요',
    desc: 'AI 코멘트 생성 시에만 일시적으로 처리되고, 학습에 사용되지 않아요.',
  },
];

export default function PolicyPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  async function handleAccept() {
    const token = getToken();
    if (token) {
      await api.acceptPolicy(token);
    }
    router.push('/home');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white px-3.5 pb-8 pt-10">
      <div className="flex flex-1 flex-col">
        <div className="flex justify-center">
          <div className="relative h-[86px] w-[63px] rotate-[15deg]">
            <FigmaImage src={figmaAssets.lock} alt="" fill className="object-contain" />
          </div>
        </div>

        <h1 className="mt-6 text-center text-[20px] font-black leading-[28.3px] tracking-[-0.18px] text-foreground">
          <span className="text-primary">콩팟 </span>
          에서
          <br />
          내 기록은 <span className="text-primary">안전</span>하게 보관돼요
        </h1>

        <div className="mt-8 flex flex-col gap-3">
          {policies.map((item) => (
            <div key={item.title} className="rounded-[14px] bg-[#f1f1f1] p-3.5">
              <p className="text-[15px] font-black text-foreground">{item.title}</p>
              <p className="mt-0.5 text-[12px] leading-[16.5px] text-olive">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Button fullWidth className="mt-6 h-12" onClick={handleAccept}>
        확인했어요
      </Button>
    </div>
  );
}

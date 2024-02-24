'use client';
import { Header } from '@/components/Header';
import { Frame } from '@/components/Frame';
import { FrameInput } from '@/components/FrameInput';
import { ValidationResults } from '@/components/ValidationResults';

export default function Home() {
  return (
    <div className="mx-auto flex flex-col items-center gap-8 pb-16">
      <Header />
      <div className="max-w-layout-max grid w-full grid-cols-[3fr,5fr] gap-12"> 
        <div className="flex flex-col gap-4">
          <FrameInput />
          <Frame />
        </div>
        <ValidationResults />
      </div>
    </div>
  );
}
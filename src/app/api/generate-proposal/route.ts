import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { clientContext, jobDescription, pastSuccessExamples } = await req.json();

    // Prompt for the AI
    const systemPrompt = `あなたはプロフェッショナルなフリーランスの営業アシスタントです。
提供された「案件情報」と「過去の成功事例」を元に、クライアントの発注意欲を高める魅力的な提案文（応募文）を生成してください。
以下のポイントを必ず守ってください：
- 簡潔で読みやすい構成にすること
- テンプレート感を抑え、今回の案件に特化したパーソナライズを行うこと
- 自身の強み（実績）を効果的にアピールすること
- 専門的かつ礼儀正しい、丁寧なトーン＆マナー
`;

    const prompt = `
【案件情報】
${jobDescription}

【クライアントコンテキスト（プラットフォーム、既知の情報など）】
${clientContext}

【過去の成功事例・アピールしたい実績】
${pastSuccessExamples}

上記の情報を元に、応募文を作成してください。
`;

    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: systemPrompt,
      prompt: prompt,
    });

    return NextResponse.json({ proposal: text });
  } catch (error: any) {
    console.error('Error generating proposal:', error);
    return NextResponse.json(
      { error: '提案文の生成中にエラーが発生しました', details: error.message },
      { status: 500 }
    );
  }
}

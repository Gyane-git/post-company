import {
  CaptionGenerationPrompt,
  ContentIdea,
  ContentIdeaPrompt,
  HashtagGenerationPrompt,
  PlatformAdaptationResult,
} from '@/types/ai';

export const aiService = {
  async generateCaption(prompt: CaptionGenerationPrompt): Promise<string> {
    await new Promise((r) => setTimeout(r, 600));

    const topic = prompt.topic || 'our new product launch';
    const tone = prompt.tone || 'professional';
    const platform = prompt.platform;

    if (platform === 'instagram') {
      if (tone === 'luxury') {
        return `Elegance meets performance. Unveiling our newest chapter in ${topic}. Crafted with precision for those who accept nothing less than extraordinary. ✨\n\nLink in bio to discover the private collection.\n\n#Exclusive #LuxuryLiving #Innovation #Design`;
      }
      if (tone === 'funny') {
        return `Me: I don't need any more excitement this week.\nAlso me when ${topic} drops: *orders immediately and tells everyone I know* 💀\n\nDouble tap if you're guilty too. Tap the link in bio before it sells out!\n\n#Relatable #Mood #TrendingNow`;
      }
      return `Transforming the way you think about ${topic}. 🚀\n\nWe engineered every single detail to save you time and maximize your daily impact. Swipe through to see the live breakdown!\n\nSave this post for later and click the link in bio to get early access.\n\n#Innovation #SocialGrowth #Creators #DigitalFuture`;
    }

    if (platform === 'tiktok') {
      return `Stop scrolling if you care about ${topic} 🛑\n\nHere is the exact framework we used to get 10x results in under 7 days. Comment "GUIDE" and I'll send you the full breakdown! 👇\n\n#tiktokgrowth #protips #viral #foryoupage #learnontiktok`;
    }

    if (platform === 'youtube') {
      return `In today's video, we break down everything you need to know about ${topic}.\n\n⏱️ Timestamps:\n0:00 - Introduction\n1:24 - The Core Breakdown\n4:50 - Live Case Study\n8:12 - Actionable Steps for Tomorrow\n\n🔔 Subscribe for weekly in-depth masterclasses.\n\n#Technology #Education #CreatorGuide`;
    }

    // Default Facebook
    return `We are thrilled to officially share the next milestone for ${topic}.\n\nOver the last 6 months, our product and marketing team set out to solve one foundational challenge: making digital execution seamless for every marketer.\n\nRead our full technical deep-dive and case study on the blog today (link in the comments below).\n\n#TechUpdate #DigitalMarketing #BusinessGrowth #Innovation`;
  },

  async generateHashtags(prompt: HashtagGenerationPrompt): Promise<string[]> {
    await new Promise((r) => setTimeout(r, 450));
    const cleanTopic = prompt.topic.toLowerCase().replace(/[^a-z0-9]/g, '');
    const generic = [
      `#${cleanTopic || 'marketing'}`,
      `#${cleanTopic || 'growth'}strategy`,
      '#digitalmarketing',
      '#socialmedia',
      '#marketingtips',
      '#businessgrowth',
      '#contentcreator',
      '#marketingtrends',
      '#nepal',
      '#saas',
      '#entrepreneurship',
      '#socialmediamanager',
      '#brandbuilding',
      '#creativeagency',
      '#growthhacking',
    ];
    return generic.slice(0, prompt.count || 8);
  },

  async generateIdeas(prompt: ContentIdeaPrompt): Promise<ContentIdea[]> {
    await new Promise((r) => setTimeout(r, 700));
    const ind = prompt.industry || 'Digital Marketing';
    const aud = prompt.audience || 'Entrepreneurs & Marketers';

    return [
      {
        id: 'idea-1',
        title: `The 3 Biggest Mistakes ${aud} Make in ${ind}`,
        description: `Highlight common pitfalls, explain why they occur, and offer actionable 1-step fixes that build immediate credibility.`,
        suggestedPlatform: 'instagram',
        suggestedContentType: 'Reel/Short',
        hook: `"If you're still doing this in 2026, you're leaving money on the table..."`,
      },
      {
        id: 'idea-2',
        title: `Behind the Scenes: A Day in the Life at our Agency`,
        description: `Show the raw, unscripted workflow of tackling client deliverables and campaign setups.`,
        suggestedPlatform: 'tiktok',
        suggestedContentType: 'Behind the Scenes',
        hook: `"What 8 hours of campaign management actually looks like behind closed doors."`,
      },
      {
        id: 'idea-3',
        title: `How We Scaled Client Reach by 300% in 30 Days`,
        description: `A data-backed carousel infographic breaking down metrics, testing hypotheses, and final ROI.`,
        suggestedPlatform: 'facebook',
        suggestedContentType: 'Educational Video',
        hook: `"The exact 4-step framework we used to generate 500k impressions with $0 ad spend."`,
      },
      {
        id: 'idea-4',
        title: `Comprehensive Guide to Omnichannel Publishing in 2026`,
        description: `In-depth walkthrough of content repurposing workflows from 1 longform video to 15 micro-clips.`,
        suggestedPlatform: 'youtube',
        suggestedContentType: 'Educational Video',
        hook: `"Never run out of social media content again with this 1-to-15 distribution model."`,
      },
      {
        id: 'idea-5',
        title: `Q&A: Answering the Hardest Questions in ${ind}`,
        description: `Interactive community engagement post responding to direct follower queries.`,
        suggestedPlatform: 'instagram',
        suggestedContentType: 'Carousel',
        hook: `"You asked, we answered: the top 5 questions regarding our latest strategies."`,
      },
      {
        id: 'idea-6',
        title: `Stop Doing This One Thing on Social Media`,
        description: `Contrarian viewpoint on an outdated industry practice that still gets recommended.`,
        suggestedPlatform: 'tiktok',
        suggestedContentType: 'Reel/Short',
        hook: `"Unpopular opinion: this standard marketing tactic is actually killing your reach."`,
      },
    ];
  },

  async adaptContentForPlatforms(masterText: string): Promise<PlatformAdaptationResult> {
    await new Promise((r) => setTimeout(r, 650));
    const snippet = masterText.trim() || 'Excited to announce our new feature launch!';

    return {
      instagram: `${snippet} ✨\n\nSwipe to see how it transforms your workflow in 3 simple steps.\n\n💬 Tell us in the comments what feature you want next!\n\n#Innovation #ProductLaunch #Creators #SocialGrowth`,
      facebook: `${snippet}\n\nOur team has spent months listening to customer feedback to build something truly streamlined. With this update, digital teams can schedule and publish across all major social networks simultaneously.\n\nCheck out the full release notes and case study link in the first comment.\n\n#TechUpdate #SaaS #Productivity #MarketingStrategy`,
      tiktok: `You asked for it, we built it! 🔥\n\n${snippet.slice(0, 100)}...\n\nTap the plus icon for more updates and drop your questions below! 👇\n\n#fyp #featurelaunch #techtok #productivity`,
      youtube: `${snippet} | Official Walkthrough & First Look\n\nIn this video, we dive into the core architecture, practical use cases, and tips to get the most out of this new capability.\n\nChapters:\n0:00 Introduction\n1:15 Live Demo\n4:20 Best Practices\n\nLike and Subscribe for more!`,
    };
  },

  async sendChatMessage(message: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 600));
    const lower = message.toLowerCase();

    if (lower.includes('car') || lower.includes('automobile')) {
      return `Here is a high-impact Instagram caption for your new car launch:\n\n"Precision. Power. Pure exhilaration. Introducing the all-new Apex GT — engineered from the tarmac up to redefine your driving experience. 🏎️💨\n\nBooking reservations are now open exclusively at the link in bio. Where will your first drive take you?\n\n#NewCar #CarLaunch #AutomotiveDesign #LuxuryDrive #Speed #Innovation"`;
    }

    if (lower.includes('hashtag') || lower.includes('tag')) {
      return `Here are top trending hashtags tailored for digital marketing in 2026:\n\n#DigitalMarketing #SocialMediaStrategy #MarketingAutomation #ContentCreator #NepalBusiness #SaaSGallary #GrowthMarketing #BrandBuilding`;
    }

    if (lower.includes('idea') || lower.includes('suggest')) {
      return `Here are 3 quick post ideas:\n1. 📊 "The Anatomy of a Viral Reel" (Carousel breakdown)\n2. ⏱️ "Day in the Life of a Growth Marketer" (Behind the scenes vertical video)\n3. 💡 "3 Marketing Tools You Haven't Heard Of Yet" (Fast-paced listicle)`;
    }

    return `Here is a tailored draft based on your request:\n\n"Ready to scale your digital presence? When you combine data-driven scheduling with authentic storytelling, your engagement multiplies effortlessly. Check our bio link for this week's full playbook!"\n\nWould you like me to adapt this for TikTok, Facebook, or YouTube?`;
  },
};

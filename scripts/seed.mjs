import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xgvzdvjchvjvygtckjme.supabase.co";
const supabaseKey = "sb_publishable_XlXaw0OEQJQbAb7ayvS_yg_tU9vCKEr";

const supabase = createClient(supabaseUrl, supabaseKey);

const gradients = [
  "linear-gradient(135deg, #1A1D2E 0%, #E8782A 100%)",
  "linear-gradient(135deg, #2C3040 0%, #7B68EE 100%)",
  "linear-gradient(135deg, #1A1D2E 0%, #5B9BD5 100%)",
  "linear-gradient(135deg, #4A5D4E 0%, #2C3040 100%)",
  "linear-gradient(135deg, #B8963E 0%, #1A1D2E 100%)",
  "linear-gradient(135deg, #7B68EE 0%, #E8782A 100%)",
  "linear-gradient(135deg, #5B9BD5 0%, #4A5D4E 100%)",
  "linear-gradient(135deg, #2C3040 0%, #B8963E 100%)",
  "linear-gradient(135deg, #E8782A 0%, #4A5D4E 100%)",
  "linear-gradient(135deg, #1A1D2E 0%, #7B68EE 50%, #E8782A 100%)",
  "linear-gradient(160deg, #2C3040 0%, #5B9BD5 60%, #1A1D2E 100%)",
  "linear-gradient(135deg, #4A5D4E 0%, #B8963E 100%)",
];

const users = [
  { id: "u1", name: "钢铁侠不穿铁", avatarColor: "linear-gradient(135deg, #E8782A, #B8963E)", avatarInitial: "钢" },
  { id: "u2", name: "健身老王", avatarColor: "linear-gradient(135deg, #4A5D4E, #2C3040)", avatarInitial: "王" },
  { id: "u3", name: "理财小哥Max", avatarColor: "linear-gradient(135deg, #B8963E, #E8782A)", avatarInitial: "M" },
  { id: "u4", name: "游戏达人阿飞", avatarColor: "linear-gradient(135deg, #7B68EE, #5B9BD5)", avatarInitial: "飞" },
  { id: "u5", name: "清醒观察者", avatarColor: "linear-gradient(135deg, #5B9BD5, #7B68EE)", avatarInitial: "清" },
  { id: "u6", name: "硬核厨神", avatarColor: "linear-gradient(135deg, #E8782A, #4A5D4E)", avatarInitial: "厨" },
  { id: "u7", name: "数码测评师Leo", avatarColor: "linear-gradient(135deg, #2C3040, #5B9BD5)", avatarInitial: "L" },
  { id: "u8", name: "社交心理学博士", avatarColor: "linear-gradient(135deg, #7B68EE, #B8963E)", avatarInitial: "博" },
  { id: "u9", name: "老司机开车了", avatarColor: "linear-gradient(135deg, #4A5D4E, #E8782A)", avatarInitial: "司" },
  { id: "u10", name: "心智成长营", avatarColor: "linear-gradient(135deg, #5B9BD5, #4A5D4E)", avatarInitial: "心" },
];

const posts = [
  { title: "她说'随便'其实一点都不随便——解码隐性测试的5种模式", summary: "深度拆解社交中常见的隐性测试话术，帮你识别真实意图，不再被'随便'两个字坑到。", sectionId: "awareness", tags: ["情感认知", "社交技巧", "避坑指南"], isHot: true, isFeatured: true },
  { title: "红牌警示：这8种行为模式说明你正在被操控", summary: "整理了最常见的情感操控手段，每一条都是真实案例总结。早发现早止损。", sectionId: "awareness", tags: ["防操控", "红牌警示", "情感安全"], isHot: true },
  { title: "彩礼纠纷法律指南：保护你的合法权益", summary: "律师视角解读彩礼相关法律问题，包括返还条件、取证要点、诉讼流程。", sectionId: "awareness", tags: ["法律科普", "彩礼", "财产保护"], isFeatured: true },
  { title: "'这正常吗？' — 女友要求我每月工资全上交", summary: "投稿：交往3个月的女友要求我把工资卡交给她管理，说是'为了我们的未来'。", sectionId: "awareness", tags: ["这正常吗", "财务边界", "社区讨论"], isHot: true },
  { title: "识别PUA话术：从入门到精通的防身手册", summary: "系统整理PUA常见话术套路，包括打压式社交、否定人格、制造依赖等。", sectionId: "awareness", tags: ["PUA", "防身术", "情感安全"] },
  { title: "城市避坑地图：这些场所消费套路深", summary: "兄弟们投稿整理的各城市高风险消费场所，包括酒吧托、饭托、茶托等。", sectionId: "awareness", tags: ["避坑地图", "消费陷阱", "城市生活"] },
  { title: "分手后的自我重建：30天恢复计划", summary: "从心理学角度出发的分手恢复指南，不是鸡汤，是实操步骤。", sectionId: "awareness", tags: ["分手恢复", "心理建设", "自我提升"], isFeatured: true },
  { title: "为什么饭局上最先买单的人，往往不是最有钱的", summary: "从社交心理学角度分析饭局买单行为背后的动机和社会信号。", sectionId: "social", tags: ["社交心理", "饭局文化", "行为分析"], isHot: true, isFeatured: true },
  { title: "朋友圈鉴赏：晒奢侈品但不露logo是什么操作？", summary: "分析社交媒体上'低调炫富'行为的心理动机和社交信号。", sectionId: "social", tags: ["朋友圈", "社交信号", "心理分析"], isHot: true },
  { title: "账号人设识别：如何通过社交媒体判断一个人的真实水平", summary: "教你通过社交媒体内容分析一个人的真实社交地位和经济实力。", sectionId: "social", tags: ["人设识别", "社交媒体", "社交技巧"] },
  { title: "经典图鉴：社交平台10大行为模式", summary: "众包整理的社交平台常见行为模式，从'名媛拼单'到'凡尔赛'全收录。", sectionId: "social", tags: ["行为图鉴", "社交平台", "经典整理"], isFeatured: true },
  { title: "为什么你发的消息她总已读不回？", summary: "从社交动力学角度分析消息回复行为，帮你理解'已读不回'的真实含义。", sectionId: "social", tags: ["社交技巧", "消息回复", "社交心理"], isHot: true },
  { title: "职场社交：如何在不显得谄媚的情况下获得上司认可", summary: "职场中向上管理的正确姿势，区分'尊重'和'讨好'的边界。", sectionId: "social", tags: ["职场社交", "向上管理", "社交技巧"] },
  { title: "社交中的'沉没成本陷阱'：为什么你明知不该去还是去了", summary: "解析社交决策中的沉没成本谬误，帮你做出更理性的社交选择。", sectionId: "social", tags: ["社交心理", "理性决策", "认知提升"] },
  { title: "艾尔登法环DLC全流程无伤攻略｜附隐藏Boss位置", summary: "DLC《黄金树幽影》全Boss无伤打法详解，包含所有隐藏Boss位置和攻略路线。", sectionId: "gaming", tags: ["艾尔登法环", "攻略", "DLC"], isHot: true, isFeatured: true },
  { title: "2026年最值得入手的显卡推荐｜4060到4090全面对比", summary: "各价位段显卡性能横评，包含游戏实测帧数、功耗、性价比分析。", sectionId: "gaming", tags: ["显卡推荐", "硬件评测", "装机"], isFeatured: true },
  { title: "组队找人：周末晚上打Valorant排位", summary: "找2-3个稳定的排位队友，段位白银到铂金，时间周末晚上8-12点。", sectionId: "gaming", tags: ["组队", "Valorant", "排位"] },
  { title: "怀旧角落：盘点那些年我们一起玩过的FC经典", summary: "从超级马里奥到魂斗罗，回顾红白机时代最经典的游戏。", sectionId: "gaming", tags: ["怀旧", "FC", "经典游戏"] },
  { title: "原神5.0新版本深度评测：纳塔值得回坑吗？", summary: "从画面、玩法、氪金度三个维度深度评测原神纳塔版本。", sectionId: "gaming", tags: ["原神", "评测", "新版本"] },
  { title: "Steam夏促必买清单：50款打折神作推荐", summary: "精选50款Steam夏促折扣游戏，按价格区间分类，每款都有简评。", sectionId: "gaming", tags: ["Steam", "折扣", "推荐"], isHot: true },
  { title: "电竞周报：T1再夺LCK冠军，Faker还是那个男人", summary: "本周电竞赛事汇总，T1夺冠、转会期动态、新游电竞化进展。", sectionId: "gaming", tags: ["电竞", "T1", "LCK"] },
  { title: "新手三大项突破指南：从空杆到100kg的12周计划", summary: "为健身新手设计的12周力量训练计划，目标深蹲/卧推/硬拉各100kg。", sectionId: "fitness", tags: ["新手指南", "三大项", "训练计划"], isHot: true, isFeatured: true },
  { title: "身材进化记录：6个月从70kg到78kg的真实变化", summary: "记录半年的增肌过程，包括训练、饮食、补剂的详细数据和前后对比。", sectionId: "fitness", tags: ["身材进化", "增肌", "训练记录"], isHot: true },
  { title: "增肌饮食：打工人的平价高蛋白餐方案", summary: "不需要昂贵的食材，用超市能买到的东西做出每天150g蛋白质的餐食。", sectionId: "fitness", tags: ["饮食", "增肌", "平价方案"], isFeatured: true },
  { title: "家用健身装备评测：¥2000搞定一个家庭健身房", summary: "实测5款家用健身器材，帮你用最少的钱打造最高效的家庭训练空间。", sectionId: "fitness", tags: ["装备评测", "家用健身", "性价比"] },
  { title: "体态纠正：办公族最常见的5种体态问题和解决方案", summary: "圆肩、骨盆前倾、头前伸...办公族必看的体态纠正训练。", sectionId: "fitness", tags: ["体态纠正", "办公族", "健康"] },
  { title: "补剂红黑榜：哪些值得买，哪些是智商税", summary: "科学评测常见健身补剂，帮你把钱花在刀刃上。", sectionId: "fitness", tags: ["补剂评测", "科学健身", "避坑"], isHot: true },
  { title: "下班后靠这个副业月入8k，完整复盘和操作方法", summary: "分享我做自媒体副业的完整过程，从0到月入8k用了6个月。", sectionId: "finance", tags: ["副业", "自媒体", "实操分享"], isHot: true, isFeatured: true },
  { title: "投资踩坑实录：我在A股亏了30万学到的教训", summary: "从2021年入场到现在，我经历了追涨杀跌、听消息、满仓干的所有新手错误。", sectionId: "finance", tags: ["投资踩坑", "A股", "经验教训"], isHot: true },
  { title: "各城市买房策略：2026年刚需购房实操指南", summary: "从选城市、选区域、贷款策略到避坑，给刚需购房者的完整指南。", sectionId: "finance", tags: ["买房", "理财", "刚需指南"], isFeatured: true },
  { title: "自由职业3年：从月入3k到月入3w的真实经历", summary: "裸辞做自由职业的第3年，分享真实的收入曲线、时间管理和心态调整。", sectionId: "finance", tags: ["自由职业", "副业", "经验分享"] },
  { title: "理财入门：月薪8k也能存下第一桶金", summary: "从记账开始，教你用简单的预算管理实现每月强制储蓄。", sectionId: "finance", tags: ["理财入门", "储蓄", "预算管理"] },
  { title: "数字游民指南：在东南亚边旅行边工作", summary: "在泰国、越南、印尼做了6个月数字游民的完整经验分享。", sectionId: "finance", tags: ["数字游民", "远程工作", "旅行"] },
];

async function seed() {
  console.log("Seeding posts to Supabase...");

  const rows = posts.map((post, i) => {
    const user = users[i % users.length];
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id: `post-${i + 1}`,
      type: "image-text",
      section_id: post.sectionId,
      author_id: user.id,
      author_name: user.name,
      author_avatar_color: user.avatarColor,
      author_avatar_initial: user.avatarInitial,
      title: post.title,
      summary: post.summary,
      content: post.summary,
      cover_gradient: gradients[i % gradients.length],
      cover_aspect_ratio: 1.0,
      images: [],
      tags: post.tags,
      likes: Math.floor(Math.random() * 2000) + 100,
      comments: Math.floor(Math.random() * 200) + 10,
      bookmarks: Math.floor(Math.random() * 800) + 50,
      shares: Math.floor(Math.random() * 100) + 5,
      is_hot: post.isHot || false,
      is_featured: post.isFeatured || false,
      poll: null,
      created_at: date.toISOString(),
    };
  });

  const { data, error } = await supabase.from("posts").upsert(rows);

  if (error) {
    console.error("Seed failed:", error);
  } else {
    console.log(`Successfully seeded ${rows.length} posts!`);
  }
}

seed();

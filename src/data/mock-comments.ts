import type { Comment } from "@/types/comment";

const commentAuthors = [
  { id: "c1", name: "理性分析师", avatarColor: "linear-gradient(135deg, #5B9BD5, #2C3040)", avatarInitial: "理" },
  { id: "c2", name: "热心网友甲", avatarColor: "linear-gradient(135deg, #E8782A, #7B68EE)", avatarInitial: "甲" },
  { id: "c3", name: "过来人老张", avatarColor: "linear-gradient(135deg, #4A5D4E, #B8963E)", avatarInitial: "张" },
  { id: "c4", name: "数据党小明", avatarColor: "linear-gradient(135deg, #7B68EE, #E8782A)", avatarInitial: "明" },
  { id: "c5", name: "佛系青年", avatarColor: "linear-gradient(135deg, #2C3040, #5B9BD5)", avatarInitial: "佛" },
  { id: "c6", name: "杠精本精", avatarColor: "linear-gradient(135deg, #B8963E, #4A5D4E)", avatarInitial: "杠" },
  { id: "c7", name: "理性吃瓜", avatarColor: "linear-gradient(135deg, #5B9BD5, #7B68EE)", avatarInitial: "瓜" },
  { id: "c8", name: "实战派大佬", avatarColor: "linear-gradient(135deg, #E8782A, #4A5D4E)", avatarInitial: "实" },
];

function makeComment(
  id: string,
  postId: string,
  authorIdx: number,
  content: string,
  likes: number,
  isAnalysis: boolean,
  replies: Comment[] = []
): Comment {
  const daysAgo = Math.floor(Math.random() * 14) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id,
    postId,
    author: commentAuthors[authorIdx % commentAuthors.length],
    content,
    likes,
    isAnalysis,
    replies,
    createdAt: date.toISOString(),
  };
}

export const mockComments: Record<string, Comment[]> = {
  "post-1": [
    makeComment("cm1", "post-1", 0, "分析得很到位，特别是关于服从性测试那部分。我之前就是被这种套路坑了，花了很久才走出来。", 234, true, [
      makeComment("cm1r1", "post-1", 2, "同感，当时完全没意识到自己在被测试。现在回想起来真的是当局者迷。", 56, false),
    ]),
    makeComment("cm2", "post-1", 3, "补充一点：这种测试不只存在于两性关系中，职场和友谊中也大量存在。核心逻辑是一样的。", 189, true),
    makeComment("cm3", "post-1", 1, "说得太对了！我前任就经常用'随便'来测试我，每次都踩坑。", 145, false),
    makeComment("cm4", "post-1", 4, "其实有时候'随便'真的就是随便，不要过度解读。", 67, false, [
      makeComment("cm4r1", "post-1", 0, "这取决于频率和语境。偶尔一次可能是真的随便，但如果每次选择都说随便然后对你的决定不满意，那就是测试。", 89, true),
    ]),
    makeComment("cm5", "post-1", 7, "实战经验分享：遇到这种情况最好的策略是自信地做决定，然后观察反应。如果她不满意你的决定但不说出来，基本可以确认是测试。", 312, true),
    makeComment("cm6", "post-1", 5, "这不就是PUA理论吗？把女生想得太复杂了吧。", 23, false),
    makeComment("cm7", "post-1", 6, "我觉得关键是要区分有意识的操控和无意识的习惯。很多人说'随便'只是不想做决定，不一定是测试。", 156, true),
  ],
  "post-2": [
    makeComment("cm8", "post-2", 0, "第6条'贬低循环'太真实了。我前女友就是这样，先说我什么都做不好，然后再安慰我'没关系有我在'。", 445, true),
    makeComment("cm9", "post-2", 7, "补充一条：'爱的轰炸'——在关系初期过度投入，让你产生依赖后再开始操控。这也是常见手段。", 267, true),
    makeComment("cm10", "post-2", 2, "转发给身边需要的朋友看看，真的很有帮助。", 178, false),
    makeComment("cm11", "post-2", 3, "从心理学角度补充：被操控者往往有低自尊或焦虑型依恋的特点，所以提升自我认知是防御的第一步。", 334, true),
  ],
  "post-3": [
    makeComment("cm12", "post-3", 0, "终于有人从法律角度讲清楚了。建议所有准备结婚的兄弟都看看。", 189, true),
    makeComment("cm13", "post-3", 7, "实操建议：大额彩礼转账时备注'彩礼'两个字，将来万一有纠纷，这是最有力的证据。", 267, true),
    makeComment("cm14", "post-3", 1, "我们这边彩礼8万8，感觉还算合理。但听说有些地方要20-30万，太夸张了。", 123, false),
  ],
  "post-4": [
    makeComment("cm15", "post-4", 4, "3个月就要工资卡？这也太快了吧。建议至少交往1年以上再考虑财务合并。", 345, false),
    makeComment("cm16", "post-4", 0, "核心问题不是交不交卡，而是她用'你不信任我'来情感绑架你。这种沟通方式本身就有问题。", 478, true),
    makeComment("cm17", "post-4", 7, "建议开一个共同储蓄账户，双方都往里面存钱。这样既透明又不需要交出全部控制权。", 556, true),
    makeComment("cm18", "post-4", 5, "你月薪1.5w她8k，交卡之后她管钱的话，本质上你的财务安全就完全取决于她了。", 234, false),
  ],
  "post-8": [
    makeComment("cm19", "post-8", 0, "说到点子上了。'最先买单'的人不一定有钱，但一定想让别人觉得他有钱或者有权。", 289, true),
    makeComment("cm20", "post-8", 3, "观察了身边很多饭局，发现一个规律：真正的大佬通常在大家都尴尬的时候默默买单，而且不会让任何人知道。", 367, true),
    makeComment("cm21", "post-8", 1, "我觉得买单这件事不用想太多，谁方便谁买就行了。", 45, false),
    makeComment("cm22", "post-8", 6, "补充一个观察：在商务饭局中，买单的人和做决策的人往往不是同一个人。买单是服务者的角色，决策者是权力中心。", 234, true),
  ],
  "post-14": [
    makeComment("cm23", "post-14", 0, "无伤打法太牛了！隐藏Boss的位置我找了半天没找到，这个攻略帮大忙了。", 178, false),
    makeComment("cm24", "post-14", 3, "补充：第三个Boss用太刀的话，二阶段开场可以直接一套R1带走，省很多时间。", 234, true),
    makeComment("cm25", "post-14", 4, "200+小时才无伤？我800小时了还死在第二个Boss那里...", 456, false),
  ],
  "post-21": [
    makeComment("cm26", "post-21", 7, "这个计划写得很详细。补充一点：新手前两周不要急着加重量，先把动作做标准。错误的动作+大重量=受伤。", 345, true),
    makeComment("cm27", "post-21", 2, "跟练了4周，深蹲从40kg到65kg了！感谢分享。", 234, false),
    makeComment("cm28", "post-21", 0, "建议加入Deload周的安排，每4周减重一周，让身体恢复。很多人忽略这点导致过度训练。", 189, true),
  ],
  "post-28": [
    makeComment("cm29", "post-28", 0, "月入8k的副业收入已经超过很多人主业了。关键是坚持前3个月那段说得太对了。", 267, true),
    makeComment("cm30", "post-28", 3, "想问一下，你是在什么平台发的视频？抖音还是B站？", 134, false),
    makeComment("cm31", "post-28", 7, "6个月从零到8k这个增长速度算比较快的。大多数人可能需要12个月以上。建议补充一下你的内容差异化策略。", 198, true),
  ],
};

export function getCommentsByPostId(postId: string): Comment[] {
  return mockComments[postId] || [];
}

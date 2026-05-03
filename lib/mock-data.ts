export type SignalTone = "steady" | "promising" | "fragile" | "contested";
export type ReviewModeId = "evidence" | "conceptual" | "adversarial" | "editorial";

export interface DocumentSection {
  heading: string;
  zone: string;
  summary: string;
  paragraphs: string[];
}

export interface OverlayItem {
  label: string;
  summary: string;
}

export interface ReviewMapStep {
  step: string;
  emphasis: string;
}

export interface QuickSignal {
  label: string;
  value: string;
  tone: SignalTone;
}

export interface TrustDimension {
  name: string;
  state: string;
  note: string;
  width: number;
  tone: SignalTone;
}

export interface ReviewHistoryItem {
  stage: string;
  actor: string;
  date: string;
  note: string;
}

export interface ReviewerView {
  reviewer: string;
  stance: string;
  summary: string;
  bullets: string[];
}

export interface SecondaryMetric {
  label: string;
  value: string;
  note: string;
}

export interface WorkflowDraft {
  strongest: string;
  weakest: string;
  tryingToDo: string;
  uncertainty: string;
  changeAssessment: string;
  deeperReview: string;
  contestStructuredReading: string;
  revisePassport: string;
  secondary: SecondaryMetric[];
}

export interface DocumentCase {
  slug: string;
  profileLabel: string;
  title: string;
  shortTitle: string;
  author: string;
  type: string;
  submissionContext: string;
  landingSummary: string;
  previewNote: string;
  deck: string;
  textSections: DocumentSection[];
  overlay: {
    centralArgument: string;
    mainClaimZones: OverlayItem[];
    evidenceAreas: OverlayItem[];
    uncertaintyZones: OverlayItem[];
    reviewFocus: string[];
    reviewMap: ReviewMapStep[];
    reviewStatus: string;
    quickSignals: QuickSignal[];
  };
  passport: {
    currentSynthesis: string;
    strengths: string[];
    weaknesses: string[];
    readingStance: string;
    disagreement: string;
    verificationNeeds: string[];
    dimensions: TrustDimension[];
    reviewHistory: ReviewHistoryItem[];
    reviewerViews?: ReviewerView[];
  };
  workflow: WorkflowDraft;
}

export interface ReviewMode {
  id: ReviewModeId;
  label: string;
  description: string;
  focusPrompts: string[];
  watchFor: string;
  priorityDimensions: string[];
}

export const reviewModes: ReviewMode[] = [
  {
    id: "evidence",
    label: "Evidence-focused review",
    description:
      "Foreground where the text actually anchors claims to inspectable material, and where polished prose is standing in for support.",
    focusPrompts: [
      "Which claims have traceable support rather than illustrative examples?",
      "Where are proxies, borrowed statistics, or analogies doing too much work?",
      "What should be verified before anyone treats the document as operationally useful?"
    ],
    watchFor: "This mode can underrate conceptually promising work that is explicitly early-stage.",
    priorityDimensions: ["Evidence support", "Overclaim risk", "Review confidence"]
  },
  {
    id: "conceptual",
    label: "Conceptual review",
    description:
      "Test whether the text names a real problem, offers a distinct framing, and holds together at the level of concepts and categories.",
    focusPrompts: [
      "Does the text draw distinctions that help a specialist think better?",
      "Are key terms stable enough to support the argument it wants to make?",
      "Where is the text analytically ambitious, and where is it merely rhetorical?"
    ],
    watchFor: "This mode can over-reward elegant framing when empirical grounding is thin.",
    priorityDimensions: ["Originality", "Coherence", "Domain fit"]
  },
  {
    id: "adversarial",
    label: "Adversarial review",
    description:
      "Read against the text: look for weak joins, hidden assumptions, borrowed authority, and the easiest ways a skeptical specialist would challenge it.",
    focusPrompts: [
      "What would a domain critic attack first?",
      "Where does the text rely on a favorable reading to remain persuasive?",
      "Which claims collapse if one supporting premise fails?"
    ],
    watchFor: "This mode can flatten nuance and understate the value of partial but honest work.",
    priorityDimensions: ["Overclaim risk", "Evidence support", "Coherence"]
  },
  {
    id: "editorial",
    label: "Editorial relevance review",
    description:
      "Assess whether the text deserves more reader attention in a constrained queue, given its likely audience, maturity, and potential upside.",
    focusPrompts: [
      "Who would benefit from reading this next, if anyone?",
      "Is this a specialist review candidate, a conceptual conversation piece, or a low-priority item?",
      "What kind of outlet or review context fits the document as it currently exists?"
    ],
    watchFor: "This mode can compress substantive disagreement into queue management decisions.",
    priorityDimensions: ["Domain fit", "Review confidence", "Originality"]
  }
];

export const documentCases: DocumentCase[] = [
  {
    slug: "after-labor-and-capital",
    profileLabel: "Real book manuscript",
    title: "After Labor and Capital: The Political Economy of the Transitional Period",
    shortTitle: "After Labor and Capital",
    author: "Aleksei Voloshchuk",
    type: "Book manuscript / theoretical political economy",
    submissionContext:
      "Author-provided full book manuscript used here as a real Trust Layer first-reading example.",
    landingSummary: "Strong theoretical manuscript; needs specialist checking.",
    previewNote:
      "Real case: a book-length argument about information as a metafactor and verification as the new bottleneck.",
    deck:
      "The manuscript argues that information now reorganizes labor, capital, institutions, and growth, while verification becomes the binding constraint on turning signals into effective knowledge.",
    textSections: [
      {
        heading: "Information becomes a metafactor",
        zone: "Main claim",
        summary:
          "The manuscript reframes information as the condition that organizes labor, capital, institutions, and growth rather than as a separable fourth factor.",
        paragraphs: [
          "Source trace - Abstract, paragraph 29: This manuscript argues that information should no longer be treated merely as one factor among others, but as a metafactor that increasingly reorganizes labor, capital, institutions, and growth.",
          "Source trace - Introduction, paragraphs 125-131: Information should not be understood as a mere technical variable. It becomes the form through which labor, capital, institutions, and knowledge are organized. The transition period begins when the old categories still work, but no longer explain the main source of change."
        ]
      },
      {
        heading: "Verification becomes the bottleneck",
        zone: "Conceptual mechanism",
        summary:
          "The book's central mechanism is that signal generation becomes cheap faster than verification, selection, and institutional recognition.",
        paragraphs: [
          "Source trace - Preface, paragraphs 100-104: text generation may become dramatically cheaper, while verification, selection, refinement, and intellectual integration remain far slower and more costly. The manuscript names this limit the verification bottleneck, κ: the barrier separating a raw signal from reliable, verified, applicable knowledge.",
          "Source trace - Chapter 2, paragraphs 309-342: modern economies are increasingly constrained not by a deficit of signals but by the capacity to filter noise, verify results, and turn information into a reliable basis for action."
        ]
      },
      {
        heading: "The empirical support is real but indirect",
        zone: "Needs checking",
        summary:
          "The manuscript includes formal and empirical appendices, but the empirical tests are proxy-based and should not be read as final confirmation.",
        paragraphs: [
          "Source trace - Empirical appendix, paragraphs 2377-2380: the empirical section does not test the whole theory directly. It looks for indirect signs: a shift from generation to verification, faster labor-share decline in information-intensive settings, and country clusters by informational infrastructure.",
          "Source trace - Empirical appendix, paragraphs 2459-2461 and 2622-2626: the evidence is presented as a stable divergence between signal production and signal admission, but the manuscript also notes limitations in pricing series, PubMed proxies, Retraction Watch coverage, and causal identification."
        ]
      }
    ],
    overlay: {
      centralArgument:
        "Information is no longer just one input in production. It acts as a metafactor that reshapes the production function itself, while the verification bottleneck limits which signals become economically effective knowledge.",
      mainClaimZones: [
        {
          label: "Metafactor thesis",
          summary: "Information is treated as the form that reorganizes factors rather than as an additional input beside labor and capital."
        },
        {
          label: "Verification bottleneck",
          summary: "The main scarcity shifts from producing signals to selecting, validating, and institutionally recognizing them."
        },
        {
          label: "Transition-period claim",
          summary: "The book describes a historical interval where old economic categories still matter but no longer explain the main source of change."
        }
      ],
      evidenceAreas: [
        {
          label: "Formal appendix",
          summary: "The manuscript gives a formal structure for I*, κ, informational regimes, and regime-dependent production effects."
        },
        {
          label: "Empirical appendix",
          summary: "The evidence combines verification-lag indicators, platform-era labor-share patterns, and country clusters by informational infrastructure."
        },
        {
          label: "Self-verification posture",
          summary: "The manuscript explicitly treats AI-assisted writing as requiring stronger verification rather than less."
        }
      ],
      uncertaintyZones: [
        {
          label: "Conceptual stretch",
          summary: "The definition of information is intentionally broad. A specialist should check whether the metafactor concept adds explanatory power or absorbs too much."
        },
        {
          label: "Proxy and identification risk",
          summary: "The empirical appendix is useful but indirect. Verification capacity, I*, and κ remain difficult to measure cleanly."
        }
      ],
      reviewFocus: [
        "Check whether the metafactor distinction is genuinely different from technology, ideas, institutions, or knowledge capital.",
        "Check whether the formal model makes the verification bottleneck precise enough to test.",
        "Check whether the empirical appendix supports a regime-dependent claim rather than a simple AI-displacement story."
      ],
      reviewMap: [
        {
          step: "Conceptual check",
          emphasis: "Ask whether the book's main category clarifies economic change or becomes too elastic."
        },
        {
          step: "Model check",
          emphasis: "Inspect how I*, κ, labor share, and institutional verification are linked."
        },
        {
          step: "Empirical check",
          emphasis: "Review proxy validity, identification limits, and whether the evidence fits the theoretical burden."
        }
      ],
      reviewStatus:
        "Real manuscript case. This is a provisional first reading, not expert review and not validation of the book's claims.",
      quickSignals: [
        { label: "Conceptual architecture", value: "Currently coherent", tone: "steady" },
        { label: "Evidence support", value: "Partial but inspectable", tone: "steady" },
        { label: "Overclaim risk", value: "Needs attention", tone: "fragile" },
        { label: "Review priority", value: "Specialist review warranted", tone: "promising" }
      ]
    },
    passport: {
      currentSynthesis:
        "This reads as a serious theoretical manuscript with a clear central architecture: information as metafactor, verification as bottleneck, and political economy as the struggle over legitimate knowledge. The case warrants specialist review, not a final trust judgment.",
      strengths: [
        "The manuscript has a strong organizing concept that links production theory, institutions, AI, and verification without reducing the argument to a simple automation story.",
        "The text makes its claims checkable by including formal and empirical appendices rather than leaving the thesis at the level of manifesto.",
        "It is self-aware about verification: the manuscript explicitly treats AI-assisted writing as requiring stronger checking rather than less."
      ],
      weaknesses: [
        "The concept of information is very broad, so a reviewer should check whether the metafactor thesis remains discriminating enough.",
        "The empirical appendix is proxy-based and may not fully carry the theoretical burden placed on κ, I*, and verification capacity.",
        "Some political-economic conclusions may outrun what the formal and empirical material can establish at this stage."
      ],
      readingStance:
        "Read as a serious book manuscript that deserves conceptual review by political economists and methodological review of the empirical appendix.",
      disagreement:
        "Likely disagreement will not be about whether the manuscript is serious. It will be about whether 'information as metafactor' is a necessary new category or a broad relabeling of technology, institutions, and knowledge.",
      verificationNeeds: [
        "Check the formal appendix for whether κ and I* are defined tightly enough to do real explanatory work.",
        "Review empirical proxies for verification capacity, labor-share dynamics, platform-era effects, and country clustering.",
        "Compare the argument against adjacent literatures on Hayek, Romer, North, endogenous growth, intangible capital, and platform power."
      ],
      dimensions: [
        {
          name: "Originality",
          state: "High but contested",
          note: "The metafactor frame is ambitious and distinctive, though it needs comparison with adjacent concepts.",
          width: 82,
          tone: "steady"
        },
        {
          name: "Coherence",
          state: "Currently coherent",
          note: "The main architecture holds across the abstract, introduction, conceptual chapters, and appendices.",
          width: 78,
          tone: "steady"
        },
        {
          name: "Evidence grounding",
          state: "Partial and inspectable",
          note: "The empirical material supports a plausible pattern but not a final causal demonstration.",
          width: 62,
          tone: "steady"
        },
        {
          name: "Overclaim restraint",
          state: "Needs checking",
          note: "The transition-period claim is broad enough to require careful bounding.",
          width: 54,
          tone: "fragile"
        },
        {
          name: "Review stability",
          state: "Specialist review needed",
          note: "Confidence is enough to recommend review, not enough to settle the argument.",
          width: 70,
          tone: "promising"
        }
      ],
      reviewHistory: [
        {
          stage: "Submission",
          actor: "Author",
          date: "March 24, 2026",
          note: "Full draft manuscript provided for a real Trust Layer first-reading case."
        },
        {
          stage: "Structured reading",
          actor: "Trust Layer prototype",
          date: "May 3, 2026",
          note: "Mapped central architecture, source traces, uncertainty zones, and specialist review needs."
        },
        {
          stage: "Review note",
          actor: "Prototype facilitator",
          date: "May 3, 2026",
          note: "Kept the case provisional and avoided converting first reading into validation."
        }
      ]
    },
    workflow: {
      strongest:
        "The manuscript is strongest where it links the metafactor thesis to a concrete bottleneck: verification, selection, and institutional recognition become the scarce layer after signal generation becomes cheap.",
      weakest:
        "It is weakest where the empirical proxies are asked to carry a broad theoretical claim about the transformation of political economy.",
      tryingToDo:
        "The text is trying to rebuild economic explanation around information as the organizing condition of production, institutions, and distribution.",
      uncertainty:
        "My assessment remains uncertain around category boundaries, empirical identification, and whether the political conclusions follow from the mechanism rather than from adjacent normative commitments.",
      changeAssessment:
        "I would revise upward if a specialist review finds that κ and I* are operationalized in a way that survives comparison with simpler concepts.",
      deeperReview:
        "Yes. Recommend deeper checking by a political economist, a growth-theory reader, and a methods reviewer for the empirical appendix.",
      contestStructuredReading:
        "Yes. I would contest any reading that treats this as empirically settled. The safer reading is: serious theoretical architecture with partial, inspectable empirical support.",
      revisePassport:
        "Yes. Revise the review note after checking the formal appendix, empirical appendix, and adjacent literatures.",
      secondary: [
        {
          label: "Originality",
          value: "High",
          note: "The metafactor frame is ambitious and distinctive, though it needs comparison with adjacent concepts."
        },
        {
          label: "Coherence",
          value: "Currently coherent",
          note: "The main architecture holds across the abstract, introduction, conceptual chapters, and appendices."
        },
        {
          label: "Evidence support",
          value: "Partial",
          note: "The empirical material supports a plausible pattern but not a final causal demonstration."
        },
        {
          label: "Overclaim risk",
          value: "Needs attention",
          note: "The transition-period claim is broad enough to require careful bounding."
        },
        {
          label: "Review confidence",
          value: "Moderate",
          note: "Confidence is enough to recommend review, not enough to settle the argument."
        },
        {
          label: "Domain fit",
          value: "High",
          note: "Best suited for theory, political economy, and methods review."
        }
      ]
    }
  },
  {
    slug: "ai-job-quality-working-paper",
    profileLabel: "Real policy working paper",
    title: "The Impact of Artificial Intelligence on the Nature and Quality of Jobs",
    shortTitle: "AI and job quality",
    author: "Laura Nurski and Mia Hoffmann",
    type: "Working paper / policy research review",
    submissionContext:
      "Bruegel Working Paper 14/2022, used here as a real Trust Layer first-reading example.",
    landingSummary:
      "Solid policy paper; worth short specialist check before deeper use.",
    previewNote: "Real case: a policy working paper linking workplace AI use cases to job quality and worker participation.",
    deck:
      "The paper argues that AI changes job quality through job design: automation rebundles tasks, while algorithmic management changes autonomy, skill use, workload, and employment conditions.",
    textSections: [
      {
        heading: "AI is read through job design, not just automation",
        zone: "Main claim",
        summary:
          "The paper connects AI to the division of labour inside organisations and to the resulting quality of jobs.",
        paragraphs: [
          "The source paper states that AI changes the division of labour and the resulting design of jobs. Automation changes task bundles, while algorithmic management reaches into workers' control, autonomy, skill use, and workload.",
          "The paper grounds this in a job-design vocabulary of job breadth and depth: horizontal specialisation shapes task variety, while vertical specialisation shapes control over how, when, and why work is done."
        ]
      },
      {
        heading: "Use cases matter because they affect workers differently",
        zone: "Evidence-bearing area",
        summary:
          "The paper separates automation from algorithmic scheduling, work-method instructions, surveillance, evaluation, discipline, and task coordination.",
        paragraphs: [
          "The authors focus on organisational function rather than product type because the same technology can support or prescribe work depending on how it is used.",
          "The paper's useful distinction between supportive and prescriptive uses still needs checking, because real workplace systems often combine scheduling, monitoring, feedback and discipline."
        ]
      },
      {
        heading: "The policy claim rests on participation and power",
        zone: "Review focus",
        summary:
          "The paper argues that worker participation, social partners, and labour regulation are needed to mitigate harmful workplace AI effects.",
        paragraphs: [
          "The source frames harmful AI effects as design choices shaped by organisational power, not as technologically predetermined outcomes.",
          "Its policy section points to GDPR, the proposed AI Act and platform-work rules, while arguing that workplace AI risks go beyond conventional health, safety and privacy categories."
        ]
      }
    ],
    overlay: {
      centralArgument:
        "AI should be assessed by its organisational use case and its effects on job design, not only by whether it automates tasks or raises productivity.",
      mainClaimZones: [
        {
          label: "Job-design lens",
          summary: "AI affects job quality through task bundles, control over work, autonomy, skill use, workload and working conditions."
        },
        {
          label: "Use-case typology",
          summary: "The paper separates automation from algorithmic management functions such as scheduling, instructions, surveillance, evaluation, discipline and coordination."
        },
        {
          label: "Power and participation",
          summary: "Workplace AI design reflects organisational power, so worker participation and social partners are central safeguards."
        }
      ],
      evidenceAreas: [
        {
          label: "Literature review base",
          summary: "The review draws on scientific reviews, micro-level empirical research, qualitative case studies, reports, books and news articles."
        },
        {
          label: "Mechanism examples",
          summary: "Examples include shift scheduling, warehouse instructions, call-centre feedback, performance dashboards and platform work."
        }
      ],
      uncertaintyZones: [
        {
          label: "Evidence aggregation",
          summary: "The evidence base is wide but heterogeneous; sector-to-sector transfer needs careful checking."
        },
        {
          label: "Policy translation",
          summary: "The paper identifies important regulatory gaps, but implementation and enforcement questions remain compressed."
        }
      ],
      reviewFocus: [
        "Check whether the use-case typology covers the main workplace AI modes without over-combining distinct systems.",
        "Assess how strongly the evidence supports the prescriptive-versus-supportive claim across sectors.",
        "Review the policy translation with labour-law and industrial-relations expertise."
      ],
      reviewMap: [
        {
          step: "Structure check",
          emphasis: "Confirm that the paper's job-design frame is the right organizing lens."
        },
        {
          step: "Evidence check",
          emphasis: "Look at whether the case literature is used proportionately."
        },
        {
          step: "Policy check",
          emphasis: "Ask what follows for EU regulation, worker participation and social partners."
        }
      ],
      reviewStatus: "Prepared first reading only. Source traces help checking; they do not prove the interpretation.",
      quickSignals: [
        { label: "Policy relevance", value: "High", tone: "promising" },
        { label: "Evidence support", value: "Moderate", tone: "promising" },
        { label: "What needs checking", value: "Sector transfer", tone: "fragile" },
        { label: "Review priority", value: "Worth targeted review", tone: "promising" }
      ]
    },
    passport: {
      currentSynthesis:
        "This is a serious and useful policy working paper. Its core frame is clear: AI affects job quality through task design and organisational control. It deserves targeted review, especially on evidence aggregation and policy translation.",
      strengths: [
        "Gives the AI-and-work debate a concrete job-design frame rather than staying at the level of automation anxiety.",
        "Separates organisational use cases, which makes the review more useful than a generic AI-impact summary.",
        "Connects empirical workplace examples to a clear policy emphasis on worker participation and social partners."
      ],
      weaknesses: [
        "The evidence base is broad and mixed; sector-to-sector transfer needs careful checking.",
        "Some categories overlap in real systems, so the typology may look cleaner than workplace practice.",
        "The policy section identifies important gaps but leaves implementation and enforcement questions relatively compressed."
      ],
      readingStance:
        "Read as a strong policy research review. Use it for orientation and agenda-setting after a short specialist check, not as a settled empirical verdict.",
      disagreement:
        "Likely disagreement concerns how far the paper's literature review supports general claims across sectors, and how directly the policy recommendations follow.",
      verificationNeeds: [
        "Check whether the supportive-versus-prescriptive distinction holds across the cited case literature.",
        "Review legal claims about GDPR, the AI Act proposal, and the platform work directive with labour-law expertise.",
        "Ask whether worker participation is specified enough for institutional design, not only as a principle."
      ],
      dimensions: [
        {
          name: "Originality",
          state: "Moderate",
          note: "The frame combines known job-design theory with AI workplace policy in a useful way.",
          width: 62,
          tone: "promising"
        },
        {
          name: "Coherence",
          state: "Currently coherent",
          note: "The paper has a clear sequence from definitions to typology, evidence, participation and policy.",
          width: 81,
          tone: "promising"
        },
        {
          name: "Evidence grounding",
          state: "Moderate",
          note: "Broad review, but heterogeneous sources need careful weighting.",
          width: 66,
          tone: "promising"
        },
        {
          name: "Overclaim restraint",
          state: "Mostly careful",
          note: "Most claims are framed cautiously, though policy translation remains compressed.",
          width: 74,
          tone: "promising"
        },
        {
          name: "Review stability",
          state: "Ready for short review",
          note: "Enough confidence for targeted review, not enough for final policy reliance.",
          width: 78,
          tone: "promising"
        }
      ],
      reviewHistory: [
        {
          stage: "Source intake",
          actor: "Trust Layer demo",
          date: "May 3, 2026",
          note: "Real Bruegel working paper added as the second example case."
        },
        {
          stage: "Structured reading",
          actor: "Prototype facilitator",
          date: "May 3, 2026",
          note: "Separated job-design frame, evidence base, uncertainty zones and policy review needs."
        },
        {
          stage: "Review note gate",
          actor: "Prototype facilitator",
          date: "May 3, 2026",
          note: "Recommended targeted review rather than final policy reliance."
        }
      ]
    },
    workflow: {
      strongest:
        "The paper is strongest where it translates AI impact into job design: autonomy, skill use, workload, task breadth and depth, and organisational control.",
      weakest:
        "What needs checking is not the basic frame but the strength of generalisation across heterogeneous sectors and case studies.",
      tryingToDo:
        "The paper is trying to move AI policy from generic automation talk toward job quality, worker power and participatory governance.",
      uncertainty:
        "Uncertainty remains around evidence aggregation, category overlap in real algorithmic systems, and the institutional path from principle to enforcement.",
      changeAssessment:
        "A stronger sector-by-sector evidence table or clearer legal implementation pathway would increase confidence.",
      deeperReview:
        "Yes. It merits short specialist review by someone with labour economics, work design, or industrial-relations expertise.",
      contestStructuredReading:
        "I would not contest the main structure, but I would keep the evidence and policy translation open for checking.",
      revisePassport:
        "Yes. Revise the review note after checking the cited evidence base and the legal-policy section.",
      secondary: [
        {
          label: "Originality",
          value: "Moderate",
          note: "The frame combines known job-design theory with AI workplace policy in a useful way."
        },
        {
          label: "Coherence",
          value: "High",
          note: "The paper has a clear sequence from definitions to typology, evidence, participation and policy."
        },
        {
          label: "Evidence support",
          value: "Moderate",
          note: "Broad review, but heterogeneous sources need careful weighting."
        },
        {
          label: "Overclaim risk",
          value: "Low to moderate",
          note: "Most claims are framed cautiously, though policy translation remains compressed."
        },
        {
          label: "Review confidence",
          value: "Moderate-high",
          note: "Enough confidence for targeted review, not enough for final policy reliance."
        },
        {
          label: "Domain fit",
          value: "High",
          note: "Strong fit for labour, workplace AI and EU policy readers."
        }
      ]
    }
  },
  {
    slug: "ai-ready-regions",
    profileLabel: "Polished but shallow text",
    title: "AI-Ready Regions: A Practical Framework for Civic Transformation",
    shortTitle: "AI-ready regions",
    author: "Northbridge Strategy Lab",
    type: "White paper",
    submissionContext:
      "Prepared as sponsor-facing thought leadership for regional development agencies and economic strategy teams.",
    landingSummary:
      "Clear structure but low conceptual novelty, weak evidence integrity, and low priority for deeper review.",
    previewNote: "Failure case: persuasive packaging with limited analytical depth.",
    deck:
      "The paper packages a regional AI transformation framework in confident managerial language, but most claims rest on recycled categories, thin citations, and exemplar inflation.",
    textSections: [
      {
        heading: "The structure is competent, but the framework is generic",
        zone: "Claim zone",
        summary:
          "The paper proposes a four-part readiness model, yet each category mirrors familiar consulting tropes.",
        paragraphs: [
          "The document is professionally assembled. It opens with a problem statement, introduces a maturity framework, and closes with action steps for civic leaders. The difficulty is not readability. The difficulty is that almost every category in the framework could be transplanted from a generic digital-transformation deck with only minor wording changes.",
          "Terms like talent, governance, infrastructure, and innovation ecosystem are presented as if the paper were carving a new analytical path. In practice, the framework mainly repackages existing management vocabulary without clarifying what specifically changes when the subject becomes regional AI adoption."
        ]
      },
      {
        heading: "Citations and examples create an impression of support stronger than the document earns",
        zone: "Evidence-bearing area",
        summary:
          "The white paper relies on selective benchmarks and thinly described case examples that do not clearly support the larger claims.",
        paragraphs: [
          "Several headline claims rely on broad industry forecasts, but the connection between those forecasts and the paper's regional prescriptions is underspecified. Meanwhile, the case examples are too compressed to show whether the cited regions actually succeeded for the reasons the paper implies.",
          "This is not fabricated nonsense. It is a more familiar problem: evidence is handled in a way that produces confidence cues without building a sturdy inferential chain. The reader gets polished reassurance rather than a clearly inspectable argument."
        ]
      },
      {
        heading: "The document is more useful as a sponsor signal than as an analytical contribution",
        zone: "Interpretive uncertainty",
        summary:
          "The strongest explanation of the paper may be reputational or commercial rather than analytical.",
        paragraphs: [
          "One plausible reading is that the white paper exists to position the lab as fluent in AI strategy language for public-sector clients. On that reading, the document succeeds in tone and packaging while remaining comparatively weak as analysis.",
          "That does not mean it has zero value. It may still help non-specialist stakeholders orient to a conversation. But the current text gives little reason to prioritize it for deeper review when specialist time is scarce."
        ]
      }
    ],
    overlay: {
      centralArgument:
        "Regions need a structured AI-readiness framework, but the current paper mostly offers polished packaging rather than a robust analytical model.",
      mainClaimZones: [
        {
          label: "Framework claim",
          summary: "A four-part maturity model is presented as practical guidance for civic AI strategy."
        },
        {
          label: "Evidence posture",
          summary: "Benchmarks and case examples are used to signal support, though the support remains thin."
        },
        {
          label: "Likely function",
          summary: "The paper may operate more as sponsor-facing positioning than as strong analysis."
        }
      ],
      evidenceAreas: [
        {
          label: "Industry forecasts",
          summary: "Forecasts are cited but weakly connected to specific regional recommendations."
        },
        {
          label: "Compressed case examples",
          summary: "Examples gesture toward success stories without giving enough causal detail."
        }
      ],
      uncertaintyZones: [
        {
          label: "Analytical contribution",
          summary: "It is unclear whether the paper contributes much beyond familiar management language."
        },
        {
          label: "Audience value",
          summary: "The paper may still orient newcomers, even if it does not merit specialist attention."
        }
      ],
      reviewFocus: [
        "Check whether any of the framework elements actually add analytical distinction.",
        "Trace citations to see whether evidence is being stretched beyond what it supports.",
        "Treat sponsor polish as separate from analytical depth."
      ],
      reviewMap: [
        {
          step: "Surface read",
          emphasis: "Distinguish design quality and communication discipline from substantive contribution."
        },
        {
          step: "Citation check",
          emphasis: "Inspect whether benchmarks and case studies justify the claims attached to them."
        },
        {
          step: "Priority decision",
          emphasis: "Likely deprioritize for deeper review unless a specific stakeholder-use case justifies it."
        }
      ],
      reviewStatus: "Illustrative structured reading only. This mock output should not be read as reliable automated interpretation.",
      quickSignals: [
        { label: "Presentation discipline", value: "High", tone: "promising" },
        { label: "Conceptual novelty", value: "Low", tone: "fragile" },
        { label: "Evidence integrity", value: "Weak", tone: "fragile" },
        { label: "Deeper review priority", value: "Low", tone: "fragile" }
      ]
    },
    passport: {
      currentSynthesis:
        "The paper is readable and professionally composed, but its analytical value appears limited. It offers a tidy frame with weak evidentiary integrity and little conceptual distinction, making it a low-priority candidate for deeper review.",
      strengths: [
        "Clear structure and legible executive-summary style packaging.",
        "Could help orient non-specialist readers to a broad topic area.",
        "Maintains a consistent tone and presentation standard."
      ],
      weaknesses: [
        "Framework categories are generic and weakly differentiated.",
        "Evidence is used more as reassurance than as a robust argumentative base.",
        "The text gives little reason to believe it advances the conversation for expert readers."
      ],
      readingStance:
        "Read quickly, if at all, as polished orientation material rather than as a serious analytical contribution.",
      disagreement:
        "There may be mild disagreement about whether the paper is serviceable orientation material, but not much disagreement about its low specialist priority.",
      verificationNeeds: [
        "Trace key citations and determine whether they actually support the claims attached to them.",
        "Ask whether the framework differs materially from standard digital-transformation templates.",
        "Clarify whether the document's purpose is analytical contribution or sponsor positioning."
      ],
      dimensions: [
        {
          name: "Originality",
          state: "Low",
          note: "The framework looks familiar and weakly differentiated.",
          width: 24,
          tone: "fragile"
        },
        {
          name: "Coherence",
          state: "Superficially strong",
          note: "The document is tidy, but its internal order exceeds its analytical depth.",
          width: 57,
          tone: "fragile"
        },
        {
          name: "Evidence grounding",
          state: "Weak",
          note: "Support is thin and often more gestural than probative.",
          width: 28,
          tone: "fragile"
        },
        {
          name: "Overclaim restraint",
          state: "Mixed to weak",
          note: "Managerial confidence exceeds the argument's actual robustness.",
          width: 39,
          tone: "fragile"
        },
        {
          name: "Review stability",
          state: "Relatively stable",
          note: "Different readers are unlikely to produce sharply divergent trust profiles.",
          width: 69,
          tone: "steady"
        }
      ],
      reviewHistory: [
        {
          stage: "Submission",
          actor: "Editorial triage",
          date: "April 9, 2026",
          note: "Initially looked stronger than average because of packaging quality."
        },
        {
          stage: "Structured reading",
          actor: "Internal reviewer",
          date: "April 15, 2026",
          note: "Marked as polished but analytically shallow after citation and novelty checks."
        },
        {
          stage: "Passport update",
          actor: "Prototype facilitator",
          date: "April 19, 2026",
          note: "Set to low-priority status without claiming the text is useless in all contexts."
        }
      ]
    },
    workflow: {
      strongest:
        "The strongest aspect is communication discipline: the paper is organized, legible, and easy for a sponsor or non-specialist reader to absorb.",
      weakest:
        "It is weakest on conceptual distinction and evidentiary integrity. The paper signals authority more than it earns it.",
      tryingToDo:
        "The document appears to be trying to position a region-facing AI strategy framework as both practical and inevitable.",
      uncertainty:
        "My assessment remains mildly uncertain only around its limited orientation value for novice readers.",
      changeAssessment:
        "I would revise upward if the authors could show that their framework produces decisions meaningfully different from standard digital-transformation models. I would revise downward if key citations fail basic scrutiny.",
      deeperReview:
        "Probably not. Deeper review would make sense only if a stakeholder specifically needed to assess its sponsor or market role.",
      contestStructuredReading:
        "No major contest. If anything, I would make the current reading slightly more direct about the gap between polish and depth.",
      revisePassport:
        "Only if citation review uncovers either stronger support than expected or more serious evidence inflation than is currently visible.",
      secondary: [
        {
          label: "Originality",
          value: "Low",
          note: "The framework adds little beyond familiar consulting categories."
        },
        {
          label: "Coherence",
          value: "Moderate on the surface",
          note: "The paper is ordered, though not especially deep."
        },
        {
          label: "Evidence support",
          value: "Low",
          note: "Support is selective and weakly connected to the claims."
        },
        {
          label: "Overclaim risk",
          value: "Moderate to high",
          note: "Presentation confidence outpaces analytical warrant."
        },
        {
          label: "Review confidence",
          value: "Fairly high",
          note: "The trust profile looks comparatively stable."
        },
        {
          label: "Domain fit",
          value: "Low for specialist review",
          note: "Better suited to quick orientation than to expert attention."
        }
      ]
    }
  },
  {
    slug: "civic-provenance-ledger",
    profileLabel: "Ambiguous / contested text",
    title: "A Civic Provenance Ledger for Research Procurement",
    shortTitle: "Civic provenance ledger",
    author: "Marta Levin and Kai Soto",
    type: "Analytical essay / hybrid proposal",
    submissionContext:
      "Shared with a public-sector innovation lab exploring new procurement rules for commissioned research and advisory work.",
    landingSummary:
      "Disagreement across reviewers, unstable trust profile, and unresolved current trust state requiring domain-specific follow-up.",
    previewNote: "Ambiguity case: disagreement remains visible and no stable trust profile exists yet.",
    deck:
      "The essay proposes a provenance ledger for commissioned research outputs, but readers disagree sharply over whether it is a governance innovation or a category error wrapped in procedural fluency.",
    textSections: [
      {
        heading: "The proposal begins from a real concern about outsourced epistemic opacity",
        zone: "Claim zone",
        summary:
          "The essay argues that public institutions increasingly commission analysis whose evidentiary lineage is hard to inspect after delivery.",
        paragraphs: [
          "Levin and Soto start from an intelligible problem: commissioned research often arrives as a polished output with thin visibility into intermediate sourcing, subcontracting, prompt use, or interpretive handoffs. When public agencies later need to revisit how a recommendation was formed, much of that trail has already collapsed.",
          "On a sympathetic reading, the authors are trying to design a governance layer for analytical procurement in conditions where AI-assisted production and outsourced synthesis have made provenance more important, not less."
        ]
      },
      {
        heading: "The ledger concept is analytically suggestive but structurally unstable",
        zone: "Interpretive uncertainty",
        summary:
          "Some readers see a tractable audit layer; others see a confused import of traceability metaphors into contexts that remain deeply interpretive.",
        paragraphs: [
          "The proposed ledger would record source classes, material transformations, model-assisted steps, reviewer interventions, and unresolved objections across the life of a commissioned output. In theory this creates a legible trail of analytical production rather than a single end-state document.",
          "The difficulty is that provenance in analytical work is not equivalent to provenance in material supply chains. Interpretive leaps, framing choices, and contested synthesis steps may not become clearer merely because they are logged. One reviewer therefore reads the proposal as a useful transparency scaffold, while another reads it as false procedural solidity."
        ]
      },
      {
        heading: "Reviewers disagree on whether the text is disciplined or overextended",
        zone: "Evidence-bearing area",
        summary:
          "The same sections read to one reviewer as responsibly scoped and to another as quietly overclaiming what procedural traceability can accomplish.",
        paragraphs: [
          "The essay contains self-limiting language. It repeatedly says the ledger would not determine truth or settle interpretation. That restraint helps the sympathetic reading: perhaps the proposal is merely a bounded overlay for commissioned analytical texts, not a universal solution.",
          "Yet the skeptical reading remains live because the document also implies that improved provenance records could materially stabilize trust in outsourced analysis. Whether that implication is modest and sensible or subtly overextended is precisely where the trust profile becomes unstable."
        ]
      }
    ],
    overlay: {
      centralArgument:
        "Public-sector commissioned analysis may benefit from a provenance layer that records how analytical outputs were assembled, but it is unclear whether the proposed ledger clarifies interpretation or merely formalizes it.",
      mainClaimZones: [
        {
          label: "Problem diagnosis",
          summary: "Outsourced and AI-assisted analytical production creates real opacity around how conclusions were assembled."
        },
        {
          label: "Governance proposal",
          summary: "A provenance ledger would preserve more of the production trail for commissioned analytical texts."
        },
        {
          label: "Trust implication",
          summary: "The text hints that better provenance could improve warranted trust, but the extent of that claim is contested."
        }
      ],
      evidenceAreas: [
        {
          label: "Procurement examples",
          summary: "Examples of commissioned research opacity make the problem plausible but do not yet validate the proposed mechanism."
        },
        {
          label: "Scope disclaimers",
          summary: "The essay repeatedly says it is not building a truth engine, which matters for the favorable reading."
        }
      ],
      uncertaintyZones: [
        {
          label: "Category fit",
          summary: "It is unsettled whether provenance logging meaningfully maps onto interpretive analytical work."
        },
        {
          label: "Governance effect",
          summary: "Better records may help oversight, but they may not stabilize trust in the way the text sometimes implies."
        },
        {
          label: "Adoption incentives",
          summary: "The burden on authors and contractors could trigger strategic compliance rather than substantive transparency."
        }
      ],
      reviewFocus: [
        "Clarify the strongest version of the claim before deciding whether the proposal is serious or confused.",
        "Ask where provenance records genuinely help and where interpretive disagreement remains untouched.",
        "Bring procurement, administrative law, and knowledge-governance expertise into the next review step."
      ],
      reviewMap: [
        {
          step: "Claim narrowing",
          emphasis: "Define whether the ledger is meant as an audit aid, a trust aid, or both."
        },
        {
          step: "Conceptual challenge",
          emphasis: "Test whether provenance can travel from material traceability to interpretive analytical production."
        },
        {
          step: "Governance follow-up",
          emphasis: "Review procurement burden, incentives, and compliance gaming risk."
        },
        {
          step: "Passport hold",
          emphasis: "Maintain provisional disagreement rather than collapse the profile into a single verdict."
        }
      ],
      reviewStatus: "Illustrative structured reading only. Human readers still disagree over the text's basic profile.",
      quickSignals: [
        { label: "Interpretive stability", value: "Contested", tone: "contested" },
        { label: "Evidence grounding", value: "Partial", tone: "fragile" },
        { label: "Operational relevance", value: "Unclear", tone: "contested" },
        { label: "Need for follow-up", value: "High", tone: "promising" }
      ]
    },
    passport: {
      currentSynthesis:
        "No stable trust profile exists yet. One reading sees a bounded governance overlay for commissioned analytical texts; another sees a procedural shell that risks overstating what provenance can do for interpretation.",
      strengths: [
        "Starts from a real procurement problem rather than a purely abstract anxiety.",
        "Includes explicit scope limits that resist the strongest truth-engine reading.",
        "May provide a useful vocabulary for discussing outsourced analytical provenance."
      ],
      weaknesses: [
        "The key category move from provenance to interpretive analytical work remains undertheorized.",
        "Mechanism claims rely more on plausibility than on validated governance outcomes.",
        "The administrative burden and strategic adaptation risks are acknowledged but not robustly modeled."
      ],
      readingStance:
        "Read with active disagreement preserved. Treat the proposal as unresolved and in need of domain-specific follow-up rather than as either validated innovation or obvious error.",
      disagreement:
        "Reviewer disagreement is substantive, not cosmetic. The core dispute is about whether the proposal has found a useful bounded intervention or imported traceability logic into a domain where it does not fit cleanly.",
      verificationNeeds: [
        "Clarify whether the strongest defensible claim is auditability, trust calibration, or procurement discipline.",
        "Test the proposal against real procurement workflows and administrative-law constraints.",
        "Assess author and contractor burden, including strategic compliance behavior.",
        "Compare against less formal alternatives such as structured disclosure appendices or bounded review passports."
      ],
      dimensions: [
        {
          name: "Originality",
          state: "High but unstable",
          note: "The idea is distinctive, but its value depends on a contested category move.",
          width: 79,
          tone: "contested"
        },
        {
          name: "Coherence",
          state: "Mixed",
          note: "Some sections are disciplined; others appear to smuggle in stronger trust implications.",
          width: 52,
          tone: "contested"
        },
        {
          name: "Evidence grounding",
          state: "Partial",
          note: "Problem examples are plausible, but mechanism validation is weak.",
          width: 38,
          tone: "fragile"
        },
        {
          name: "Overclaim restraint",
          state: "Contested",
          note: "Self-limiting language exists, yet some reviewers think the implied promise still runs too far.",
          width: 46,
          tone: "contested"
        },
        {
          name: "Review stability",
          state: "Low",
          note: "Current readings diverge enough that no single settled passport should be inferred.",
          width: 24,
          tone: "contested"
        }
      ],
      reviewHistory: [
        {
          stage: "Initial read",
          actor: "Innovation lab editor",
          date: "April 10, 2026",
          note: "Marked as unusually relevant to current procurement anxieties but conceptually hard to place."
        },
        {
          stage: "Reviewer A memo",
          actor: "Governance reviewer",
          date: "April 14, 2026",
          note: "Argued that the proposal offers a bounded transparency scaffold worth prototyping."
        },
        {
          stage: "Reviewer B memo",
          actor: "Research methods reviewer",
          date: "April 16, 2026",
          note: "Argued that the proposal confuses procedural logging with warranted interpretive trust."
        },
        {
          stage: "Passport hold",
          actor: "Prototype facilitator",
          date: "April 21, 2026",
          note: "Kept the passport explicitly unresolved rather than collapsing the disagreement into a single score or verdict."
        }
      ],
      reviewerViews: [
        {
          reviewer: "Reviewer A",
          stance: "Provisionally favorable",
          summary:
            "Sees the essay as a bounded governance overlay that could make commissioned analytical work easier to inspect without claiming to determine truth.",
          bullets: [
            "The authors start from a real administrative problem around outsourced analytical opacity.",
            "The proposal repeatedly limits its scope and does not present itself as an authorship detector or universal trust system.",
            "Even partial provenance records could improve procurement oversight and downstream review."
          ]
        },
        {
          reviewer: "Reviewer B",
          stance: "Substantively skeptical",
          summary:
            "Sees the essay as importing supply-chain traceability logic into a domain where interpretation remains contested no matter how much logging is performed.",
          bullets: [
            "Analytical texts are not material objects whose meaning stabilizes through trace records alone.",
            "The proposal risks procedural theater by giving agencies a cleaner interface for uncertainty rather than better judgment.",
            "Burden and gaming dynamics may swamp the intended transparency gains."
          ]
        }
      ]
    },
    workflow: {
      strongest:
        "The text is strongest where it diagnoses a real procurement problem and draws explicit boundaries around what the proposed provenance layer would not do.",
      weakest:
        "It is weakest on the conceptual leap from provenance logging to warranted trust in interpretive analytical work, and on the practical burden this would impose.",
      tryingToDo:
        "The essay is trying to carve out a middle path between naive trust in polished outputs and impossible demands for full epistemic certainty.",
      uncertainty:
        "My assessment remains uncertain at the deepest level: I am not yet sure whether the proposal is a tractable governance tool or a category error with good rhetoric.",
      changeAssessment:
        "I would revise upward if a narrow pilot showed genuine oversight benefits without excessive burden. I would revise downward if the proposal could not specify what provenance records actually change in review practice.",
      deeperReview:
        "Yes, but only with domain-specific follow-up across procurement, research methods, and administrative law.",
      contestStructuredReading:
        "Yes, partly. The current structured reading is appropriately careful, but I would insist on keeping the trust implication explicitly unsettled.",
      revisePassport:
        "Yes. The passport should remain revisable and visibly contested until stronger domain review narrows the claim.",
      secondary: [
        {
          label: "Originality",
          value: "High but unstable",
          note: "Distinctive idea whose value depends on contested assumptions."
        },
        {
          label: "Coherence",
          value: "Mixed",
          note: "Readable and disciplined in places, unstable in others."
        },
        {
          label: "Evidence support",
          value: "Partial",
          note: "Problem diagnosis is plausible; mechanism support is limited."
        },
        {
          label: "Overclaim risk",
          value: "Contested",
          note: "Scope limits help, but some implications may still run too far."
        },
        {
          label: "Review confidence",
          value: "Low to moderate",
          note: "Confidence is capped by active reviewer disagreement."
        },
        {
          label: "Domain fit",
          value: "High for specialist follow-up",
          note: "Needs the right reviewers, not a fast queue decision."
        }
      ]
    }
  }
];

export const defaultDocumentSlug = documentCases[0].slug;
export const contestedDocumentSlug = "civic-provenance-ledger";

export function getDocumentBySlug(slug: string) {
  return documentCases.find((document) => document.slug === slug);
}

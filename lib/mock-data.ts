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
  reviseReviewNote: string;
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
  reviewNote: {
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
    reviewNote: {
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
      reviseReviewNote:
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
    reviewNote: {
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
      reviseReviewNote:
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
    slug: "state-of-ai-2025",
    profileLabel: "Large consulting report",
    title: "The State of AI in 2025: Agents, Innovation, and Transformation",
    shortTitle: "State of AI 2025",
    author: "QuantumBlack, AI by McKinsey",
    type: "Survey report / consulting analysis",
    submissionContext:
      "McKinsey Global Survey report from November 2025, used here as a large-document Trust Layer test case.",
    landingSummary:
      "Polished and data-rich; check the leap from survey patterns to prescriptions.",
    previewNote:
      "Real case: a polished, data-heavy AI market report that is useful but needs careful separation between survey evidence and consulting narrative.",
    deck:
      "The report argues that AI use is now widespread, agent use is emerging, and enterprise value remains limited unless organizations redesign workflows and treat AI as a transformation and innovation agenda.",
    textSections: [
      {
        heading: "Broad adoption, limited scale",
        zone: "Main claim",
        summary:
          "The report's strongest descriptive claim is that AI use is common, but enterprise-wide scaling and financial impact remain limited.",
        paragraphs: [
          "The report says nearly two-thirds of respondents have not yet begun scaling AI across the enterprise, while 62 percent are at least experimenting with agents.",
          "Only 39 percent report any enterprise-level EBIT impact, and most of those report less than 5 percent EBIT impact from AI."
        ]
      },
      {
        heading: "The value story shifts from pilots to management practice",
        zone: "Evidence-bearing area",
        summary:
          "The report links high performance to growth goals, workflow redesign, leadership ownership, investment and human validation practices.",
        paragraphs: [
          "High performers are defined as respondents reporting more than 5 percent EBIT impact and significant value; they are more likely to pursue transformative change and redesign workflows.",
          "The report emphasizes human validation, operating model, technology, data, talent and adoption practices that resemble McKinsey's Rewired transformation playbook."
        ]
      },
      {
        heading: "Survey evidence does not settle the causal story",
        zone: "What needs attention",
        summary:
          "The document is not shallow in the sense of having no evidence, but its strongest prescriptive claims depend on self-reported correlations and a consulting transformation frame.",
        paragraphs: [
          "The workflow-redesign result comes from a relative weights analysis of survey variables, not a direct experimental test.",
          "The survey uses 1,993 respondents in 105 nations and weights responses by national contribution to global GDP; this supports breadth but not causal proof."
        ]
      }
    ],
    overlay: {
      centralArgument:
        "AI adoption is broad but still shallow at enterprise scale; the organizations reporting the most value combine ambitious goals, workflow redesign, leadership ownership, investment and human-in-the-loop practices.",
      mainClaimZones: [
        {
          label: "Adoption is broad, scaling is limited",
          summary: "Regular AI use is widespread, but most organizations remain in experimentation or piloting rather than enterprise scaling."
        },
        {
          label: "Agents are visible but not widespread",
          summary: "The report finds high curiosity in agents, but actual scaling appears concentrated and function-specific."
        },
        {
          label: "Transformation beats efficiency-only framing",
          summary: "The report's prescriptive center is that high performers pursue growth or innovation and redesign workflows, not just cost reduction."
        }
      ],
      evidenceAreas: [
        {
          label: "Survey base",
          summary: "The report is based on 1,993 respondents across 105 nations, with weighting by national contribution to global GDP."
        },
        {
          label: "EBIT and qualitative impact",
          summary: "The report distinguishes limited enterprise-wide EBIT impact from stronger self-reported innovation, customer and employee indicators."
        },
        {
          label: "Risk mitigation evidence",
          summary: "The report records both increasing mitigation activity and negative consequences, especially inaccuracy."
        }
      ],
      uncertaintyZones: [
        {
          label: "Causality",
          summary: "The report shows patterns among self-described high performers, but does not prove that the listed practices caused the reported value."
        },
        {
          label: "Vendor-frame risk",
          summary: "The prescriptions overlap with McKinsey's transformation playbook, so the reader should separate survey findings from service-positioning logic."
        },
        {
          label: "Outcome measurement",
          summary: "Some outcomes are financial, but many are qualitative self-reports such as innovation, satisfaction and differentiation."
        }
      ],
      reviewFocus: [
        "Check definitions: regular AI use, scaling, AI agents, high performer and significant value.",
        "Separate descriptive survey findings from advice about transformation, workflow redesign and investment.",
        "Ask whether the report is useful as market intelligence, not whether it proves a general theory of AI value capture."
      ],
      reviewMap: [
        {
          step: "Survey read",
          emphasis: "Check sample, definitions, self-reporting and weighting."
        },
        {
          step: "Prescription check",
          emphasis: "Ask which recommendations follow from evidence and which come from consulting priors."
        },
        {
          step: "Use-case decision",
          emphasis: "Use for market orientation, not as standalone proof of enterprise AI strategy."
        }
      ],
      reviewStatus:
        "Prepared first reading only. The report is not dismissed as shallow; the main check is how far survey data support the transformation claims.",
      quickSignals: [
        { label: "Presentation polish", value: "High", tone: "promising" },
        { label: "Survey base", value: "Substantial", tone: "promising" },
        { label: "What needs checking", value: "Causal leap", tone: "fragile" },
        { label: "Review priority", value: "Bounded review", tone: "steady" }
      ]
    },
    reviewNote: {
      currentSynthesis:
        "This is not merely polished but shallow. It is a useful, data-rich market report with a clear survey base. Its limits are elsewhere: self-reported outcomes, consulting-frame prescriptions and an uncertain causal bridge from management practices to enterprise value.",
      strengths: [
        "Large survey base with explicit dates, sample size, country coverage and weighting note.",
        "Separates broad AI adoption from limited enterprise-level value, which makes the report more useful than a simple hype deck.",
        "Includes risk mitigation and human validation rather than presenting AI scaling as frictionless automation."
      ],
      weaknesses: [
        "Many important outcomes are self-reported and qualitative, so they should not be treated as hard enterprise-performance measures.",
        "The causal story from ambition, workflow redesign and human validation to value remains underdetermined by survey evidence.",
        "The report's prescriptions overlap with a consulting transformation playbook, creating possible sponsor-positioning bias."
      ],
      readingStance:
        "Read as a credible market-intelligence report and a useful demonstration of Trust Layer on a large document. Do not use it alone as proof that any specific AI transformation program will create value.",
      disagreement:
        "Reviewers may disagree on whether the report is a strong evidence-based analysis or a polished consulting narrative with a strong survey appendix. The current reading keeps both possibilities visible.",
      verificationNeeds: [
        "Inspect survey definitions, especially regular use, scaling, high performer, significant value and AI agent.",
        "Check whether relative weights analysis is enough to support the workflow-redesign and management-practice claims.",
        "Compare the report's prescriptions with independent enterprise AI adoption evidence outside the McKinsey frame."
      ],
      dimensions: [
        {
          name: "Originality",
          state: "Moderate",
          note: "The broad story is familiar, but the 2025 survey gives it timely structure.",
          width: 55,
          tone: "steady"
        },
        {
          name: "Coherence",
          state: "Currently coherent",
          note: "The report has a clear sequence from adoption to agents, value, practices, workforce and risks.",
          width: 82,
          tone: "promising"
        },
        {
          name: "Evidence grounding",
          state: "Substantial but bounded",
          note: "The survey base is substantial, but many outcomes are self-reported.",
          width: 72,
          tone: "steady"
        },
        {
          name: "Overclaim restraint",
          state: "Mixed",
          note: "Descriptive claims are stronger than the transformation prescriptions.",
          width: 58,
          tone: "fragile"
        },
        {
          name: "Review stability",
          state: "Bounded review",
          note: "Enough confidence for market orientation, not for causal conclusions.",
          width: 66,
          tone: "steady"
        }
      ],
      reviewHistory: [
        {
          stage: "Source intake",
          actor: "Trust Layer demo",
          date: "May 3, 2026",
          note: "McKinsey State of AI 2025 PDF added as the third example case."
        },
        {
          stage: "Structured reading",
          actor: "Prototype facilitator",
          date: "May 3, 2026",
          note: "Separated survey evidence, consulting narrative, uncertainty zones and review focus."
        },
        {
          stage: "Review note gate",
          actor: "Prototype facilitator",
          date: "May 3, 2026",
          note: "Recommended bounded review rather than automatic dismissal or specialist escalation."
        }
      ]
    },
    workflow: {
      strongest:
        "The report is strongest as a broad market snapshot: adoption is high, agent scaling is early, enterprise EBIT impact remains limited and risk mitigation is visible.",
      weakest:
        "What needs checking is the jump from survey correlations to prescriptive claims about transformation, workflow redesign and value capture.",
      tryingToDo:
        "The report is trying to show that AI value depends less on tool rollout and more on organisational redesign, leadership, investment and human validation.",
      uncertainty:
        "Uncertainty remains around causality, self-reporting bias and how much of the report is evidence versus consulting positioning.",
      changeAssessment:
        "I would revise upward if independent datasets showed the same link between workflow redesign and enterprise value; downward if definitions or sampling are weak.",
      deeperReview:
        "Yes, but bounded. A specialist should review survey methodology and the evidence-to-prescription bridge, not line-edit the whole report.",
      contestStructuredReading:
        "Contest any reading that treats the report as empty consulting polish. It has real survey evidence, but its prescriptive claims need checking.",
      reviseReviewNote:
        "Yes. Revise the review note after checking definitions, sample composition and whether the transformation claims exceed the survey data.",
      secondary: [
        {
          label: "Originality",
          value: "Moderate",
          note: "The broad story is familiar, but the 2025 survey gives it timely structure."
        },
        {
          label: "Coherence",
          value: "High",
          note: "The report has a clear sequence from adoption to agents, value, practices, workforce and risks."
        },
        {
          label: "Evidence support",
          value: "Moderate-high",
          note: "The survey base is substantial, but many outcomes are self-reported."
        },
        {
          label: "Overclaim risk",
          value: "Moderate",
          note: "Descriptive claims are stronger than the transformation prescriptions."
        },
        {
          label: "Review confidence",
          value: "Moderate",
          note: "Enough confidence for market orientation, not for causal conclusions."
        },
        {
          label: "Domain fit",
          value: "High",
          note: "Good fit for enterprise AI strategy and market intelligence review."
        }
      ]
    }
  },
  {
    slug: "why-ai-isnt-going-to-make-art",
    profileLabel: "Conceptual essay / disagreement-visible",
    title: "Why A.I. Isn't Going to Make Art",
    shortTitle: "Why AI isn't making art",
    author: "Ted Chiang",
    type: "Conceptual essay",
    submissionContext:
      "Published in The New Yorker as a Weekend Essay on August 31, 2024; used here as a real conceptual-essay case with safe paraphrased source cues.",
    landingSummary:
      "Strong conceptual frame; disagreement remains visible around art, intention, and machine generation.",
    previewNote:
      "Real case: a conceptual essay that argues AI-generated output lacks the human choices that make art, while leaving room for disagreement about tools, authorship, and intention.",
    deck:
      "Ted Chiang's essay argues that generative AI may produce artifacts, but art depends on intentional choices across many scales. The useful disagreement is whether this clarifies art or defines it too narrowly.",
    textSections: [
      {
        heading: "The essay shifts the question from output to intention",
        zone: "Core idea",
        summary:
          "The essay argues that the relevant question is not whether AI can produce artifacts that resemble art, but whether it participates in the intentional practice that makes art.",
        paragraphs: [
          "The piece is useful for Trust Layer because it is not a memo asking for evidence-first approval. It is a conceptual essay trying to define what is at stake when AI systems generate culture-like outputs.",
          "A good first reading should therefore preserve the distinction the essay makes, rather than flatten the text into simple claims about AI capability."
        ]
      },
      {
        heading: "The strongest move is conceptual, not empirical",
        zone: "New distinction",
        summary:
          "The essay separates artifact production from artistic agency, which makes it a conceptual-essay case rather than a policy report.",
        paragraphs: [
          "The essay's force comes from a distinction: an artifact can satisfy surface expectations while still lacking the chain of intention and choice that we usually associate with art-making.",
          "That makes source checking different here. The reviewer is not simply asking whether data supports a claim; the reviewer is asking whether the definition of art and agency is persuasive."
        ]
      },
      {
        heading: "The disagreement is real",
        zone: "Alternative readings",
        summary:
          "One reading finds a precise account of art as intentional practice; another sees a restrictive human-centered definition that underplays tool-mediated creativity.",
        paragraphs: [
          "A favorable reviewer may say the essay names something important: AI generation changes the relation between tool, maker, and finished work.",
          "A skeptical reviewer may answer that art has always involved tools, delegation, constraints, and procedures. On that reading, the essay clarifies one position but does not close the debate."
        ]
      }
    ],
    overlay: {
      centralArgument:
        "Art is not merely the production of a pleasing artifact; it involves a chain of human choices, constraints, and intentions that prompt-based generation tends to compress or bypass.",
      mainClaimZones: [
        {
          label: "Artifact versus practice",
          summary: "The essay separates producing an artifact from participating in the practice of making art."
        },
        {
          label: "Choice density",
          summary: "The essay's main standard is the density of choices and revisions made by a human artist."
        },
        {
          label: "Tool objection",
          summary: "The main disagreement is whether AI is merely another tool or whether it removes too much of the maker's decision process."
        }
      ],
      evidenceAreas: [
        {
          label: "Examples from art practice",
          summary: "The essay relies on examples about artistic decision-making rather than statistical evidence."
        },
        {
          label: "Analogy to auto-complete",
          summary: "The auto-complete analogy organizes the essay but should be checked as a framing device, not empirical proof."
        }
      ],
      uncertaintyZones: [
        {
          label: "Definition of art",
          summary: "The essay's force depends on accepting a definition of art centered on intention, choice, and practice."
        },
        {
          label: "Tool-mediated creativity",
          summary: "It remains contestable whether AI tools necessarily bypass artistic agency or can be absorbed into it."
        },
        {
          label: "Audience response",
          summary: "The essay gives less weight to whether viewers can experience AI outputs as art regardless of origin."
        }
      ],
      reviewFocus: [
        "Check whether the distinction between artifact and artistic practice is persuasive.",
        "Ask whether the essay treats AI as categorically different from earlier artistic tools.",
        "Keep disagreement visible: this is a conceptual dispute, not a fact-checking problem."
      ],
      reviewMap: [
        {
          step: "Conceptual read",
          emphasis: "Clarify the definition of art and why intention matters."
        },
        {
          step: "Adversarial read",
          emphasis: "Test the tool objection and cases of assisted or procedural art."
        },
        {
          step: "Disagreement note",
          emphasis: "Record what exactly remains disputed rather than forcing a route verdict."
        }
      ],
      reviewStatus:
        "Prepared first reading only. Source cues are paraphrased because the original is copyrighted; they help checking but do not prove the interpretation.",
      quickSignals: [
        { label: "Conceptual clarity", value: "High", tone: "promising" },
        { label: "Evidence support", value: "Illustrative", tone: "steady" },
        { label: "Disagreement", value: "Visible", tone: "contested" },
        { label: "Review priority", value: "Conceptual review", tone: "promising" }
      ]
    },
    reviewNote: {
      currentSynthesis:
        "No stable review state exists yet. One reading sees a strong account of art as intentional human practice; another sees a restrictive definition that underplays tools, procedure, and audience response.",
      strengths: [
        "Names a real conceptual dispute: whether generated artifacts can be separated from art-making practice.",
        "Offers a clear distinction between surface output and the human choices behind artistic work.",
        "Creates a productive disagreement rather than asking for a simple fact verdict."
      ],
      weaknesses: [
        "The argument depends heavily on a definition of art centered on intention and choice.",
        "It may understate cases where tools, delegation, rules, or procedures are themselves part of artistic agency.",
        "The essay is conceptually strong but not designed to settle the social question of how audiences treat AI outputs."
      ],
      readingStance:
        "Read as a strong conceptual essay with disagreement preserved. Use philosophical and art-practice review, not a generic evidence checklist.",
      disagreement:
        "Reviewer disagreement is substantive, not cosmetic. The core dispute is whether the essay clarifies why art requires human intention or narrows art too much by treating AI as categorically different from earlier tools.",
      verificationNeeds: [
        "Clarify the essay's definition of art and whether it is meant descriptively, normatively, or both.",
        "Compare the argument with tool-mediated, procedural, conceptual, and collaborative art practices.",
        "Ask whether audience reception can matter even if the production process lacks human intention.",
        "Keep the New Yorker article open as the source; this demo uses paraphrased cues, not reproduced text."
      ],
      dimensions: [
        {
          name: "Originality",
          state: "High",
          note: "The distinction is crisp and gives the debate structure.",
          width: 80,
          tone: "promising"
        },
        {
          name: "Coherence",
          state: "Currently coherent",
          note: "The essay has a clear conceptual line.",
          width: 76,
          tone: "promising"
        },
        {
          name: "Evidence grounding",
          state: "Illustrative",
          note: "Support comes through examples and analogies, not empirical proof.",
          width: 48,
          tone: "steady"
        },
        {
          name: "Overclaim restraint",
          state: "Disagreement visible",
          note: "The main risk is narrowing art too quickly.",
          width: 56,
          tone: "contested"
        },
        {
          name: "Review stability",
          state: "Conceptual review",
          note: "No single verdict should be inferred from the first reading.",
          width: 62,
          tone: "contested"
        }
      ],
      reviewHistory: [
        {
          stage: "Initial read",
          actor: "Prototype editor",
          date: "May 3, 2026",
          note: "Selected as a real conceptual essay for the disagreement-visible case."
        },
        {
          stage: "Source handling",
          actor: "Trust Layer",
          date: "May 3, 2026",
          note: "Full text was not reproduced; source cues are paraphrased and link back to the original article."
        },
        {
          stage: "Review note",
          actor: "Conceptual reviewer",
          date: "May 3, 2026",
          note: "Marked as strong but contestable, requiring conceptual rather than evidence-first review."
        },
        {
          stage: "Review state",
          actor: "Prototype facilitator",
          date: "May 3, 2026",
          note: "Kept disagreement visible rather than collapsing the case into a score or verdict."
        }
      ],
      reviewerViews: [
        {
          reviewer: "Reviewer A",
          stance: "Provisionally favorable",
          summary:
            "Sees the essay as a strong account of why art is a practice of intentional choices rather than merely the production of outputs.",
          bullets: [
            "The artifact/practice distinction is clear and useful.",
            "The essay avoids treating output quality alone as the whole question.",
            "It gives reviewers a better vocabulary for discussing authorship, agency, and tools."
          ]
        },
        {
          reviewer: "Reviewer B",
          stance: "Substantively skeptical",
          summary:
            "Sees the essay as relying on a narrow account of art that may underplay how artists have always worked through tools, constraints, and procedures.",
          bullets: [
            "Tool use does not automatically remove artistic agency.",
            "Audience reception may matter more than the essay allows.",
            "The argument may treat AI as categorically different before fully testing borderline cases."
          ]
        }
      ]
    },
    workflow: {
      strongest:
        "The text is strongest where it separates artifact production from intentional artistic practice.",
      weakest:
        "What needs checking is whether the definition of art is too narrow for tool-mediated or procedural creativity.",
      tryingToDo:
        "The essay is trying to show why AI-generated outputs should not be confused with art-making by a human agent.",
      uncertainty:
        "Uncertainty remains around tools, delegation, audience reception, and borderline cases of conceptual or procedural art.",
      changeAssessment:
        "I would revise if a stronger account showed that AI can remain inside a human chain of intention rather than bypass it.",
      deeperReview:
        "Yes. Use conceptual review by someone familiar with aesthetics, art practice, and AI tools.",
      contestStructuredReading:
        "Yes. Keep the disagreement explicit: this is not a weak text, but an arguable conceptual position.",
      reviseReviewNote:
        "Yes. The review note should stay revisable after checking the original article and alternative readings.",
      secondary: [
        {
          label: "Originality",
          value: "High",
          note: "The distinction is crisp and gives the debate structure."
        },
        {
          label: "Coherence",
          value: "High",
          note: "The essay has a clear conceptual line."
        },
        {
          label: "Evidence support",
          value: "Illustrative",
          note: "Support comes through examples and analogies, not empirical proof."
        },
        {
          label: "Overclaim risk",
          value: "Moderate",
          note: "The main risk is narrowing art too quickly."
        },
        {
          label: "Review confidence",
          value: "Moderate",
          note: "Good first reading, but source checking and adversarial review matter."
        },
        {
          label: "Domain fit",
          value: "High",
          note: "Good fit for conceptual essay review."
        }
      ]
    }
  }
];

export const defaultDocumentSlug = documentCases[0].slug;
export const contestedDocumentSlug = "why-ai-isnt-going-to-make-art";

export function getDocumentBySlug(slug: string) {
  return documentCases.find((document) => document.slug === slug);
}

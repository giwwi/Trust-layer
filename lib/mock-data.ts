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
    slug: "municipal-heat-resilience",
    profileLabel: "Strong analytical text",
    title: "Targeting Municipal Heat Resilience Grants Without Penalizing Low-Capacity Cities",
    shortTitle: "Heat resilience grants",
    author: "Rina Patel",
    type: "Policy memo",
    submissionContext:
      "Submitted to a philanthropic climate adaptation fund during an open call for pre-screened municipal policy memos.",
    landingSummary: "Conceptually solid, reasonably supported, and worth specialist review.",
    previewNote: "Useful case: bounded policy argument with visible caveats.",
    deck:
      "The memo argues that heat adaptation grants should weight both heat burden and municipal administrative capacity so low-capacity cities are not screened out by application friction.",
    textSections: [
      {
        heading: "The selection problem is administrative, not just climatic",
        zone: "Claim zone",
        summary:
          "The memo claims many heat resilience grant programs reward application capacity rather than underlying vulnerability.",
        paragraphs: [
          "Most municipal heat adaptation funds say they target risk, yet their intake processes quietly reward staffing depth, grant-writing fluency, and access to consultant support. The result is a familiar distortion: mid-capacity cities with polished applications absorb disproportionate attention while smaller and poorer jurisdictions remain underrepresented in finalist pools.",
          "The memo does not argue that current funders are indifferent to need. It argues something narrower and more plausible: the intake mechanism itself imports an administrative bias that must be corrected before the stated distributional aims of these programs can be taken seriously."
        ]
      },
      {
        heading: "A dual-weight targeting model can correct for hidden exclusion",
        zone: "Evidence-bearing area",
        summary:
          "The author proposes combining heat burden indicators with a municipal capacity index and a manual override for missing-data cases.",
        paragraphs: [
          "The proposed model weights three elements: observed heat burden, exposure-sensitive population share, and municipal implementation capacity. Rather than treating low administrative capacity as a reason to downgrade feasibility, the memo treats it as a reason to reserve technical assistance and adjust scoring. The design is meant to identify cities that are both heat-exposed and structurally less able to compete in conventional calls.",
          "Support is modest but real. The memo pulls from published urban heat mapping work, census-linked vulnerability measures, and a small comparative review of recent climate adaptation competitions. That evidence does not prove the model will outperform every alternative, but it does make the basic mechanism legible rather than purely aspirational."
        ]
      },
      {
        heading: "The argument remains bounded by data portability and implementation design",
        zone: "Interpretive uncertainty",
        summary:
          "The memo explicitly notes where the model may fail when local data are sparse or when legal procurement rules constrain assistance.",
        paragraphs: [
          "Several limits are handled with welcome restraint. The author notes that city-level heat data vary in quality, that some vulnerability indicators lag reality, and that philanthropic programs cannot simply absorb every implementation burden without crowding out local ownership. These are not fatal objections, but they matter for whether the model travels cleanly across jurisdictions.",
          "What remains open is less the moral logic of the targeting proposal than its operational tuning. Reviewers would still need to test which variables are robust across municipalities and whether the recommended technical-assistance layer is financially viable at scale."
        ]
      },
      {
        heading: "The memo earns specialist review by linking diagnosis to a plausible decision rule",
        zone: "Evidence-bearing area",
        summary:
          "The closing section argues for pilot review rather than full rollout and points toward a concrete verification path.",
        paragraphs: [
          "Crucially, the memo does not present the scoring model as a completed procurement instrument. It proposes a pilot review frame: apply the model retrospectively to recent grant cycles, compare finalist composition, and ask whether the adjusted ranking surfaces cities that program officers informally recognize as overlooked.",
          "That move matters because it keeps the text inside the bounds of analytical usefulness. The memo is not asking to bypass expertise. It is asking for domain specialists to inspect a credible alternative decision rule that may improve fairness without pretending to automate judgment away."
        ]
      }
    ],
    overlay: {
      centralArgument:
        "Grant triage for municipal heat resilience should correct for administrative-capacity bias, not merely rank cities by need or by proposal polish.",
      mainClaimZones: [
        {
          label: "Diagnosis",
          summary: "Current calls over-reward cities that can package competence rather than cities facing the sharpest heat burden."
        },
        {
          label: "Mechanism",
          summary: "A dual-weight model can treat low capacity as a support condition instead of an exclusion signal."
        },
        {
          label: "Scope",
          summary: "The proposal is for retrospective testing and specialist review, not immediate automated allocation."
        }
      ],
      evidenceAreas: [
        {
          label: "Comparative grant review",
          summary: "Uses recent adaptation competitions to show how application burden shapes finalist pools."
        },
        {
          label: "Urban heat and vulnerability sources",
          summary: "Pulls from public heat mapping and census-linked exposure measures to ground the burden side of the model."
        },
        {
          label: "Pilotability",
          summary: "Suggests retrospective back-testing rather than speculative deployment claims."
        }
      ],
      uncertaintyZones: [
        {
          label: "Index transportability",
          summary: "Capacity measures may behave differently across municipalities with uneven administrative data."
        },
        {
          label: "Program design spillovers",
          summary: "Technical assistance may improve fairness while also changing incentives in ways the memo does not fully model."
        }
      ],
      reviewFocus: [
        "Check whether the proposed capacity indicators are sufficiently robust across city types.",
        "Verify that the retrospective pilot design can be run using data the funder can actually access.",
        "Ask whether alternative fairness mechanisms would achieve similar results with less complexity."
      ],
      reviewMap: [
        {
          step: "Triage read",
          emphasis: "Separate the fairness diagnosis from the specific scoring model and test whether both hold independently."
        },
        {
          step: "Data check",
          emphasis: "Inspect the portability of the heat burden and municipal capacity measures."
        },
        {
          step: "Policy relevance",
          emphasis: "Confirm that philanthropic grantmaking constraints do not undermine the recommended assistance layer."
        },
        {
          step: "Escalation decision",
          emphasis: "Route to specialist review if the retrospective pilot design looks feasible."
        }
      ],
      reviewStatus: "Illustrative structured reading prepared for triage only. It is not proof of reliable automatic interpretation.",
      quickSignals: [
        { label: "Conceptual coherence", value: "Steady", tone: "steady" },
        { label: "Evidence support", value: "Reasonably supported", tone: "promising" },
        { label: "Overclaim risk", value: "Constrained", tone: "steady" },
        { label: "Review priority", value: "Worth specialist review", tone: "promising" }
      ]
    },
    passport: {
      currentSynthesis:
        "This reads as a credible, bounded policy memo. The core diagnosis is intelligible, the proposed mechanism is specific enough to inspect, and the text is disciplined about where expert follow-up is still needed.",
      strengths: [
        "Names a real allocation problem and ties it to a plausible mechanism rather than a vague fairness appeal.",
        "Uses enough public evidence to make the model inspectable without pretending the evidence is decisive.",
        "Keeps operational claims modest by recommending retrospective testing before live use."
      ],
      weaknesses: [
        "The administrative-capacity index may prove noisy or unstable across municipalities.",
        "The memo does not fully compare its approach against simpler alternatives such as assisted application support without scoring changes.",
        "Cost and governance implications of the technical-assistance layer remain only lightly modeled."
      ],
      readingStance:
        "Read as a serious policy design memo that deserves domain-specific scrutiny before operational adoption.",
      disagreement:
        "Reviewer disagreement is limited at this stage. The main debate is about implementation tuning, not the memo's overall seriousness.",
      verificationNeeds: [
        "Test the proposed ranking model on a recent grant cycle with known applicant outcomes.",
        "Validate whether the capacity measures remain meaningful across small, rural, and fiscally distressed municipalities.",
        "Check legal and programmatic constraints on bundling technical assistance with grant selection.",
        "Compare against lower-complexity fairness interventions."
      ],
      dimensions: [
        {
          name: "Originality",
          state: "Meaningful but not flashy",
          note: "The contribution is less a novel theory than a disciplined decision-rule redesign.",
          width: 68,
          tone: "steady"
        },
        {
          name: "Coherence",
          state: "High",
          note: "Diagnosis, mechanism, and scope fit together cleanly.",
          width: 84,
          tone: "steady"
        },
        {
          name: "Evidence grounding",
          state: "Moderately strong",
          note: "Support is enough for triage and follow-up, though not final operational confidence.",
          width: 72,
          tone: "promising"
        },
        {
          name: "Overclaim restraint",
          state: "Strong",
          note: "The memo is explicit that pilot testing must precede deployment.",
          width: 86,
          tone: "steady"
        },
        {
          name: "Review stability",
          state: "Fairly stable",
          note: "Different readers may debate details, but the broad profile is not highly unstable.",
          width: 78,
          tone: "promising"
        }
      ],
      reviewHistory: [
        {
          stage: "Submission",
          actor: "Program editor",
          date: "April 16, 2026",
          note: "Flagged as analytically stronger than most memo submissions but requiring policy-method review."
        },
        {
          stage: "Structured reading",
          actor: "Internal reviewer",
          date: "April 18, 2026",
          note: "Mapped the core argument and marked implementation variables as the main uncertainty zone."
        },
        {
          stage: "Passport update",
          actor: "Prototype facilitator",
          date: "April 21, 2026",
          note: "Maintained a provisional positive stance without converting it into a final recommendation."
        }
      ]
    },
    workflow: {
      strongest:
        "The memo is strongest where it links a fairness diagnosis to a decision rule that a specialist could actually inspect, critique, and back-test.",
      weakest:
        "It is weakest on the stability of the administrative-capacity index and on whether the technical-assistance layer is affordable at program scale.",
      tryingToDo:
        "The text is trying to reframe grant triage so low-capacity municipalities are not treated as low-merit simply because they are harder to support.",
      uncertainty:
        "My assessment remains uncertain around data portability, comparative alternatives, and real-world program administration constraints.",
      changeAssessment:
        "I would revise upward if retrospective testing showed the model reliably surfaced overlooked high-need cities. I would revise downward if the capacity index proved inconsistent or easily gamed.",
      deeperReview:
        "Yes. Recommend deeper review in a climate adaptation funding context with policy-method and implementation expertise present.",
      contestStructuredReading:
        "Not substantially. I might refine the memo's strongest value as procedural fairness rather than predictive precision, but the current structured reading is directionally sound.",
      revisePassport:
        "Yes, after a specialist reviews the index design and the feasibility of retrospective testing.",
      secondary: [
        {
          label: "Originality",
          value: "Moderate",
          note: "Useful synthesis rather than a radically new policy concept."
        },
        {
          label: "Coherence",
          value: "High",
          note: "The argument holds together across sections with limited slippage."
        },
        {
          label: "Evidence support",
          value: "Moderately strong",
          note: "Enough support for triage, not enough for confident implementation."
        },
        {
          label: "Overclaim risk",
          value: "Low to moderate",
          note: "The memo stays relatively disciplined about scope."
        },
        {
          label: "Review confidence",
          value: "Moderate",
          note: "Confidence is decent but still depends on technical validation."
        },
        {
          label: "Domain fit",
          value: "High",
          note: "Well matched to specialist philanthropic or municipal policy review."
        }
      ]
    }
  },
  {
    slug: "institutional-memory-infrastructure",
    profileLabel: "Strong but speculative text",
    title: "After the Audit: Institutional Memory as Public Infrastructure",
    shortTitle: "Institutional memory",
    author: "Jonas Keller",
    type: "Book proposal fragment",
    submissionContext:
      "Circulated to an academic press editor and two public policy fellows as a concept memo for a longer book project.",
    landingSummary:
      "Strong conceptual framing, low empirical support, and worth conceptual engagement rather than operational use.",
    previewNote: "Useful case with caution: analytically generative, empirically thin.",
    deck:
      "The fragment argues that recurring institutional failure is often a memory problem rather than a monitoring problem, and proposes treating public memory capacity as a form of infrastructure.",
    textSections: [
      {
        heading: "The text reframes institutional failure as memory loss",
        zone: "Claim zone",
        summary:
          "The essay claims that many reforms over-invest in auditing and under-invest in durable institutional memory.",
        paragraphs: [
          "The opening move is conceptual rather than empirical. Keller suggests that governments repeatedly confront the same preventable failures because they remember them episodically rather than infrastructurally. Reports are produced, inquiries are archived, and personnel rotate, but the institution's usable memory remains shallow.",
          "This is a strong framing move because it shifts the conversation away from a simple more-oversight reflex. The text asks whether recurring breakdowns persist not because institutions lack data, but because they lack durable formats for carrying situated lessons across time, teams, and political cycles."
        ]
      },
      {
        heading: "The proposed category of memory infrastructure is suggestive but lightly evidenced",
        zone: "Interpretive uncertainty",
        summary:
          "The essay builds a typology of repositories, rituals, and handoff systems, but empirical support remains fragmentary.",
        paragraphs: [
          "Keller's most interesting conceptual move is to define memory infrastructure as the combined set of repositories, transmission rituals, and obligation-bearing handoffs that keep learned experience from dissolving after a crisis passes. The typology is crisp and likely productive for further research.",
          "What the fragment does not yet do is establish how often this category explains failure better than neighboring explanations such as incentives, underfunding, or political conflict. It offers vivid examples, but the evidentiary role of those examples remains illustrative rather than demonstrative."
        ]
      },
      {
        heading: "The text is valuable as a conceptual invitation, not as a policy instrument",
        zone: "Evidence-bearing area",
        summary:
          "The proposal earns attention by naming a potentially fertile category, while stopping short of actionable proof.",
        paragraphs: [
          "The strongest reading of the fragment is not that it has solved a governance problem, but that it has identified a lens through which specialists might reinterpret a range of governance failures. That matters for editorial and intellectual review because some texts are useful before they are evidentially complete.",
          "Still, the text would be misread if its current rhetoric were translated directly into operational claims. It is not yet ready to justify procurement reform, staffing models, or institutional design choices without much more empirical work."
        ]
      }
    ],
    overlay: {
      centralArgument:
        "Public institutions repeatedly fail because memory capacity is treated as incidental rather than infrastructural, and that category deserves sustained analytical attention.",
      mainClaimZones: [
        {
          label: "Reframing move",
          summary: "Failure is often misread as an oversight deficit when it may be a memory deficit."
        },
        {
          label: "Typology",
          summary: "Repositories, rituals, and handoffs are proposed as elements of institutional memory infrastructure."
        },
        {
          label: "Scope caution",
          summary: "The essay is strongest as conceptual provocation, not as an implementation guide."
        }
      ],
      evidenceAreas: [
        {
          label: "Illustrative cases",
          summary: "Examples help make the concept vivid but do not yet carry broad inferential weight."
        },
        {
          label: "Conceptual distinctions",
          summary: "The typology itself is one of the text's main contributions."
        }
      ],
      uncertaintyZones: [
        {
          label: "Causal reach",
          summary: "It remains unclear when memory is the right explanatory variable versus incentives, politics, or budget constraints."
        },
        {
          label: "Operational translation",
          summary: "The fragment does not yet show how to move from concept to implementable institutional design."
        }
      ],
      reviewFocus: [
        "Test whether the memory-infrastructure category adds explanatory power beyond neighboring governance concepts.",
        "Ask whether the rhetorical confidence of the essay outruns the thinness of its empirical support.",
        "Review as a book or essay proposal rather than a policy design document."
      ],
      reviewMap: [
        {
          step: "Conceptual read",
          emphasis: "Check whether the distinction between audits and memory infrastructure is analytically stable."
        },
        {
          step: "Comparative challenge",
          emphasis: "Look for cases where the proposed framing clearly outperforms other explanations."
        },
        {
          step: "Editorial decision",
          emphasis: "Assess whether the idea is fertile enough to justify extended development."
        }
      ],
      reviewStatus: "Illustrative structured reading only. The decomposition is provisional and contestable.",
      quickSignals: [
        { label: "Conceptual originality", value: "High", tone: "promising" },
        { label: "Evidence support", value: "Thin", tone: "fragile" },
        { label: "Operational suitability", value: "Low", tone: "fragile" },
        { label: "Review priority", value: "Worth conceptual engagement", tone: "promising" }
      ]
    },
    passport: {
      currentSynthesis:
        "This is a strong conceptual fragment with low empirical maturity. It earns attention by naming a potentially generative category, but it should not be treated as ready for high-confidence operational application.",
      strengths: [
        "Introduces a memorable conceptual distinction that could sharpen future governance analysis.",
        "Uses examples well enough to make the thesis legible without overloading the reader.",
        "Signals a potentially substantial long-form project rather than a generic trend essay."
      ],
      weaknesses: [
        "Examples remain illustrative rather than evidentially decisive.",
        "Causal claims about recurring failure may outrun what the fragment currently supports.",
        "The bridge from conceptual framing to actionable institutional design is underdeveloped."
      ],
      readingStance:
        "Read as a concept-rich essay or proposal fragment. Engage intellectually, but do not lean on it for operational decisions.",
      disagreement:
        "Most disagreement is about how much empirical thinness a conceptually ambitious proposal can carry at this stage.",
      verificationNeeds: [
        "Compare the framework against adjacent explanations such as incentive failures or political turnover.",
        "Add cases where memory infrastructure clearly alters outcomes rather than merely re-describes them.",
        "Clarify the intended audience: scholarly monograph, public essay, or policy-adjacent conceptual book."
      ],
      dimensions: [
        {
          name: "Originality",
          state: "High",
          note: "The framing is distinctive and potentially fertile.",
          width: 88,
          tone: "promising"
        },
        {
          name: "Coherence",
          state: "Moderately high",
          note: "The concept hangs together, though causal reach remains uncertain.",
          width: 73,
          tone: "promising"
        },
        {
          name: "Evidence grounding",
          state: "Thin",
          note: "Examples clarify the argument but do not yet substantiate it strongly.",
          width: 34,
          tone: "fragile"
        },
        {
          name: "Overclaim restraint",
          state: "Mixed",
          note: "The proposal is careful in places but occasionally sounds more settled than it is.",
          width: 49,
          tone: "fragile"
        },
        {
          name: "Review stability",
          state: "Moderately stable",
          note: "Readers may agree on the concept's promise while disagreeing on how much that promise currently counts for.",
          width: 61,
          tone: "promising"
        }
      ],
      reviewHistory: [
        {
          stage: "Editorial intake",
          actor: "Press reader",
          date: "April 11, 2026",
          note: "Marked as unusually strong conceptually but not yet anchored enough for a confident acquisition argument."
        },
        {
          stage: "Structured reading",
          actor: "Policy fellow",
          date: "April 17, 2026",
          note: "Separated the value of the framing from the current weakness of the evidence base."
        },
        {
          stage: "Passport update",
          actor: "Prototype facilitator",
          date: "April 20, 2026",
          note: "Emphasized conceptual engagement rather than operational trust."
        }
      ]
    },
    workflow: {
      strongest:
        "The text is strongest where it differentiates memory infrastructure from ordinary auditing and gives readers a fresh conceptual handle on recurring institutional failure.",
      weakest:
        "It is weakest where examples are asked to do causal work they cannot yet bear and where the rhetoric sounds readier for application than the evidence allows.",
      tryingToDo:
        "The fragment is trying to establish a new lens for understanding institutional breakdown and to justify a larger intellectual project around that lens.",
      uncertainty:
        "My assessment remains uncertain about explanatory reach, intended audience, and whether the central concept can survive stronger comparative challenge.",
      changeAssessment:
        "I would revise upward with strong comparative cases showing that memory infrastructure clarifies outcomes better than adjacent concepts. I would revise downward if the category proved mostly metaphorical.",
      deeperReview:
        "Yes, but in a conceptual or editorial context rather than an implementation setting.",
      contestStructuredReading:
        "Only slightly. I might push the current reading to state even more clearly that the text's value is conceptual rather than evidential.",
      revisePassport:
        "Yes, if the author develops a stronger case base or narrows the operational rhetoric.",
      secondary: [
        {
          label: "Originality",
          value: "High",
          note: "The core framing is distinct and memorable."
        },
        {
          label: "Coherence",
          value: "Moderately high",
          note: "Conceptual scaffolding is solid, though causal precision is still thin."
        },
        {
          label: "Evidence support",
          value: "Low",
          note: "Illustrative rather than robust."
        },
        {
          label: "Overclaim risk",
          value: "Moderate",
          note: "Rhetorical force occasionally outruns support."
        },
        {
          label: "Review confidence",
          value: "Moderate",
          note: "Confidence in promise is higher than confidence in current substantiation."
        },
        {
          label: "Domain fit",
          value: "High for editorial review",
          note: "Strong fit for conceptual development, poor fit for operational decision contexts."
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

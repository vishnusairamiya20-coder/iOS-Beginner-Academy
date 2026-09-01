export interface FounderProject {
  id: string;
  title: string;
  category: string;
  badge: string;
  icon: string;
  problemStatement: string;
  technicalArchitecture: string;
  toolsAndApis: string[];
  challengesOvercome: string;
  keyLearnings: string;
  status: 'Production' | 'Active Development' | 'Research Prototype';
}

export interface PromptRecipe {
  id: string;
  title: string;
  styleCategory: string;
  targetAesthetic: string;
  template: string;
  systemInstructionSnippet: string;
  exampleOutputDesc: string;
}

export const FOUNDER_PROJECTS: FounderProject[] = [
  {
    id: 'ios-simulator',
    title: 'iOS Web Simulator & Tactile OS Environment',
    category: 'Full-Stack Systems & UI Architecture',
    badge: 'Flagship OS Project',
    icon: '📱',
    status: 'Production',
    problemStatement:
      'Beginners and cross-platform mobile learners frequently struggle with the steep learning curve of iOS paradigms, gesture vocabularies (Dynamic Island, Control Center, Haptic Touch, Spotlight), and Apple ID ecosystem mechanics. Existing web sandboxes are often static mockups without true tactile feedback or functional device apps.',
    technicalArchitecture:
      'Engineered as a high-density, client-first React 18 + TypeScript runtime wrapped in a modular container architecture. Employs hardware-level Web Audio API synthesis for real-time DTMF dual-tone telephone dialing, haptic click steps, camera shutter acoustics, and authentic lock/unlock transients. Includes gesture recognition state machines, multi-layer modal overlays, and full state persistence.',
    toolsAndApis: [
      'React 18',
      'TypeScript',
      'Tailwind CSS',
      'Web Audio API Synthesizers',
      'MediaDevices / WebRTC Camera API',
      'Lucide React',
      'Canvas Confetti'
    ],
    challengesOvercome:
      'Calibrating fluid multi-touch swipe physics while preventing iframe scroll interference; synthesizing authentic iOS acoustic frequencies purely through programmatic oscillator nodes without external audio assets; and maintaining strict 60 FPS UI rendering during concurrent Dynamic Island animations.',
    keyLearnings:
      'Mastery of component modularity, mathematical corner-nesting radii, event delegation, web audio frequency ramping, and accessible user experience design.'
  },
  {
    id: 'math-logic-engine',
    title: 'Discrete Mathematics & Algorithmic Problem Solver',
    category: 'Mathematical Computing & Logic',
    badge: 'Math & Algorithms',
    icon: '📐',
    status: 'Active Development',
    problemStatement:
      'Abstract algebraic structures, modular arithmetic, and ancient computational algorithms (such as Aryabhata’s Kuttaka algorithm and Euclidean GCD) are often taught with rigid static formulas rather than visual, interactive algorithmic proofs.',
    technicalArchitecture:
      'A TypeScript mathematical computation engine utilizing BigInt precision for arbitrary-precision arithmetic, sieve of Eratosthenes prime factorization trees, dynamic programming modular exponentiation, and SVG-rendered geometric number spirals.',
    toolsAndApis: [
      'TypeScript Math Engine',
      'SVG Parametric Renderers',
      'Euclidean & Euler Totient Algorithms',
      'BigInt Precision Arithmetic'
    ],
    challengesOvercome:
      'Handling computational complexity for large prime factorizations and eliminating recursion stack overflows through memoized iterative transformations.',
    keyLearnings:
      'Bridged the theoretical elegance of ancient Indian mathematics with modern time-complexity optimization and asymptotic algorithmic analysis.'
  },
  {
    id: 'generative-prompt-matrix',
    title: 'Generative AI Mega-Prompt Matrix & Studio',
    category: 'Generative AI & LLM Systems',
    badge: 'AI & Prompt Engineering',
    icon: '✨',
    status: 'Production',
    problemStatement:
      'Standard conversational AI interactions often generate superficial, generic outputs due to unstructured zero-shot prompts and vague stylistic parameters.',
    technicalArchitecture:
      'A multi-stage prompt engineering framework featuring role-anchoring, multi-perspective chain-of-thought decomposition, negative constraint guardrails, and automated token expansion matrices. Integrated with Google AI Studio system instructions for specialized style transformations (commercial toy figurines, Studio Ghibli cinematic anime, and hyper-realistic macro photography).',
    toolsAndApis: [
      'Google AI Studio',
      'Gemini API System Instructions',
      'Structured Prompt Matrices',
      'Markdown Parser & Syntax Engine'
    ],
    challengesOvercome:
      'Preventing style drift in long-context generative runs and creating deterministic JSON output formats for automated UI widget rendering.',
    keyLearnings:
      'Deep appreciation of how clear semantic boundaries, negative constraints, and precise mathematical step-ratios guide language models to produce production-grade creative and technical outputs.'
  },
  {
    id: 'hardware-telemetry',
    title: 'Mobile Diagnostics & System Telemetry Recovery Suite',
    category: 'Hardware Systems & Diagnostics',
    badge: 'Hardware & OS Recovery',
    icon: '🛠️',
    status: 'Research Prototype',
    problemStatement:
      'Diagnosing mobile device hardware malfunctions (display digitizer latency, battery cycle degradation, and logic board firmware panics) usually requires proprietary bench tools and complex manual teardowns.',
    technicalArchitecture:
      'An interactive diagnostic telemetry framework providing virtualized voltage curves, touch grid sampling rate diagnostics, battery impedance simulations, and firmware recovery step-by-step guidance modeled after real-world bench repair workflows.',
    toolsAndApis: [
      'Hardware State Machine',
      'Touch Sampling Matrix',
      'Battery Degradation Simulator',
      'Firmware Bootloader Workflow Engine'
    ],
    challengesOvercome:
      'Accurately modeling non-linear battery discharge curves and simulating digitizer ghost-touch anomalies for realistic troubleshooting education.',
    keyLearnings:
      'Gained deep empathy for the mechanical and silicon layers beneath software abstractions, solidifying full-stack comprehension from micro-soldering to high-level JavaScript engines.'
  }
];

export const PROMPT_RECIPES: PromptRecipe[] = [
  {
    id: 'figurine',
    title: 'Commercial Collectible Action Figurine Style',
    styleCategory: '3D Product & Toy Design',
    targetAesthetic: 'Premium PVC/Vinyl, Studio Softbox Lighting, Blister Pack Box',
    template:
      'Ultra-detailed 3D commercial product photography of [SUBJECT] designed as a collectible designer art toy figurine. Premium matte and gloss vinyl textures, perfectly sculpted proportions, clean parting lines. Resting atop a transparent acrylic display pedestal inside a luxury collector box with minimalist typography. 8k resolution, studio three-point softbox lighting, shallow depth of field, ray-traced reflections.',
    systemInstructionSnippet:
      'Focus strictly on tactile physical materials (smooth PVC, cast resin, metallic chrome trim). Eliminate painterly brushstrokes and digital artifacts. Ensure realistic macro lens perspective (50mm f/1.8).',
    exampleOutputDesc:
      'A miniature cyberpunk developer figurine holding a tiny glowing laptop with precision mechanical joints and a glossy acrylic stand.'
  },
  {
    id: 'ghibli',
    title: 'Classic Hand-Drawn Anime & Watercolor Aesthetic',
    styleCategory: 'Animation & Traditional Art',
    targetAesthetic: 'Studio Ghibli Nostalgia, Lush Gouache Scenery, Golden Hour Glow',
    template:
      'Masterpiece hand-drawn anime animation still depicting [SUBJECT]. Traditional watercolor and gouache background illustration inspired by Hayao Miyazaki and Studio Ghibli. Lush vibrant foliage, fluffy volumetric cumulus clouds, gentle golden hour sunset sunlight filtering through trees. Soft pencil linework, painterly atmospheric depth, nostalgic and heartwarming emotional atmosphere.',
    systemInstructionSnippet:
      'Prioritize organic textures, hand-painted gouache layers, warm amber color palettes, and painterly sky gradients. Avoid harsh modern digital vector gradients.',
    exampleOutputDesc:
      'A young programmer coding under a colossal ancient banyan tree with warm sunset rays reflecting off a glass laptop screen.'
  },
  {
    id: 'photoreal-macro',
    title: 'Hyper-Realistic 8K Macro Engineering Aesthetic',
    styleCategory: 'Industrial & Scientific Photography',
    targetAesthetic: 'Hasselblad H6D-100c, 100mm Macro Lens, Nanometer Surface Textures',
    template:
      'Award-winning extreme macro industrial photograph of [SUBJECT]. Captured on Hasselblad H6D-100c medium format camera with 100mm f/2.8 macro lens. Incredible micro-level detail showing silicon wafer microcircuitry, microscopic laser etchings, tactile anodized aluminum brushed finishes, and pristine optical reflections. Razor-sharp focal plane with silky bokeh backdrop.',
    systemInstructionSnippet:
      'Enforce physical optical parameters: realistic depth of field falloff, authentic chromatic dispersion at edge highlights, and high dynamic range contrast.',
    exampleOutputDesc:
      'A hyper-detailed cross section of a micro-processor die with glowing golden interconnects and silicon lithography.'
  },
  {
    id: 'isometric-clay',
    title: '3D Isometric Claymorphism & Minimalist UI',
    styleCategory: 'Modern UI & Graphic Illustration',
    targetAesthetic: 'Soft Polymer Clay, Pastel Palette, Ambient Occlusion',
    template:
      'Delightful 3D isometric illustration of [SUBJECT]. Rendered with tactile soft polymer clay textures, smooth rounded edges, gentle matte pastel color grading. Beautiful soft ambient occlusion shadows, isometric orthographic 45-degree angle projection, playful miniature laboratory layout with subtle subsurface scattering.',
    systemInstructionSnippet:
      'Maintain exact 45-degree orthographic projection. Use harmonious low-saturation pastel palettes with warm diffuse lighting and tangible clay fingerprint micro-textures.',
    exampleOutputDesc:
      'An isometric developer desk featuring a mini clay server rack, a potted succulent, and a glowing tablet with code.'
  }
];

export const VISHNU_FULL_BIOGRAPHY = `
# Developer Profile & Personal Biography: Vishnu Sai Ramiya
**Class 9 Scholar, Software Engineer, Mathematical Thinker & AI Creator**
*Published: August 2026 | System & Platform Architect*

---

## 1. Executive Introduction & Creator Persona

Vishnu Sai Ramiya is an emerging software engineer, mathematician, and artificial intelligence developer currently completing his Class 9 academic curriculum. Operating at the intersection of rigorous mathematical logic, modern web architecture, and next-generation generative AI, Vishnu represents a new archetype of self-directed technical creators: young scholars who do not merely consume modern technology, but actively disassemble, analyze, and re-engineer it from first principles.

Driven by a core mission to democratize computational thinking and build tactile, highly intuitive software experiences, Vishnu has spearheaded multiple ambitious software initiatives, including the full-featured **iOS Web Simulator & Interactive Sandbox**, complex discrete mathematics calculation engines, and advanced multi-modal generative prompt matrices. His approach to software engineering is rooted in intellectual honesty, relentless curiosity, and an unwavering commitment to craftsmanship.

### Core Competencies & Academic Profile Summary

| Focus Area | Core Technologies & Methodologies | Academic & Creative Milestones |
| :--- | :--- | :--- |
| **Frontend & UI Engineering** | TypeScript, React 18, Tailwind CSS, Vite, HTML5 Canvas, Web Audio API | Creator of full-featured interactive iOS Simulator with haptics & synthesizers |
| **Mathematical Foundations** | Discrete Mathematics, Number Theory, Euclidean Algorithms, Algebraic Logic | Top rankings in school & regional mathematics exhibitions and problem-solving contests |
| **Generative AI & LLM Systems** | Google AI Studio, Gemini API, Mega-Prompting Architectures, System Instructions | Developed specialized style-morphing prompt matrices and contextual AI assistants |
| **Hardware & Systems Mechanics** | Hardware Diagnostics, Logic Board Diagnostics, Mobile Screen/Battery Maintenance | Hands-on experience in component-level device repair and recovery workflows |
| **Platforms & Tooling** | Linux CLI, Git/GitHub, freeCodeCamp, Codecademy, GeeksforGeeks, MDN | Active continuous learner across computer science literature and open-source ecosystems |

---

## 2. Academic Foundation & Mathematical Curiosity

### The Beauty of Mathematical Logic & Historical Foundations
For Vishnu, mathematics is not merely a collection of formulas to memorize for school examinations; it is the universal language of reality and the foundational architecture of computation. His mathematical curiosity spans pure algebra, number theory, and discrete mathematics. He draws profound inspiration from the rich historical legacy of Indian mathematics—particularly the seminal works of **Aryabhata** (who pioneered algorithms for solving indeterminate linear equations through the *Kuttaka* method), **Brahmagupta** (who established foundational arithmetic rules for zero and negative integers), and **Srinivasa Ramanujan** (whose miraculous intuition for infinite series, continued fractions, and partition functions continues to astonish modern mathematical physics).

Vishnu frequently explores how ancient algorithmic methods directly parallel modern computational algorithms. The *Kuttaka* algorithm, for example, is functionally an early realization of the Extended Euclidean Algorithm used extensively in modern public-key cryptography (such as RSA). Understanding these historical origins gives Vishnu a unique perspective on algorithmic efficiency and problem-solving.

### Science & Mathematics Exhibitions
Throughout his middle school and high school journey, Vishnu has been an enthusiastic participant in academic science exhibitions, mathematics fairs, and competitive Olympiads. Rather than presenting generic static charts, Vishnu consistently designs dynamic, interactive demonstrations. In past academic showcases, he presented working geometric visualizers that demonstrated the distribution of prime numbers along the Ulam spiral and interactive models explaining the mechanical efficiency of digital logic gates.

### Mathematical Logic as the Bedrock of Clean Code
In software engineering, Vishnu applies mathematical rigor to every function and component he authors:
- **Invariance & State Predictability**: Treating state transitions as formal mathematical functions with deterministic inputs and outputs ($f(s, a) \rightarrow s'$).
- **Asymptotic Time Complexity**: Evaluating algorithms through the lens of Big-$O$ notation, ensuring that loops, search algorithms, and data structures scale gracefully.
- **Set Theory & Relational Modeling**: Designing component schemas and relational data structures using mathematical set operations (unions, intersections, and complements).

By treating code as applied mathematics, Vishnu produces codebases that are robust, self-documenting, and mathematically sound.

---

## 3. Coding Journey & Technical Stack

### Self-Directed Learning & Platform Mastery
Vishnu's journey into programming began not in a formal university lecture hall, but through self-directed curiosity and disciplined online self-study. He systematically worked through industry-recognized curricula across premier educational platforms:
- **freeCodeCamp**: Built a rock-solid foundation in responsive web design, algorithmic scripting in JavaScript, and accessibility standards.
- **Codecademy & Udemy**: Deepened understanding of object-oriented programming, modern React design patterns, custom hooks, and state management pipelines.
- **GeeksforGeeks**: Explored foundational data structures (linked lists, binary search trees, hash tables, graphs) and classic algorithmic paradigms (divide-and-conquer, dynamic programming, greedy algorithms).
- **MDN Web Docs**: Studied the native browser APIs in exhaustive detail, mastering the Document Object Model (DOM), Web Audio API, WebRTC MediaStream APIs, and the event loop.

### Core Technical Stack & Practical Mastery
Vishnu’s primary technical arsenal includes:
1. **TypeScript / JavaScript**: Writing strict, type-safe code with exhaustive interfaces, union types, generics, and strict null checks.
2. **React 18 & Modern Frameworks**: Leveraging functional components, declarative state reducers, memoization (\`useMemo\`, \`useCallback\`), and resilient context providers.
3. **Web Audio API**: Synthesizing real-time acoustic waveforms (sine, triangle, square, sawtooth) with exponential gain ramps and multi-tone frequency synthesis, bypassing heavy audio assets.
4. **Tailwind CSS & Design Systems**: Implementing mathematically precise optical spacing, WCAG AA compliant contrast ratios, and dynamic dark/light theme switching.
5. **Linux CLI & Developer Tooling**: Proficient in shell scripting, Git version control workflows, package management via npm/yarn/bun, and containerized deployment pipelines.

### Practical Troubleshooting & Hardware Diagnostics
Vishnu recognizes that software cannot exist in a vacuum separated from hardware. To gain an intimate understanding of the physical layers powering computing, he engaged in hands-on mobile device repair and hardware diagnostics:
- **Display Digitizer Repair**: Disassembling damaged smartphone screens, replacing capacitive touch digitizers, and testing multi-touch sampling rates.
- **Battery Cycle & Thermal Analysis**: Analyzing lithium-ion battery impedance curves, charge controller telemetry, and thermal dissipation paths.
- **Firmware & Bootloader Recovery**: Diagnosing boot loops, flashing recovery images via fastboot/ADB, and understanding low-level hardware abstraction layers (HAL).

This physical troubleshooting experience gives Vishnu an exceptional advantage: when a software bug arises, he can reason through the entire vertical stack, from UI render threads down to hardware interrupt handlers.

---

## 4. Generative AI & Tool Exploration

### Advanced Prompt Engineering & Mega-Prompt Architecture
Rather than using AI as a simple conversational toy, Vishnu approaches Large Language Models (LLMs) as highly sophisticated, non-deterministic cognitive engines that require rigorous prompt engineering. He developed modular **Mega-Prompt Templates** that incorporate:
- **Role & Persona Anchoring**: Establishing an authoritative, expert persona with strict behavioral guidelines.
- **Contextual Framing & Negative Constraints**: Explicitly defining what the model *must not* do to eliminate AI clichés, hallucinations, and generic SaaS filler language.
- **Step-by-Step Chain-of-Thought (CoT)**: Guiding models through decomposed analytical phases before generating the final solution.
- **Deterministic Output Schemas**: Enforcing strictly formatted Markdown, JSON, or TypeScript interface outputs for seamless programmatic consumption.

### Creative Style Transformations & Visual Aesthetics
Vishnu has created specialized prompt frameworks for diverse artistic and technical domains:
- **3D Commercial Collectible Figurine Style**: Transforming abstract character concepts into photorealistic vinyl designer toy prototypes complete with blister-pack packaging, studio softbox lighting, and acrylic display stands.
- **Classic Hand-Drawn Anime & Watercolor**: Capturing the lush gouache backgrounds, warm sunlight rays, and emotional atmosphere of traditional Studio Ghibli masterworks.
- **Hyper-Realistic 8K Macro Photography**: Generating scientifically accurate industrial cross-sections with ray-traced reflections, microscopic anodized finishes, and shallow depth of field.

### Hands-on Experience with Google AI Studio & System Instructions
Vishnu actively builds on **Google AI Studio**, utilizing developer system instructions, parameter tuning (temperature, top-p, top-k), and multi-turn contextual prompting. He leverages Gemini models for multimodal image analysis, automated code review, and interactive widget generation.

### Philosophy: AI as an Intellectual Amplifier
Vishnu firmly believes that AI is a **co-creator and intellectual amplifier**, not a shortcut or replacement for human craftsmanship. In his workflow, AI serves as an instantaneous brainstorming partner, a test-case generator, and a syntax synthesizer—while architectural decision-making, mathematical verification, aesthetic judgment, and moral responsibility remain fundamentally human.

---

## 5. Featured Projects & Creative Portfolio

### Project 1: iOS Web Simulator & Tactile OS Sandbox (Flagship)
- **Problem Statement**: Mobile operating systems are intricate ecosystems. Beginners frequently find it challenging to learn gesture vocabularies and interface mechanics on static slides or video tutorials.
- **Architecture**: A client-side simulated operating system built in React 18, TypeScript, and Tailwind CSS. Features custom Web Audio API synthesizers for real-time DTMF dial tones, volume step clicks, and camera shutter sounds. Includes an interactive Lock Screen, Dynamic Island, Control Center, Settings with editable Apple ID profile, Camera with webcam capture, Phone dialpad, and App Store catalog.
- **Challenges Overcome**: Eliminating iframe scroll collisions, ensuring fluid 60fps animations on mobile devices, and synthesizing authentic haptic audio tones without external MP3 files.
- **Key Learnings**: Mastered complex state machines, coordinate gesture detection, and component modularity.

### Project 2: Discrete Mathematics & Algorithmic Solver
- **Problem Statement**: Students often struggle to visualize the dynamic flow of abstract mathematical algorithms like prime factor trees, modular arithmetic, and greatest common divisors.
- **Architecture**: A reactive TypeScript computation engine with arbitrary-precision BigInt arithmetic, visual prime factorization branches, and animated Euclidean steps.
- **Challenges Overcome**: Mitigating stack overflow risks during heavy recursive evaluations and implementing memoized prime sieving.
- **Key Learnings**: Gained deep intuition for algorithmic complexity, recursion limits, and visual mathematical pedagogy.

### Project 3: Generative AI Mega-Prompt Matrix & Studio
- **Problem Statement**: Casual AI prompts often result in flat, uninspired, or hallucinated outputs lacking professional polish.
- **Architecture**: A structured prompt generator and parameter matrix that dynamically compiles role definitions, context parameters, negative constraints, and output templates into production-grade prompts.
- **Challenges Overcome**: Creating reproducible prompt templates that consistently yield high-fidelity results across different LLM parameter variations.
- **Key Learnings**: Discovered the mathematical relationship between token temperature, prompt constraints, and generative fidelity.

### Project 4: Mobile Hardware Telemetry & Diagnostics Console
- **Problem Statement**: Learning hardware repair and diagnostic protocols typically requires expensive physical bench equipment.
- **Architecture**: An interactive software console simulating hardware sensor readouts, battery degradation curves, digitizer touch latency matrices, and recovery bootloader workflows.
- **Challenges Overcome**: Formulating non-linear battery discharge equations and realistic touch latency heatmaps.
- **Key Learnings**: Solidified holistic understanding of the full computing stack from PCB traces to high-level JavaScript.

---

## 6. Future Roadmap & 5-Year Vision

### Short-Term Academic & Technical Milestones (High School)
- **Academic Excellence**: Excel in Class 9 and upcoming senior secondary board curricula with a strong focus on Advanced Mathematics, Physics, and Computer Science.
- **Competitive Programming**: Actively participate in USACO, Codeforces, and national informatics competitions to sharpen algorithmic problem-solving speed.
- **Open-Source Contributions**: Contribute foundational modules to open-source developer tooling, accessible educational utilities, and React component libraries.

### Long-Term Vision (5-Year Horizon)
- **Computer Science & AI Research**: Pursue higher education in Computer Science and Applied Mathematics, conducting research in multimodal neural architectures, efficient local inference models, and human-computer interfaces.
- **Founding Innovative Technologies**: Build software products and developer platforms that empower the next billion young creators to build software effortlessly.
- **Lifelong Learning Mindset**: Maintain an insatiable appetite for discovery, guided by humility, relentless practice, and the belief that the greatest code is that which elevates human potential.

---

### Contact & Creator Verification
- **Creator**: Vishnu Sai Ramiya
- **Official Account**: \`vishnusairamiya20@gmail.com\`
- **Apple Account ID**: \`vishnusairamiya20@gmail.com\`
- **Role**: OS Architect, Developer & AI Enthusiast
- **Current Standing**: Class 9 Student & Independent Builder
`;

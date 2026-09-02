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
# Developer Profile & Personal Biography: Vishnu Sai Ramiya & Rohan R. Potdar
**Class 9 Scholars, Technology Innovators, Mathematical Thinkers & AI Creators**
*Published: August 2026 | System & Platform Architects*

---

## 1. Introduction & Personal Overview

We are **Vishnu Sai Ramiya** and **Rohan R. Potdar**, enthusiastic, curious, and forward-thinking Class 9 students with a deep passion for technology, artificial intelligence, science, and problem-solving. Living in an era defined by rapid technological advancements, we view learning not just as a classroom requirement, but as an exciting journey of discovery. Every day presents an opportunity to explore new concepts, test ideas, and build digital tools that can inspire or help others.

As students navigating the foundational years of high school, we balance our core academic curriculum—ranging from mathematics and physical sciences to language arts and social studies—with self-driven exploration into coding, digital design, and AI applications. We firmly believe that age is no barrier to innovation, and being in Class 9 gives us a unique perspective: we have the curiosity of lifelong learners paired with the drive to build real-world skills early.

### Core Competencies & Academic Profile Summary

| Focus Area | Core Technologies & Methodologies | Academic & Creative Milestones |
| :--- | :--- | :--- |
| **Frontend & UI Engineering** | TypeScript, React 18, Tailwind CSS, Vite, HTML5 Canvas, Web Audio API | Creator of full-featured interactive iOS Simulator with haptics & synthesizers |
| **Academic Foundation** | Mathematics, Physical Sciences, Logic & Analytical Reasoning | Top rankings in school & regional mathematics exhibitions and problem-solving contests |
| **Generative AI & LLM Systems** | Google AI Studio, Gemini API, Mega-Prompting Architectures, System Instructions | Developed specialized style-morphing prompt matrices and contextual AI assistants |
| **Hardware & Systems Mechanics** | Hardware Diagnostics, Logic Board Diagnostics, Mobile Screen/Battery Maintenance | Hands-on experience in component-level device repair and recovery workflows |
| **Platforms & Tooling** | Linux CLI, Git/GitHub, freeCodeCamp, Codecademy, GeeksforGeeks, MDN | Active continuous learner across computer science literature and open-source ecosystems |

---

## 2. Academic Foundation & Core Interests

### 1. Mathematics & Analytical Thinking
Mathematics is the underlying language of logic, technology, and science. In Class 9, where algebra, geometry, and logical reasoning become more complex, I enjoy breaking down intricate problems into manageable steps. This analytical approach not only helps me perform well academically but also fuels my ability to think algorithmically when working with software and AI tools.

### 2. Science & Curiosity about the Natural World
Science inspires me to ask "why" and "how." Whether exploring physics concepts like force and motion, understanding chemical reactions, or learning about biological systems, science keeps my sense of wonder active. I enjoy practical experiments, scientific inquiry, and applying theoretical knowledge to understand how modern engineering and technology function.

### 3. Technology & Artificial Intelligence
My fascination with technology goes beyond being a consumer—I am driven to be a creator. The rise of artificial intelligence has opened unprecedented avenues for learning and building. Exploring platforms like Google AI Studio, prompt engineering, and digital app building allows me to blend creativity with computational thinking. I enjoy experimenting with AI models to generate solutions, write interactive content, and design user-centric applications.

---

## 3. The App & My Vision as a Student Creator

This application—hosted on AI Studio—represents a key milestone in my practical learning journey. Building and configuring an AI-driven app requires a blend of creative vision, structured logic, and continuous testing.

### Why I Created This App
As a Class 9 student, I wanted to harness the power of AI to address practical needs, enhance learning experiences, or provide interactive utility to users. Creating this application allowed me to apply technical concepts in a hands-on environment. It bridges the gap between textbook knowledge and practical digital creation.

### Key Goals of My Project:
- **Interactive Experience**: Providing users with an intuitive, seamless, and responsive interface powered by intelligent prompts.
- **Continuous Improvement**: Using feedback to continuously refine, debug, and update the app’s performance and functionality.
- **Skill Enhancement**: Learning the mechanics of generative AI models, API integration concepts, and prompt design while in high school.

---

## 4. Skills & Personal Strengths

Through my academic journey and self-guided projects, I have cultivated a diverse set of technical, creative, and interpersonal skills:

| Category | Skills & Attributes |
| :--- | :--- |
| **Technical & Digital** | Basic Programming Concepts, AI Prompt Engineering, App Layout Design, Digital Content Creation |
| **Problem Solving** | Logical Analysis, Debugging Ideas, Mathematical Aptitude, Structured Thinking |
| **Soft Skills** | Adaptability, Time Management, Curiosity, Determination, Clear Communication |

---

## 5. Co-Curricular Activities & Personal Hobbies

A well-rounded individual develops skills both inside and outside the digital ecosystem. Beyond academics and coding, my interests include:
- **Reading & Research**: Exploring articles, books, and educational content on emerging technology, science trivia, and inspiring biographies of innovators.
- **Creative Design**: Working on visual layouts, user interface concepts, and digital art to complement technical projects.
- **Collaborative Projects**: Participating in school events, group discussions, and science exhibitions where teamwork and creative brainstorming are essential.
- **Sports & Physical Fitness**: Staying active through sports and outdoor activities, which helps keep my mind sharp, focused, and energized for intellectual challenges.

---

## 6. Values, Philosophy & Future Goals

### My Core Beliefs
- **Learning by Doing**: Reading theory is essential, but constructing real projects—like this AI app—is where real understanding happens.
- **Consistency Beats Intensity**: Small, daily improvements in skills, knowledge, and habit formation yield huge results over time.
- **Ethics in Technology**: As AI becomes an integral part of daily life, using technology responsibly, ethically, and constructively is paramount.

### Looking Ahead
As I progress through Class 9 and prepare for higher secondary education, my objective is to continue deepening my understanding of STEM (Science, Technology, Engineering, and Mathematics) disciplines. In the near future, I plan to expand my programming capabilities, explore computer science fundamentals, and build more sophisticated AI apps that solve real-world problems.

Long-term, I aspire to pursue higher studies in computer science and technology, contributing meaningfully to modern engineering, software development, and AI research.

---

## 7. Summary Statement

> "We are Vishnu Sai Ramiya and Rohan R. Potdar—dedicated students, creative builders, and aspiring technology innovators. Welcome to our app project!"

Thank you for visiting our app page and supporting our learning journey as Class 9 student builders. Your feedback, interaction, and encouragement mean the world to us as we continue to explore, learn, and create!

---

### Contact & Creator Verification
- **Creators**: Vishnu Sai Ramiya & Rohan R. Potdar
- **Official Account**: \`vishnu.rohan.builders@gmail.com\`
- **Apple Account ID**: \`vishnu.rohan@icloud.com\`
- **Role**: Technology Innovators, Student Builders & AI Creators
- **Current Standing**: Class 9 Students & Co-Builders
`;

export const IMG_PREFIX = 'https://login.skillizee.io'

export const IMAGES = {
  wearableHeader: `${IMG_PREFIX}/s/articles/69df0d2d01d6d5ff618853fe/images/image-20260415092950-1.png`,
  smartICard: `${IMG_PREFIX}/s/articles/69df0d2d01d6d5ff618853fe/images/image-20260415092950-2.png`,
  smartBag: `${IMG_PREFIX}/s/articles/69df0d2d01d6d5ff618853fe/images/image-20260415092950-3.png`,
  smartBand: `${IMG_PREFIX}/s/articles/69df0d2d01d6d5ff618853fe/images/image-20260415092950-4.png`,
  smartRing: `${IMG_PREFIX}/s/articles/69df0d2d01d6d5ff618853fe/images/image-20260415092950-5.png`,
  startupSheet: `${IMG_PREFIX}/s/articles/69df0d2d01d6d5ff618853fe/images/image-20260415092950-6.png`,
}

export const DEVICES = [
  { id: 'i-card', name: 'Smart I-Card', img: IMAGES.smartICard, emoji: '🪪', desc: 'Digital identity on the go', color: 'bubblegum' },
  { id: 'bag', name: 'Smart Bag', img: IMAGES.smartBag, emoji: '🎒', desc: 'The bag that thinks!', color: 'sky' },
  { id: 'band', name: 'Smart Band', img: IMAGES.smartBand, emoji: '⌚', desc: 'Power on your wrist', color: 'sunshine' },
  { id: 'ring', name: 'Smart Ring', img: IMAGES.smartRing, emoji: '💍', desc: 'Tech at your fingertip', color: 'lavender' },
] as const

export const IDEA_EXAMPLES = [
  { emoji: '🆘', text: 'Send a safety alert when someone is in trouble' },
  { emoji: '📍', text: 'Track a school bag if it gets lost' },
  { emoji: '📝', text: 'Remind about homework or daily tasks' },
  { emoji: '🌟', text: 'Glow in the dark for safety' },
  { emoji: '🏃', text: 'Count steps or physical activity' },
  { emoji: '📞', text: 'Store important information like emergency contacts' },
]

export const ROLES = [
  { id: 'creator', emoji: '🔬', title: 'Product Creator', focus: 'Idea & Features', color: 'bubblegum', say: '"This is how our smart wearable works…"' },
  { id: 'innovator', emoji: '💡', title: 'Innovation Expert', focus: 'USP Focus', color: 'sunshine', say: '"What makes our wearable unique is…"' },
  { id: 'designer', emoji: '🎨', title: 'Design Leader', focus: 'Design & Look', color: 'sky', say: '"Our wearable design is special because…"' },
  { id: 'money', emoji: '💰', title: 'Money Manager', focus: 'Pricing', color: 'lime', say: '"We priced our product at… because…"' },
  { id: 'marketing', emoji: '📣', title: 'Marketing Star', focus: 'Promotion', color: 'lavender', say: '"We will promote our product by…"' },
] as const

export const SKILLS = [
  { emoji: '🧠', name: 'Product Thinking' },
  { emoji: '🎨', name: 'Creativity & Design' },
  { emoji: '💡', name: 'Innovation' },
  { emoji: '💰', name: 'Financial Basics' },
  { emoji: '🎤', name: 'Presentation Skills' },
  { emoji: '🤝', name: 'Teamwork' },
  { emoji: '💪', name: 'Confidence' },
  { emoji: '🔍', name: 'Problem Solving' },
]

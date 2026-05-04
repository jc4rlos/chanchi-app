const EMOJI_GROUPS = [
  {
    label: 'Finanzas',
    emojis: ['💰', '💵', '💸', '💳', '🏧', '📈', '🪙', '💹', '🏦', '💎'],
  },
  {
    label: 'Trabajo',
    emojis: ['💼', '👔', '🖥️', '💻', '🏢', '🔧', '⚙️', '📊', '📋', '🖨️'],
  },
  {
    label: 'Comida',
    emojis: ['🛒', '🍕', '🍔', '🌮', '🍜', '☕', '🥗', '🍱', '🥩', '🍣'],
  },
  {
    label: 'Transporte',
    emojis: ['🚗', '🚌', '✈️', '🚂', '🚕', '🏍️', '🚲', '⛽', '🚐', '🛵'],
  },
  {
    label: 'Hogar',
    emojis: ['🏠', '🏡', '🔑', '🛋️', '💡', '🪴', '🧹', '🔒', '🛏️', '🚿'],
  },
  {
    label: 'Salud',
    emojis: ['❤️', '💊', '🏥', '🩺', '🏋️', '🧘', '🦷', '👁️', '🩹', '🧬'],
  },
  {
    label: 'Entrete.',
    emojis: ['🎬', '🎮', '🎵', '🎤', '🎭', '📚', '🎨', '🏖️', '⚽', '🎯'],
  },
  {
    label: 'Compras',
    emojis: ['👗', '👟', '👜', '💄', '🛍️', '🎁', '💍', '👒', '🧴', '👔'],
  },
]

type Props = {
  value: string
  onChange: (emoji: string) => void
}

export const EmojiPicker = ({ value, onChange }: Props) => (
  <div className='flex flex-col gap-3'>
    {EMOJI_GROUPS.map((group) => (
      <div key={group.label}>
        <p className='mb-1.5 text-[10px] font-semibold tracking-wide text-muted uppercase'>
          {group.label}
        </p>
        <div className='flex flex-wrap gap-1'>
          {group.emojis.map((emoji) => (
            <button
              key={emoji}
              type='button'
              onClick={() => onChange(emoji)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xl transition-all ${
                value === emoji
                  ? 'bg-primary-light scale-110 ring-2 ring-primary'
                  : 'bg-border hover:bg-border/70'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
)

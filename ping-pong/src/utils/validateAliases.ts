import { PlayerAliases } from '../types/types'

const bannedWords = [
  'idiot',
  'stupid',
  'dumb',
  'moron',
  'loser',
  'terrorist',
  'kkk',
  'fascist',
  'admin',
  'moderator',
  'staff',
  'owner',
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'bastard',
  'cunt',
  'nigger',
  'nigga',
  'retard',
  'slut',
  'whore',
  'faggot',
  'dick',
  'piss',
  'damn',
  'crap',
  'bollocks',
  'bugger',
  'bloody',
  'twat',
  'cock',
  'arse',
  'wanker',
  'motherfucker',
  'cocksucker',
  'chink',
  'gook',
  'spic',
  'kyke',
  'kike',
  'jew',
  'hate',
  'terror',
  'racist',
]

export const validateAliases = (
  aliases: PlayerAliases
): Partial<PlayerAliases> => {
  const errors: Partial<PlayerAliases> = {}

  Object.entries(aliases).forEach(([key, value]) => {
    const trimmed = value.trim()

    if (!trimmed) {
      errors[key as keyof PlayerAliases] = 'Alias is required'
    } else if (trimmed.length < 2) {
      errors[key as keyof PlayerAliases] = 'Alias must be at least 2 characters'
    } else if (trimmed.length > 10) {
      errors[key as keyof PlayerAliases] =
        'Alias must be less than 10 characters'
    } else {
      const aliasRegex = /^[a-zA-Z0-9 _-]+$/
      if (!aliasRegex.test(trimmed)) {
        errors[key as keyof PlayerAliases] = 'Alias contains invalid characters'
      } else if (bannedWords.some((word) => trimmed.includes(word))) {
        errors[key as keyof PlayerAliases] = 'Alias contains banned words'
      }
    }
  })

  const values = Object.values(aliases).map((v) => v.trim().toLowerCase())
  values.forEach((alias, index) => {
    if (alias && values.indexOf(alias) !== index) {
      errors[Object.keys(aliases)[index] as keyof PlayerAliases] =
        'Alias must be unique'
    }
  })

  return errors
}

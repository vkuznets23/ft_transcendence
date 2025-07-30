import { PADDLE_HEIGHT_MAP } from '../utils/constants'

export type PaddleSizeOption = keyof typeof PADDLE_HEIGHT_MAP
export type DifficultyOption = 'easy' | 'medium' | 'hard'
export type AIDifficultyOption = 'easy' | 'hard'

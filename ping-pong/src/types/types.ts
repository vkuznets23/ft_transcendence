import { PADDLE_HEIGHT_MAP } from '../utils/constants'

export type PaddleSizeOption = keyof typeof PADDLE_HEIGHT_MAP
export type DifficultyOption = 'easy' | 'medium' | 'hard'
export type AIDifficultyOption = 'easy' | 'hard'
export type IsTournament = 'CasualGame' | 'tournament'

// export type Player = {
//   id: string
//   name: string
//   isAI: boolean
// }

// export type Match = {
//   player1: Player
//   player2: Player
//   winner?: Player
// }

// export type TournamentState = {
//   players: Player[]
//   currentRoundMatches: Match[]
//   currentMatchIndex: number
//   roundNumber: number
//   winner?: Player
// }

export type PlayerID = 'player1' | 'player2' | 'player3' | 'player4'

export type TournamentWins = {
  player1: number
  player2: number
}

export type Match = {
  playerA: PlayerID | null
  playerB: PlayerID | null
  scoreA: number
  scoreB: number
  winner: PlayerID | null
}

export type TournamentState = {
  matches: Match[]
  currentMatchIndex: number
  finished: boolean
}
